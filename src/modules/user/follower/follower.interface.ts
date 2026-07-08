import { Status } from 'src/database/entities/follower.entity';
import { User } from 'src/database/entities/user.entity';

export interface IRequest {
    id: number;
    follower: User;
    following: User;
    status: Status;
    createdAt: Date;
}

export interface IFollower {
    id: number;
    status: Status;
    follower: {
        id: number;
        firstName: string;
        lastName: string;
        email: string;
    };
}

export interface IFollowing {
    id: number;
    status: Status;
    following: {
        id: number;
        firstName: string;
        lastName: string;
        email: string;
    };
}
