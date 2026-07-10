import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Headers,
    Param,
    ParseBoolPipe,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AvatarUrlDTO, CreateUserDTO, LoginUserDTO } from './user.dto';
import { UserService } from './user.service';
import { AuthGuard } from 'src/guards/authGuards';
import type { Request } from 'express';
import { successMessage } from 'src/utils/api-response';
import type { ApiResult } from 'src/utils/api-response';
import { ISignature, IUser, IUserDetails } from './user.interface';

@ApiTags('User')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard)
@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    @Get('me')
    async getUser(@Req() request: Request): ApiResult<IUserDetails> {
        const data = await this.userService.findUser(
            request.user.id,
            request.user.tokenVersion,
        );
        return successMessage(data, 200);
    }

    @Get('logout')
    async logout(@Req() request: Request): ApiResult<null> {
        await this.userService.logout(
            request.user.id,
            request.user.tokenVersion,
        );
        return successMessage(null, 200, 'Logged out successfully');
    }

    @Get('presigned-url')
    async generateSignature(@Req() request: Request): ApiResult<ISignature> {
        const data = await this.userService.generateSignature(
            request.user.id,
            request.user.tokenVersion,
        );
        return successMessage(data);
    }

    @Post('avatar-url')
    async storeAvatarUrl(
        @Req() request: Request,
        @Body() body: AvatarUrlDTO,
    ): ApiResult<IUserDetails> {
        const data = await this.userService.storeAvatarUrl(
            request.user.id,
            request.user.tokenVersion,
            body.avatarUrl,
        );
        return successMessage(data);
    }

    @Get('change-status/:status')
    async changeStatus(
        @Req() request: Request,
        @Param('status', ParseBoolPipe) status: boolean,
    ): ApiResult<IUserDetails> {
        const data = await this.userService.changeVisibility(
            request.user.id,
            request.user.tokenVersion,
            status,
        );
        return successMessage(data);
    }
}
