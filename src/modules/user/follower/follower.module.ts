import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/modules/database-module/database.module';
import { FollowerController } from './follower.controller';
import { FollowerService } from './follower.service';
import { DATA_SOURCE, FOLLOWER_REPO, USER_REPO } from 'src/config/constants';
import { DataSource } from 'typeorm';
import { Follower } from 'src/database/entities/follower.entity';
import { User } from 'src/database/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([User, Follower])],
    controllers: [FollowerController],
    providers: [FollowerService],
})
export class FollowerModule {}
