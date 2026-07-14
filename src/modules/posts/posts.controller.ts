import { Body, Controller, Post, Query, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { AuthGuard } from 'src/guards/authGuards';
import { CreatePostDTO, ResourceTypeDTO } from './post.dto';
import { successMessage } from 'src/utils/api-response';
import type { ISignature } from '../user/user.interface';
import type { ApiResult } from 'src/utils/api-response';
import { PostService } from './posts.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Post')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard)
@Controller('post')
export class PostController {
    constructor(private postService: PostService) {}

    @Post()
    async generateSignature(
        @Req() request: Request,
        @Query() query: ResourceTypeDTO,
    ): ApiResult<ISignature> {
        const data = await this.postService.generateSignature(
            request.user.id,
            request.user.tokenVersion,
            query.resourceType,
        );
        return successMessage(data);
    }

    @Post('create-post')
    async createPost(
        @Req() request: Request,
        @Body() body: CreatePostDTO,
    ): ApiResult<string> {
        await this.postService.storeMedia(
            request.user.id,
            request.user.tokenVersion,
            body.resourceType,
            body.url,
        );
        return successMessage('post created');
    }
}
