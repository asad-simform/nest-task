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
import { IPost } from './post.interface';
import { Follower, Status } from 'src/database/entities/follower.entity';

type Cloudinary = typeof cloudinary;

@Injectable()
export class PostService {
    constructor(
        @Inject(CLOUDINARY) private cloudinary: Cloudinary,
        @InjectRepository(User) private userRepo: Repository<User>,
        @InjectRepository(Post) private postRepo: Repository<Post>,
        @InjectRepository(Follower) private followerRepo: Repository<Follower>,
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
        caption?: string,
        thumbnailUrl?: string,
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
            caption,
            thumbnailUrl,
        });
        await this.mediaService.processMedia(id, url);
        return;
    }

    async getMyPost(
        id: number,
        tokenVersion: number,
        type?: PostType,
    ): Promise<IPost[]> {
        const user = await this.userRepo.findOne({ where: { id } });
        if (!user) throw new BadRequestException('User does not exist');
        if (tokenVersion !== user?.tokenVersion)
            throw new BadRequestException('User session expired');
        const posts = await this.postRepo.find({
            where: {
                user: { id },
                ...(type !== undefined && { type }),
            },
            select: {
                type: true,
                url: true,
                caption: true,
                status: true,
                thumbnailUrl: true,
                createdAt: true,
            },
        });
        return posts;
    }

    async getPostById(
        id: number,
        tokenVersion: number,
        userId: number,
    ): Promise<IPost[]> {
        const user = await this.userRepo.findOne({ where: { id } });
        if (!user) throw new BadRequestException('User does not exist');
        if (tokenVersion !== user?.tokenVersion)
            throw new BadRequestException('User session expired');
        const targetUser = await this.userRepo.findOne({
            where: { id: userId },
        });
        if (!targetUser) throw new BadRequestException('User does not exists');
        if (!targetUser.isPrivate) {
            const data = await this.postRepo.find({
                where: { user: { id: userId } },
            });
            return data;
        }
        const following = await this.followerRepo.findOne({
            where: {
                follower: { id },
                following: { id: userId },
                status: Status.ACCEPTED,
            },
        });

        if (!following)
            throw new BadRequestException('This account is private');
        const data = await this.postRepo.find({
            where: { user: { id: userId } },
        });
        return data;
    }
}
