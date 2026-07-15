import { PostStatus, PostType } from 'src/database/entities/post.entity';

export interface IPost {
    type: PostType;
    url: string;
    caption: string;
    status: PostStatus;
    thumbnailUrl: string;
    createdAt: Date;
    likeCounts: number;
}
