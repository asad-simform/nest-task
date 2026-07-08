import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    Unique,
} from 'typeorm';
import { User } from './user.entity';

export enum Status {
    PENDING = 'PENDING',
    ACCEPTED = 'ACCEPTED',
    REJECTED = 'REJECTED',
}

@Entity({ name: 'follower' })
@Unique(['follower', 'following'])
export class Follower {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => User, (u) => u.following)
    @JoinColumn({ name: 'follower_id' })
    follower!: User;

    @ManyToOne(() => User, (u) => u.follower)
    @JoinColumn({ name: 'following_id' })
    following!: User;

    @Column({
        type: 'enum',
        enum: Status,
        default: Status.PENDING,
    })
    status!: Status;

    @CreateDateColumn({
        type: 'timestamptz',
        default: () => 'CURRENT_TIMESTAMP',
    })
    createdAt!: Date;
}
