import {
    Body,
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { AuthGuard } from 'src/guards/authGuards';
import {
    CreatePostDTO,
    MediaType,
    PostFeed,
    ResourceTypeDTO,
} from './post.dto';
import { successMessage } from 'src/utils/api-response';
import type { ISignature } from '../user/user.interface';
import type { ApiResult } from 'src/utils/api-response';
import { PostService } from './posts.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IPost } from './post.interface';
import { IsPublic } from 'src/guards/is-public.decorator';
import { Post as Posts } from 'src/database/entities/post.entity';

@ApiTags('Post')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard)
@Controller('post')
export class PostController {
    constructor(private postService: PostService) {}

    @Post('signature')
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
            body.caption,
            body.thumbnailUrl,
        );
        return successMessage('post created');
    }

    @Get('me')
    async getPosts(
        @Req() request: Request,
        @Query() query: MediaType,
    ): ApiResult<IPost[]> {
        const data = await this.postService.getMyPost(
            request.user.id,
            request.user.tokenVersion,
            query.type,
        );
        return successMessage(data);
    }

    @Get(':userId')
    async getPostById(
        @Req() request: Request,
        @Param('userId', ParseIntPipe) userId: number,
    ): ApiResult<IPost[]> {
        const data = await this.postService.getPostById(
            request.user.id,
            request.user.tokenVersion,
            userId,
        );
        return successMessage(data);
    }

    @Get()
    @IsPublic()
    async getPostsForFeed(@Query() query: PostFeed): ApiResult<{
        data: Posts[];
        lastPostId: number | null;
        hasMore: boolean;
    }> {
        const data = await this.postService.fetchPosts(query.lastPostId);
        return successMessage({
            data,
            lastPostId: data.length ? data[data.length - 1].id : null,
            hasMore: data.length === 10,
        });
    }
}
