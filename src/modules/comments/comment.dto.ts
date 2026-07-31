import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
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

export class GetPostCommentDTO {
    @ApiPropertyOptional({
        example: 10,
        description: 'Represents the last comment id',
    })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    lastCommentId?: number;

    @ApiPropertyOptional({
        example: 10,
        description: 'Represents the parentId if not provided null is send',
    })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    parentId?: number;
}
