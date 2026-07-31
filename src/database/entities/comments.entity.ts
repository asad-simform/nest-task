import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Post } from './post.entity';
import { User } from './user.entity';

@Entity({ name: 'comment' })
export class Comment {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    comment!: string;

    @Column({ nullable: true })
    parentId!: number;

    @ManyToOne(() => Comment, (c) => c.replies, {
        nullable: true,
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'parentId' })
    parentComment!: Comment;

    @OneToMany(() => Comment, (c) => c.parentComment)
    replies!: Comment[];

    @ManyToOne(() => Post, (p) => p.comments)
    post!: Post;

    @ManyToOne(() => User, (u) => u.comments)
    user!: User;

    @CreateDateColumn({
        type: 'timestamptz',
        default: () => 'CURRENT_TIMESTAMP',
    })
    createdAt!: Date;
}
