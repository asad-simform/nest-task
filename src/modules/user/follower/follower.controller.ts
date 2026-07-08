import {
    Body,
    Controller,
    Get,
    Param,
    ParseEnumPipe,
    ParseIntPipe,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { AuthGuard } from 'src/guards/authGuards';
import { FollowerService } from './follower.service';
import { successMessage } from 'src/utils/api-response';
import type { ApiResult } from 'src/utils/api-response';
import { Follower, Status } from 'src/database/entities/follower.entity';
import { IFollower, IFollowing, IRequest } from './follower.interface';

// list followings, list followers, request, list request, change request status

@ApiTags('Follower')
@Controller('user')
@UseGuards(AuthGuard)
export class FollowerController {
    constructor(private followerService: FollowerService) {}

    @Get('follower')
    async getFollowers(@Req() request: Request): ApiResult<IFollower[]> {
        const data = await this.followerService.getFollowers(request.user);
        return successMessage(data);
    }

    @Get('following')
    async getFollowings(@Req() request: Request): ApiResult<IFollowing[]> {
        const data = await this.followerService.getFollowing(request.user);
        return successMessage(data);
    }

    @Post('change-status')
    async changeStatus(
        @Req() request: Request,
        @Body('followerId', ParseIntPipe) followerId: number,
        @Body('status', new ParseEnumPipe(Status)) status: Status,
    ): ApiResult<null> {
        await this.followerService.changeRequestStatus(
            request.user,
            followerId,
            status,
        );
        return successMessage(null, 200);
    }

    @Get('/follow/:id')
    async createFollowRequest(
        @Req() request: Request,
        @Param('id', ParseIntPipe) followingId: number,
    ): ApiResult<IRequest> {
        const data = await this.followerService.createRequest(
            request.user,
            followingId,
        );
        return successMessage(data);
    }
}
