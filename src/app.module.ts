import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QueueModule } from './modules/queue/queue.module';
import { PostModule } from './modules/posts/posts.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                return {
                    type: 'postgres',
                    host: configService.get('DB_HOST'),
                    port: 5432,
                    username: configService.get('DB_USER'),
                    password: configService.get('DB_PASS'),
                    database: configService.get('DB_DATABASE'),
                    entities: [__dirname + '/database/entities/*{.js,.ts}'],
                    migrations: [__dirname + '/database/migrations/*{.js,.ts}'],
                    synchronize: false,
                    logging: configService.get('NODE_ENV') === 'development',
                };
            },
        }),
        UserModule,
        JwtModule.registerAsync({
            useFactory: (configService: ConfigService) => ({
                secret: configService.get('JWT_SECRET'),
                signOptions: {
                    expiresIn: configService.get('JWT_EXPIRE_TIME'),
                },
            }),
            inject: [ConfigService],
            global: true,
        }),
        QueueModule,
        PostModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
