import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
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
    @IsString()
    url!: string;
}
