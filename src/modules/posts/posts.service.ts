import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CLOUDINARY } from 'src/config/constants';
import { v2 as cloudinary } from 'cloudinary';
import { Post, PostStatus, PostType } from 'src/database/entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/database/entities/user.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { ISignature } from '../user/user.interface';
import { MediaService } from '../queue/media/media.service';

type Cloudinary = typeof cloudinary;

@Injectable()
export class PostService {
    constructor(
        @Inject(CLOUDINARY) private cloudinary: Cloudinary,
        @InjectRepository(User) private userRepo: Repository<User>,
        @InjectRepository(Post) private postRepo: Repository<Post>,
        private configService: ConfigService,
        private mediaService: MediaService,
    ) {}

    async generateSignature(
        id: number,
        tokenVersion: number,
        resourceType: PostType,
    ): Promise<ISignature> {
        const user = await this.userRepo.findOne({ where: { id } });
        if (!user) throw new BadRequestException('User does not exist');
        if (tokenVersion !== user?.tokenVersion)
            throw new BadRequestException('User session expired');
        const timestamp = Math.floor(Date.now() / 1000);
        const publicId = crypto.randomUUID();
        const paramsToSign = {
            timestamp,
            public_id: publicId,
        };
        const signature = this.cloudinary.utils.api_sign_request(
            paramsToSign,
            this.configService.get('CLOUDINARY_API_SECRET')!,
        );
        return {
            uploadUrl: `https://api.cloudinary.com/v1_1/${this.configService.get('CLOUDINARY_CLOUD_NAME')!}/${resourceType.toLowerCase()}/upload`,
            cloudName: this.configService.get('CLOUDINARY_CLOUD_NAME')!,
            apiKey: this.configService.get('CLOUDINARY_API_KEY')!,
            timestamp,
            signature,
            publicId,
            resourceType: resourceType,
        };
    }

    async storeMedia(
        id: number,
        tokenVersion: number,
        resourceType: PostType,
        url: string,
    ) {
        const user = await this.userRepo.findOne({ where: { id } });
        if (!user) throw new BadRequestException('User does not exist');
        if (tokenVersion !== user?.tokenVersion)
            throw new BadRequestException('User session expired');
        if (resourceType === PostType.IMAGE) {
            await this.postRepo.save({
                type: resourceType,
                status: PostStatus.READY,
                url,
                user: { id },
            });
            return;
        }
        await this.postRepo.save({
            type: resourceType,
            status: PostStatus.PROCESSING,
            url,
            user: { id },
        });
        await this.mediaService.processMedia(id, url);
        return;
    }
}
