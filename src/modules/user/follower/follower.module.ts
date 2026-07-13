import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/modules/database-module/database.module';
import { FollowerController } from './follower.controller';
import { FollowerService } from './follower.service';
import { DATA_SOURCE, FOLLOWER_REPO, USER_REPO } from 'src/config/constants';
import { DataSource } from 'typeorm';
import { Follower } from 'src/database/entities/follower.entity';
import { User } from 'src/database/entities/user.entity';

@Module({
    imports: [DatabaseModule],
    controllers: [FollowerController],
    providers: [
        FollowerService,
        {
            provide: FOLLOWER_REPO,
            useFactory: (dataSource: DataSource) =>
                dataSource.getRepository(Follower),
            inject: [DATA_SOURCE],
        },
        {
            provide: USER_REPO,
            useFactory: (dataSource: DataSource) =>
                dataSource.getRepository(User),
            inject: [DATA_SOURCE],
        },
    ],
})
export class FollowerModule {}
