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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { AuthGuard } from 'src/guards/authGuards';
import {
    CreateCommentDTO,
    EditCommentDTO,
    GetPostCommentDTO,
} from './comment.dto';
import { CommentService } from './comment.service';
import { successMessage } from 'src/utils/api-response';
import type { ApiResult } from 'src/utils/api-response';
import { Comment } from 'src/database/entities/comments.entity';
import { IsPublic } from 'src/guards/is-public.decorator';

@ApiTags('Comment')
@ApiBearerAuth('access-token')
@Controller('comment')
@UseGuards(AuthGuard)
export class CommentController {
    constructor(private commentService: CommentService) {}

    @Post()
    async createComment(
        @Req() request: Request,
        @Body() createComment: CreateCommentDTO,
    ): ApiResult<string> {
        await this.commentService.createComment(
            request.user.id,
            request.user.tokenVersion,
            createComment.comment,
            createComment.postId,
            createComment.parentId,
        );
        return successMessage('Comment created');
    }

    @Post('edit')
    async editComment(
        @Req() request: Request,
        @Body() editComment: EditCommentDTO,
    ): ApiResult<string> {
        await this.commentService.editCommentById(
            request.user.id,
            request.user.tokenVersion,
            editComment.comment,
            editComment.postId,
            editComment.commentId,
        );
        return successMessage('Comment edited');
    }

    @Get('delete/:commentId')
    async deleteComment(
        @Req() request: Request,
        @Param('commentId', ParseIntPipe) commentId: number,
    ): ApiResult<string> {
        await this.commentService.deleteCommentById(
            request.user.id,
            request.user.tokenVersion,
            commentId,
        );
        return successMessage('Comment Deleted');
    }

    @IsPublic()
    @Get(':postId')
    async getCommentByPostId(
        @Param('postId', ParseIntPipe) postId: number,
        @Query() query: GetPostCommentDTO,
    ): ApiResult<{
        data: Comment[];
        nextCursor: number | null;
        hasMore: boolean;
    }> {
        const data: Comment[] = await this.commentService.getCommentByPostId(
            postId,
            query.parentId,
            query.lastCommentId,
        );
        return successMessage({
            data,
            nextCursor: data.length ? data[data.length - 1].id : null,
            hasMore: data.length === 10,
        });
    }
}
