import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Follower, Status } from 'src/database/entities/follower.entity';
import { Like } from 'src/database/entities/likes.entity';
import { Post } from 'src/database/entities/post.entity';
import { User } from 'src/database/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LikeService {
    constructor(
        @InjectRepository(Like) private likeRepo: Repository<Like>,
        @InjectRepository(Follower) private followRepo: Repository<Follower>,
        @InjectRepository(User) private userRepo: Repository<User>,
        @InjectRepository(Post) private postRepo: Repository<Post>,
    ) {}

    async addLikeToPost(userId: number, tokenVersion: number, postId: number) {
        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user) throw new BadRequestException('User does not exist');
        if (tokenVersion !== user?.tokenVersion)
            throw new BadRequestException('User session expired');
        const postDetails = await this.postRepo.findOne({
            where: { id: postId },
            relations: {
                user: true,
            },
            select: {
                user: {
                    isPrivate: true,
                    id: true,
                },
            },
        });
        if (!postDetails)
            throw new BadRequestException('Post does not exists.');
        if (userId === postDetails.user.id)
            throw new BadRequestException('You cannot like your own post');
        const likeDetails = await this.likeRepo.findOne({
            where: {
                post: { id: postId },
                user: { id: userId },
            },
        });
        if (likeDetails)
            throw new BadRequestException(
                'Cannot like same post multiple times.',
            );
        if (postDetails.user.isPrivate) {
            const followerDetail = await this.followRepo.findOne({
                where: {
                    follower: { id: userId },
                    following: { id: postDetails.user.id },
                    status: Status.ACCEPTED,
                },
            });
            // console.log(followerDetail);

            if (!followerDetail)
                throw new BadRequestException('This post is private');
        }
        // console.log(postDetails.user.id);

        await this.likeRepo.save({
            user: { id: userId },
            post: { id: postId },
        });
        await this.postRepo.update(
            {
                id: postId,
            },
            {
                likeCounts: () => 'likeCounts + 1',
            },
        );
        return;
    }

    async removeLikeFromPost(
        userId: number,
        tokenVersion: number,
        postId: number,
    ) {
        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user) throw new BadRequestException('User does not exist');
        if (tokenVersion !== user?.tokenVersion)
            throw new BadRequestException('User session expired');
        const postDetails = await this.postRepo.findOne({
            where: { id: postId },
        });
        if (!postDetails) throw new BadRequestException('Post does not exists');
        const likeDetails = await this.likeRepo.delete({
            post: { id: postId },
            user: { id: userId },
        });
        if (likeDetails.affected === 0)
            throw new BadRequestException('You have not liked the post');
        await this.postRepo.update(
            {
                id: postId,
            },
            {
                likeCounts: () => 'likeCounts - 1',
            },
        );
        return;
    }
}
