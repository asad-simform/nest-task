import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { MEDIA_QUEUE } from 'src/config/constants';
import { MediaService } from './media.service';
import { MediaProcessor } from './media.processor';
import { MinioModule } from 'src/modules/minio/minio.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from 'src/database/entities/post.entity';

@Module({
    imports: [
        BullModule.registerQueue({
            name: MEDIA_QUEUE,
        }),
        MinioModule,
        TypeOrmModule.forFeature([Post]),
    ],
    providers: [MediaService, MediaProcessor],
    exports: [MediaService],
})
export class MediaModule {}
