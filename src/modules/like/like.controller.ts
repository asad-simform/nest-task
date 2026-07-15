import {
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Req,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { AuthGuard } from 'src/guards/authGuards';
import { LikeService } from './like.service';
import { successMessage } from 'src/utils/api-response';
import type { ApiResult } from 'src/utils/api-response';

@ApiTags('Like')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard)
@Controller('like')
export class LikeController {
    constructor(private likeService: LikeService) {}

    @Get(':postId/add')
    async addLike(
        @Req() request: Request,
        @Param('postId', ParseIntPipe) postId: number,
    ): ApiResult<string> {
        await this.likeService.addLikeToPost(
            request.user.id,
            request.user.tokenVersion,
            postId,
        );
        return successMessage('Like added');
    }
}
