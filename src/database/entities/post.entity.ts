import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Like } from './likes.entity';

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

    @Column({ nullable: true })
    caption!: string;

    @Column({ nullable: true })
    thumbnailUrl!: string;

    @ManyToOne(() => User, (u) => u.posts)
    user!: User;

    @OneToMany(() => Like, (l) => l.post)
    likes!: Like[];

    @Column({ default: 0 })
    likeCounts!: number;

    @CreateDateColumn({
        type: 'timestamptz',
        default: () => 'CURRENT_TIMESTAMP',
    })
    createdAt!: Date;
}
