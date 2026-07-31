import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';
import { Observable } from 'rxjs';
import { IS_PUBLIC, IsPublic } from './is-public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private configService: ConfigService,
        private reflector: Reflector,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.get(IS_PUBLIC, context.getHandler());
        if (isPublic) return true;

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
