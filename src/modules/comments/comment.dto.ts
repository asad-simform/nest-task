import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCommentDTO {
    @ApiProperty({
        example: 'some comment',
    })
    @IsString()
    comment!: string;

    @ApiProperty({
        example: 1,
    })
    @IsNumber()
    postId!: number;

    @ApiProperty({
        example: 1,
    })
    @IsOptional()
    @IsNumber()
    parentId?: number;
}

export class EditCommentDTO {
    @ApiProperty({
        example: 'some comment',
    })
    @IsString()
    comment!: string;

    @ApiProperty({
        example: 1,
    })
    @IsNumber()
    postId!: number;

    @ApiProperty({
        example: 1,
    })
    @IsNumber()
    commentId!: number;
}
