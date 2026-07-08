import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Headers,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDTO, LoginUserDTO } from './user.dto';
import { UserService } from './user.service';
import { AuthGuard } from 'src/guards/authGuards';
import type { Request } from 'express';
import { successMessage } from 'src/utils/api-response';
import type { ApiResult } from 'src/utils/api-response';
import { IUser, IUserDetails } from './user.interface';

@ApiTags('User')
@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    @Post('signup')
    async createUser(@Body() createUser: CreateUserDTO): ApiResult<IUser> {
        const data = await this.userService.createAndLoginUser(createUser);
        return successMessage(data, 201, 'User created');
    }

    @Post('login')
    async loginUser(@Body() userDetails: LoginUserDTO): ApiResult<IUser> {
        const data = await this.userService.loginUser(userDetails);
        return successMessage(data, 200, 'Logged in successfully');
    }

    @UseGuards(AuthGuard)
    @Get('me')
    async getUser(@Req() request: Request): ApiResult<IUserDetails> {
        const data = await this.userService.findUser(
            request.user.id,
            request.user.tokenVersion,
        );
        return successMessage(data, 200);
    }

    @UseGuards(AuthGuard)
    @Get('logout')
    async logout(@Req() request: Request): ApiResult<null> {
        await this.userService.logout(
            request.user.id,
            request.user.tokenVersion,
        );
        return successMessage(null, 200, 'Logged out successfully');
    }
}
