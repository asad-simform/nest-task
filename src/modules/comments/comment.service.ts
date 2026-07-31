import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from 'src/database/entities/comments.entity';
import { Follower, Status } from 'src/database/entities/follower.entity';
import { Post } from 'src/database/entities/post.entity';
import { User } from 'src/database/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(User) private userRepo: Repository<User>,
        @InjectRepository(Post) private postRepo: Repository<Post>,
        @InjectRepository(Comment) private commentRepo: Repository<Comment>,
        @InjectRepository(Follower) private followerRepo: Repository<Follower>,
    ) {}

    async createComment(
        userId: number,
        tokenVersion: number,
        comment: string,
        postId: number,
        parentId?: number,
    ) {
        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user) throw new BadRequestException('User does not exist');
        if (tokenVersion !== user?.tokenVersion)
            throw new BadRequestException('User session expired');
        const postDetail = await this.postRepo.findOne({
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
        if (!postDetail) throw new BadRequestException('Post does not exists.');
        if (postDetail.user.isPrivate && postDetail.user.id !== userId) {
            const followerDetail = await this.followerRepo.findOne({
                where: {
                    follower: { id: userId },
                    following: { id: postDetail.user.id },
                    status: Status.ACCEPTED,
                },
            });
            if (!followerDetail)
                throw new BadRequestException('This post is private');
        }
        if (parentId != null) {
            const parentComment = await this.commentRepo.findOne({
                where: {
                    id: parentId,
                    post: {
                        id: postId,
                    },
                },
            });
            if (!parentComment)
                throw new BadRequestException('Parent comment does not exists');
        }
        await this.commentRepo.save({
            comment,
            post: { id: postId },
            user: { id: userId },
            ...(parentId !== undefined && { parentId }),
        });
        return;
    }

    async editCommentById(
        userId: number,
        tokenVersion: number,
        comment: string,
        postId: number,
        commentId: number,
    ) {
        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user) throw new BadRequestException('User does not exist');
        if (tokenVersion !== user?.tokenVersion)
            throw new BadRequestException('User session expired');
        const commentDetail = await this.commentRepo.update(
            {
                id: commentId,
                user: { id: userId },
                post: { id: postId },
            },
            {
                comment,
            },
        );
        if (commentDetail.affected === 0)
            throw new BadRequestException('No comments found.');
        return;
    }
}
