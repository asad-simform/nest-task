import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { DATA_SOURCE, USER_REPO } from 'src/config/constants';
import { DataSource } from 'typeorm';
import { User } from 'src/database/entities/user.entity';
import { DatabaseModule } from '../database-module/database.module';
import { FollowerModule } from './follower/follower.module';

@Module({
    imports: [DatabaseModule, FollowerModule],
    controllers: [UserController],
    providers: [
        UserService,
        {
            provide: USER_REPO,
            useFactory: (dataSource: DataSource) =>
                dataSource.getRepository(User),
            inject: [DATA_SOURCE],
        },
    ],
})
export class UserModule {}
