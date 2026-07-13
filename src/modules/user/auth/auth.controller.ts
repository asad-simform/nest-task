import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from '../user.service';
import { CreateUserDTO, LoginUserDTO } from '../user.dto';
import { successMessage } from 'src/utils/api-response';
import type { ApiResult } from 'src/utils/api-response';
import { IUser } from '../user.interface';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('user')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('signup')
    async createUser(@Body() createUser: CreateUserDTO): ApiResult<IUser> {
        const data = await this.authService.createAndLoginUser(createUser);
        return successMessage(data, 201, 'User created');
    }

    @Post('login')
    async loginUser(@Body() userDetails: LoginUserDTO): ApiResult<IUser> {
        const data = await this.authService.loginUser(userDetails);
        return successMessage(data, 200, 'Logged in successfully');
    }
}
