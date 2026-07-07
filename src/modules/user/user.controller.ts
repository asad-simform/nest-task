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

@ApiTags('User')
@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    @Post('signup')
    async createUser(@Body() createUser: CreateUserDTO) {
        return this.userService.createAndLoginUser(createUser);
    }

    @Post('login')
    async loginUser(@Body() userDetails: LoginUserDTO) {
        return this.userService.loginUser(userDetails);
    }

    @UseGuards(AuthGuard)
    @Get('me')
    async getUser(@Req() request: Request) {
        return this.userService.findUser(
            request['user']?.id,
            request['user']?.tokenVersion,
        );
    }

    @UseGuards(AuthGuard)
    @Get('logout')
    async logout(@Req() request: Request) {
        await this.userService.logout(
            request['user']?.id,
            request['user']?.tokenVersion,
        );
        return 'Logout';
    }
}
