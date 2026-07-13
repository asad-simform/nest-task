import {
    ConflictException,
    Inject,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDTO, LoginUserDTO } from '../user.dto';
import { IUser } from '../user.interface';
import { USER_REPO } from 'src/config/constants';
import { Repository } from 'typeorm';
import { User } from 'src/database/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        @Inject(USER_REPO) private userRepo: Repository<User>,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) {}

    async createAndLoginUser(data: CreateUserDTO): Promise<IUser> {
        const user = await this.userRepo.findOne({
            where: { email: data.email },
        });
        if (user) throw new ConflictException('User already exists.');
        const saltRounds = +this.configService.get('JWT_SALT_ROUNDS');
        const passwordHash = await bcrypt.hash(data.password, saltRounds);
        const newUser = await this.userRepo.save({
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            passwordHash: passwordHash,
        });
        const payload = { tokenVersion: newUser.tokenVersion, id: newUser.id };

        const accessToken = await this.jwtService.signAsync(payload, {
            secret: this.configService.get('JWT_SECRET'),
        });
        return {
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
            accessToken,
            avatarUrl: newUser.avatarUrl,
            isPrivate: newUser.isPrivate,
        };
    }

    async loginUser(data: LoginUserDTO): Promise<IUser> {
        const user = await this.userRepo.findOne({
            where: { email: data.email },
        });
        if (!user) throw new UnauthorizedException('Invalid credentials');
        const isPasswordSame = await bcrypt.compare(
            data.password,
            user.passwordHash,
        );
        if (!isPasswordSame)
            throw new UnauthorizedException('Invalid credentials');
        const payload = { tokenVersion: user.tokenVersion, id: user.id };

        const accessToken = await this.jwtService.signAsync(payload, {
            secret: this.configService.get('JWT_SECRET'),
        });

        return {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            accessToken,
            avatarUrl: user.avatarUrl,
            isPrivate: user.isPrivate,
        };
    }
}
