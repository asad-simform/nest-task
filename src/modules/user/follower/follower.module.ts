import { Module } from '@nestjs/common';
import { FollowerController } from './follower.controller';
import { FollowerService } from './follower.service';
import { Follower } from 'src/database/entities/follower.entity';
import { User } from 'src/database/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([User, Follower])],
    controllers: [FollowerController],
    providers: [FollowerService],
})
export class FollowerModule {}
