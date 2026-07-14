import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { MEDIA_QUEUE } from 'src/config/constants';

@Injectable()
export class MediaService {
    constructor(@InjectQueue(MEDIA_QUEUE) private mediaQueue: Queue) {}

    async processMedia(userId: number, videoUrl: string) {
        await this.mediaQueue.add(
            'process-video',
            {
                userId,
                videoUrl,
            },
            {
                removeOnComplete: true,
            },
        );
    }
}
