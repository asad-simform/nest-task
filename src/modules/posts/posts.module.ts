import { Module } from '@nestjs/common';
import { PostController } from './posts.controller';
import { PostService } from './posts.service';
import { CLOUDINARY } from 'src/config/constants';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/database/entities/user.entity';
import { Post } from 'src/database/entities/post.entity';
import { MediaModule } from '../queue/media/media.module';
import { Follower } from 'src/database/entities/follower.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User, Post, Follower]), MediaModule],
    controllers: [PostController],
    providers: [
        PostService,
        {
            provide: CLOUDINARY,
            useFactory: (configService: ConfigService) => {
                cloudinary.config({
                    cloud_name: configService.get('CLOUDINARY_CLOUD_NAME'),
                    api_key: configService.get('CLOUDINARY_API_KEY'),
                    api_secret: configService.get('CLOUDINARY_API_SECRET'),
                    secure: true,
                });
                return cloudinary;
            },
            inject: [ConfigService],
        },
    ],
})
export class PostModule {}
