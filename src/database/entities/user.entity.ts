import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Follower } from './follower.entity';
import { Post } from './post.entity';
import { Like } from './likes.entity';
import { Comment } from './comments.entity';

@Entity({ name: 'user' })
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    firstName!: string;

    @Column()
    lastName!: string;

    @Column({ unique: true })
    email!: string;

    @Column()
    passwordHash!: string;

    @Column({ default: 1 })
    tokenVersion!: number;

    @Column({ default: false })
    isPrivate!: boolean;

    @Column({ nullable: true })
    avatarUrl!: string;

    @OneToMany(() => Follower, (f) => f.follower)
    following!: Follower[];

    @OneToMany(() => Follower, (f) => f.following)
    follower!: Follower[];

    @OneToMany(() => Post, (p) => p.user)
    posts!: Post[];

    @OneToMany(() => Like, (l) => l.user)
    likes!: Like[];

    @OneToMany(() => Comment, (c) => c.user)
    comments!: Comment[];

    @CreateDateColumn({
        type: 'timestamptz',
        default: () => 'CURRENT_TIMESTAMP',
    })
    createdAt!: Date;

    @UpdateDateColumn({
        type: 'timestamptz',
        default: () => 'CURRENT_TIMESTAMP',
    })
    updatedAt!: Date;

    @DeleteDateColumn({
        nullable: true,
    })
    deletedAt!: Date;
}
