import { Processor, WorkerHost } from '@nestjs/bullmq';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Job } from 'bullmq';
import { MEDIA_QUEUE } from 'src/config/constants';
import fs from 'fs/promises';
import crypto from 'crypto';
import path from 'path';
import ffmpeg from 'fluent-ffmpeg';
import { ConfigService } from '@nestjs/config';
import { MinioService } from 'src/modules/minio/minio.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Post, PostStatus } from 'src/database/entities/post.entity';
import { Repository } from 'typeorm';

@Processor(MEDIA_QUEUE)
export class MediaProcessor extends WorkerHost {
    constructor(
        private configService: ConfigService,
        private minioService: MinioService,
        @InjectRepository(Post) private postRepo: Repository<Post>,
    ) {
        super();
        ffmpeg.setFfmpegPath(this.configService.get('FFMPEG_PATH')!);
    }
    async process(job: Job) {
        switch (job.name) {
            case 'process-video':
                await this.processVideo(job.data);
                break;
            default:
                throw new NotFoundException('No job found.');
        }
    }

    async processVideo(data: { userId: number; videoUrl: string }) {
        const uuid = crypto.randomUUID();
        const outputDir = path.join(process.cwd(), 'src', 'hls-files', uuid);
        await fs.mkdir(outputDir, {
            recursive: true,
        });

        await new Promise<void>((res, rej) => {
            ffmpeg(data.videoUrl)
                .outputOptions([
                    '-hls_time 10',
                    '-hls_playlist_type vod',
                    `-hls_segment_filename ${path.join(outputDir, 'segment_%03d.ts')}`,
                ])
                .output(path.join(outputDir, 'master.m3u8'))
                .on('end', () => {
                    console.log('Done!');
                    res();
                })
                .on('error', (err) => {
                    console.log(err);
                    rej();
                })
                .on('progress', (progress) => console.log(progress.percent))
                .run();
        });
        const files = await fs.readdir(outputDir);
        for (const file of files) {
            await this.minioService.uploadFile(
                `${uuid}/${file}`,
                path.join(outputDir, file),
            );
            await fs.unlink(path.join(outputDir, file));
        }
        await fs.rmdir(outputDir);
        const masterUrl = `http://${this.configService.get('MINIO_ENDPOINT')}:${this.configService.get('MINIO_PORT')}/${this.configService.get('MINIO_BUCKET_NAME')}/${uuid}/master.m3u8`;
        const post = await this.postRepo.findOne({
            where: { url: data.videoUrl, user: { id: data.userId } },
        });
        // console.log('post', post);

        if (!post) throw new BadRequestException('Post doest not exists');
        post.url = masterUrl;
        post.status = PostStatus.READY;
        await this.postRepo.save(post);
        // console.log('after saving');
    }
}
