import {
    BadRequestException,
    ConflictException,
    Inject,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { CLOUDINARY, USER_REPO } from 'src/config/constants';
import { User } from 'src/database/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDTO, LoginUserDTO } from './user.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import bcrypt from 'bcrypt';
import { ISignature, IUser, IUserDetails } from './user.interface';
import { v2 as cloudinary } from 'cloudinary';
import { InjectRepository } from '@nestjs/typeorm';

type Cloudinary = typeof cloudinary;

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private userRepo: Repository<User>,
        private jwtService: JwtService,
        private configService: ConfigService,
        @Inject(CLOUDINARY) private cloudinary: Cloudinary,
    ) {}

    async findUser(id: number, tokenVersion: number): Promise<IUserDetails> {
        const user = await this.userRepo.findOne({ where: { id } });
        if (!user) throw new BadRequestException('User does not exist');
        if (tokenVersion !== user?.tokenVersion)
            throw new BadRequestException('User session expired');

        return {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            avatarUrl: user.avatarUrl,
            isPrivate: user.isPrivate,
        };
    }

    async logout(id: number, tokenVersion: number): Promise<void> {
        const user = await this.userRepo.findOne({ where: { id } });
        if (!user) throw new BadRequestException('User does not exist');
        if (tokenVersion !== user?.tokenVersion)
            throw new BadRequestException('User session expired');
        user.tokenVersion = user.tokenVersion + 1;
        await this.userRepo.save(user);
    }

    async generateSignature(
        id: number,
        tokenVersion: number,
    ): Promise<ISignature> {
        const user = await this.userRepo.findOne({ where: { id } });
        if (!user) throw new BadRequestException('User does not exist');
        if (tokenVersion !== user?.tokenVersion)
            throw new BadRequestException('User session expired');
        const timestamp = Math.floor(Date.now() / 1000);
        const publicId = crypto.randomUUID();
        const paramsToSign = {
            timestamp,
            public_id: publicId,
        };
        const signature = this.cloudinary.utils.api_sign_request(
            paramsToSign,
            this.configService.get('CLOUDINARY_API_SECRET')!,
        );
        return {
            cloudName: this.configService.get('CLOUDINARY_CLOUD_NAME')!,
            apiKey: this.configService.get('CLOUDINARY_API_KEY')!,
            timestamp,
            signature,
            publicId,
        };
    }

    async storeAvatarUrl(
        id: number,
        tokenVersion: number,
        url: string,
    ): Promise<IUserDetails> {
        const user = await this.userRepo.findOne({ where: { id } });
        if (!user) throw new BadRequestException('User does not exist');
        if (tokenVersion !== user?.tokenVersion)
            throw new BadRequestException('User session expired');
        user.avatarUrl = url;
        const updatedUser = await this.userRepo.save(user);
        return {
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            email: updatedUser.email,
            avatarUrl: updatedUser.avatarUrl,
            isPrivate: updatedUser.isPrivate,
        };
    }

    async changeVisibility(
        id: number,
        tokenVersion: number,
        status: boolean,
    ): Promise<IUserDetails> {
        const user = await this.userRepo.findOne({ where: { id } });
        if (!user) throw new BadRequestException('User does not exist');
        if (tokenVersion !== user?.tokenVersion)
            throw new BadRequestException('User session expired');
        user.isPrivate = status;
        const updatedUser = await this.userRepo.save(user);
        return {
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            email: updatedUser.email,
            avatarUrl: updatedUser.avatarUrl,
            isPrivate: updatedUser.isPrivate,
        };
    }
}
