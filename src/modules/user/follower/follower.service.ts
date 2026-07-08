import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { FOLLOWER_REPO, USER_REPO } from 'src/config/constants';
import { Follower, Status } from 'src/database/entities/follower.entity';
import { User } from 'src/database/entities/user.entity';
import { Repository } from 'typeorm';
import { IFollower, IRequest } from './follower.interface';

@Injectable()
export class FollowerService {
    constructor(
        @Inject(USER_REPO) private userRepo: Repository<User>,
        @Inject(FOLLOWER_REPO) private followerRepo: Repository<Follower>,
    ) {}

    async getFollowers(data: {
        id: number;
        tokenVersion: number;
    }): Promise<IFollower[]> {
        const user = await this.userRepo.findOne({
            where: { id: data.id },
            relations: {
                follower: {
                    follower: true,
                },
            },
            select: {
                id: true,
                tokenVersion: true,
                follower: {
                    id: true,
                    status: true,
                    follower: {
                        firstName: true,
                        lastName: true,
                        email: true,
                        id: true,
                    },
                },
            },
        });
        if (!user || data.tokenVersion !== user?.tokenVersion)
            throw new BadRequestException();
        return user.follower;
    }

    async createRequest(
        user: { id: number; tokenVersion: number },
        followingId: number,
    ): Promise<IRequest> {
        const [follower, following] = await Promise.all([
            this.userRepo.findOne({ where: { id: user.id } }),
            this.userRepo.findOne({ where: { id: followingId } }),
        ]);
        if (!follower || !following || follower.id === following.id)
            throw new BadRequestException();
        const data = await this.followerRepo.findOne({
            where: {
                follower: { id: user.id },
                following: { id: followingId },
            },
        });
        if (data) throw new BadRequestException('Request already exists');
        const request = await this.followerRepo.save({
            follower: { id: user.id },
            following: { id: followingId },
            status: Status.PENDING,
        });
        return request;
    }

    async getFollowing(data: { id: number; tokenVersion: number }) {
        const user = await this.userRepo.findOne({
            where: { id: data.id },
            relations: {
                following: {
                    following: true,
                },
            },
            select: {
                id: true,
                tokenVersion: true,
                following: {
                    id: true,
                    following: {
                        firstName: true,
                        lastName: true,
                        email: true,
                        id: true,
                    },
                    status: true,
                },
            },
        });
        if (!user || data.tokenVersion !== user.tokenVersion)
            throw new BadRequestException();
        return user.following;
    }

    async changeRequestStatus(
        data: { id: number; tokenVersion: number },
        followerId: number,
        status: Status,
    ): Promise<void> {
        const [following, follower] = await Promise.all([
            this.userRepo.findOne({ where: { id: data.id } }),
            this.userRepo.findOne({ where: { id: followerId } }),
        ]);
        if (
            !follower ||
            !following ||
            following.tokenVersion !== data.tokenVersion
        )
            throw new BadRequestException();
        const followDetails = await this.followerRepo.findOne({
            where: {
                follower: { id: follower.id },
                following: { id: following.id },
            },
        });
        if (!followDetails) throw new BadRequestException();
        followDetails.status = status;
        await this.followerRepo.save(followDetails);
    }
}
