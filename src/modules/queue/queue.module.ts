import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MediaModule } from './media/media.module';

@Module({
    imports: [
        BullModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                return {
                    connection: {
                        host: configService.get('REDIS_HOST'),
                        port: configService.get('REDIS_PORT'),
                    },
                };
            },
        }),
        MediaModule,
    ],
    exports: [BullModule],
})
export class QueueModule {}
