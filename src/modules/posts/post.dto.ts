import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';
import { PostType } from 'src/database/entities/post.entity';

export class ResourceTypeDTO {
    @ApiProperty({
        example: 'IMAGE',
    })
    @IsEnum(PostType)
    resourceType!: PostType;
}

export class CreatePostDTO {
    @ApiProperty({
        example: 'IMAGE',
    })
    @IsEnum(PostType)
    resourceType!: PostType;

    @ApiProperty({
        example: 'http://image-url',
    })
    @IsUrl()
    url!: string;

    @ApiProperty({
        example: 'Some caption',
    })
    @IsOptional()
    @IsString()
    caption?: string;

    @ApiProperty({
        example: 'http://thumbnail-url',
    })
    @IsOptional()
    @IsString()
    thumbnailUrl?: string;
}

export class MediaType {
    @ApiPropertyOptional({
        example: 'IMAGE',
    })
    @IsOptional()
    @IsEnum(PostType)
    type?: PostType;
}

export class PostFeed {
    @ApiPropertyOptional({
        example: 1,
    })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    lastPostId?: number;
}
