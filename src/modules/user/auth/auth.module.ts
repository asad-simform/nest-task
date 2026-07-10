import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { DATA_SOURCE, USER_REPO } from 'src/config/constants';
import { DataSource } from 'typeorm';
import { User } from 'src/database/entities/user.entity';
import { DatabaseModule } from 'src/modules/database-module/database.module';

@Module({
    imports: [DatabaseModule],
    controllers: [AuthController],
    providers: [
        AuthService,
        {
            provide: USER_REPO,
            useFactory: (dataSource: DataSource) =>
                dataSource.getRepository(User),
            inject: [DATA_SOURCE],
        },
    ],
})
export class AuthModule {}
