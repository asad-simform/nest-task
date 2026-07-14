import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { createHash } from 'crypto';
import { USER_REPO } from 'src/config/constants';
import { User } from 'src/database/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class WebhookService {
    constructor(
        private configService: ConfigService,
        @InjectRepository(User) private userRepo: Repository<User>,
    ) {}

    async process(signature: string, timestamp: string, payload: any) {
        const expected = createHash('sha1')
            .update(
                JSON.stringify(payload) +
                    timestamp +
                    this.configService.get('CLOUDINARY_API_SECRET'),
            )
            .digest('hex');
        if (expected !== signature)
            throw new UnauthorizedException(
                'Invalid Cloudinary webhook signature',
            );
        const user = await this.userRepo.findOne({
            where: { id: payload.context.custom.userId },
        });
        if (!user) throw new UnauthorizedException();
        user.avatarUrl = payload.secure_url;
        await this.userRepo.save(user);
    }
}
