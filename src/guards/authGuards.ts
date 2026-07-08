import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private configService: ConfigService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>();
        const token = request.headers['authorization']?.split(' ')[1];
        if (!token) throw new UnauthorizedException();
        try {
            const data = await this.jwtService.verifyAsync<{
                tokenVersion: number;
                id: number;
            }>(token, {
                secret: this.configService.get('JWT_SECRET'),
            });
            request.user = data;
        } catch (error) {
            throw new UnauthorizedException();
        }
        return true;
    }
}
