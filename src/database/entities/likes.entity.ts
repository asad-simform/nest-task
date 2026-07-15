import {
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    Unique,
} from 'typeorm';
import { User } from './user.entity';
import { Post } from './post.entity';

@Entity({ name: 'like' })
@Unique(['user', 'post'])
export class Like {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => User, (u) => u.likes)
    user!: User;

    @ManyToOne(() => Post, (p) => p.likes)
    post!: Post;

    @CreateDateColumn({
        type: 'timestamptz',
        default: () => 'CURRENT_TIMESTAMP',
    })
    createdAt!: Date;
}
