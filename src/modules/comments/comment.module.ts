import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from 'src/database/entities/comments.entity';
import { User } from 'src/database/entities/user.entity';
import { Post } from 'src/database/entities/post.entity';
import { Follower } from 'src/database/entities/follower.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Comment, User, Post, Follower])],
    controllers: [CommentController],
    providers: [CommentService],
})
export class CommentModule {}
