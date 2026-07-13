import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

export enum PostType {
    IMAGE = 'IMAGE',
    VIDEO = 'VIDEO',
}

export enum PostStatus {
    PROCESSING = 'PROCESSING',
    READY = 'READY',
    FAILED = 'FAILED',
}

@Entity({ name: 'post' })
export class Post {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ enum: PostType })
    type!: PostType;

    @Column({ enum: PostStatus })
    status!: PostStatus;

    @Column()
    url!: string;

    @ManyToOne(() => User, (u) => u.posts)
    user!: User;

    @CreateDateColumn({
        type: 'timestamptz',
        default: () => 'CURRENT_TIMESTAMP',
    })
    createdAt!: Date;
}
