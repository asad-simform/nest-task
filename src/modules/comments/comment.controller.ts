import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { AuthGuard } from 'src/guards/authGuards';
import { CreateCommentDTO, EditCommentDTO } from './comment.dto';
import { CommentService } from './comment.service';
import { successMessage } from 'src/utils/api-response';
import type { ApiResult } from 'src/utils/api-response';

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
}
