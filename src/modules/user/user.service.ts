import {
    BadRequestException,
    Inject,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { USER_REPO } from 'src/config/constants';
import { User } from 'src/database/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDTO, LoginUserDTO } from './user.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import bcrypt from 'bcrypt';
import { IUser, IUserDetails } from './user.interface';

@Injectable()
export class UserService {
    constructor(
        @Inject(USER_REPO) private userRepo: Repository<User>,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) {}

    async createAndLoginUser(data: CreateUserDTO): Promise<IUser> {
        const user = await this.userRepo.findOne({
            where: { email: data.email },
        });
        if (user) throw new BadRequestException();
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
        };
    }

    async loginUser(data: LoginUserDTO): Promise<IUser> {
        const user = await this.userRepo.findOne({
            where: { email: data.email },
        });
        if (!user) throw new UnauthorizedException();
        const isPasswordSame = await bcrypt.compare(
            data.password,
            user.passwordHash,
        );
        if (!isPasswordSame) throw new UnauthorizedException();
        const payload = { tokenVersion: user.tokenVersion, id: user.id };

        const accessToken = await this.jwtService.signAsync(payload, {
            secret: this.configService.get('JWT_SECRET'),
        });

        return {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            accessToken,
        };
    }

    async findUser(id: number, tokenVersion: number): Promise<IUserDetails> {
        const user = await this.userRepo.findOne({ where: { id } });
        if (tokenVersion !== user?.tokenVersion)
            throw new BadRequestException();
        if (!user) throw new BadRequestException();

        return {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
        };
    }

    async logout(id: number, tokenVersion: number): Promise<void> {
        const user = await this.userRepo.findOne({ where: { id } });
        if (!user || tokenVersion !== user.tokenVersion)
            throw new BadRequestException();
        user.tokenVersion = user.tokenVersion + 1;
        await this.userRepo.save(user);
    }
}
