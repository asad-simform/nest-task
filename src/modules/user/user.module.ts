import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { DATA_SOURCE, USER_REPO } from 'src/config/constants';
import { DataSource } from 'typeorm';
import { User } from 'src/database/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { DatabaseModule } from '../database-module/database.module';

@Module({
    imports: [
        DatabaseModule,
        JwtModule.registerAsync({
            useFactory: (configService: ConfigService) => ({
                secret: configService.get('JWT_SECRET'),
                signOptions: {
                    expiresIn: configService.get('JWT_EXPIRE_TIME'),
                },
            }),
            inject: [ConfigService],
        }),
    ],
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
