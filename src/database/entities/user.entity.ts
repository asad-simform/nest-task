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

    @OneToMany(() => Follower, (f) => f.follower)
    following!: Follower[];

    @OneToMany(() => Follower, (f) => f.following)
    follower!: Follower[];

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
