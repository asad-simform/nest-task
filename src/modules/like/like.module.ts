import { Module } from '@nestjs/common';
import { LikeController } from './like.controller';
import { LikeService } from './like.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Like } from 'src/database/entities/likes.entity';
import { Follower } from 'src/database/entities/follower.entity';
import { User } from 'src/database/entities/user.entity';
import { Post } from 'src/database/entities/post.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Like, Follower, User, Post])],
    controllers: [LikeController],
    providers: [LikeService],
})
export class LikeModule {}
