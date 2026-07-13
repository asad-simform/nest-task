import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CLOUDINARY, DATA_SOURCE, USER_REPO } from 'src/config/constants';
import { DataSource } from 'typeorm';
import { User } from 'src/database/entities/user.entity';
import { DatabaseModule } from '../database-module/database.module';
import { FollowerModule } from './follower/follower.module';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
// import { WebhookController } from './webhook/webhook.controller';
import { WebhookService } from './webhook/webhook.service';
import { AuthModule } from './auth/auth.module';

@Module({
    imports: [DatabaseModule, FollowerModule, AuthModule],
    controllers: [UserController],
    providers: [
        UserService,
        WebhookService,
        {
            provide: USER_REPO,
            useFactory: (dataSource: DataSource) =>
                dataSource.getRepository(User),
            inject: [DATA_SOURCE],
        },
        {
            provide: CLOUDINARY,
            useFactory: (configService: ConfigService) => {
                cloudinary.config({
                    cloud_name: configService.get('CLOUDINARY_CLOUD_NAME'),
                    api_key: configService.get('CLOUDINARY_API_KEY'),
                    api_secret: configService.get('CLOUDINARY_API_SECRET'),
                    secure: true,
                });
                return cloudinary;
            },
            inject: [ConfigService],
        },
    ],
})
export class UserModule {}
