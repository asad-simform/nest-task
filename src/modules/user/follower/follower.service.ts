import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { FOLLOWER_REPO, USER_REPO } from 'src/config/constants';
import { Follower, Status } from 'src/database/entities/follower.entity';
import { User } from 'src/database/entities/user.entity';
import { Repository } from 'typeorm';
import { IFollower, IRequest } from './follower.interface';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class FollowerService {
    constructor(
        @InjectRepository(User) private userRepo: Repository<User>,
        @InjectRepository(Follower) private followerRepo: Repository<Follower>,
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
        if (!user) throw new BadRequestException('User does not exist');
        if (data.tokenVersion !== user?.tokenVersion)
            throw new BadRequestException('User session expired');
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
        if (!follower || !following)
            throw new BadRequestException('Provided user does not exist');
        if (follower.id === following.id)
            throw new BadRequestException(
                'A user cannot follow their own account',
            );
        const data = await this.followerRepo.findOne({
            where: {
                follower: { id: user.id },
                following: { id: followingId },
            },
        });
        if (data)
            throw new BadRequestException(
                'You are already following this account',
            );
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
        if (!user) throw new BadRequestException('User does not exist');
        if (data.tokenVersion !== user.tokenVersion)
            throw new BadRequestException('User session expired');
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
        if (!follower || !following)
            throw new BadRequestException('Provided user does not exist');
        if (following.tokenVersion !== data.tokenVersion)
            throw new BadRequestException('User session expired');
        const followDetails = await this.followerRepo.findOne({
            where: {
                follower: { id: follower.id },
                following: { id: following.id },
            },
        });
        if (!followDetails)
            throw new BadRequestException('Provided user does not follow you.');
        followDetails.status = status;
        await this.followerRepo.save(followDetails);
    }

    async unfollowUser(
        user: { id: number; tokenVersion: number },
        followingId: number,
    ): Promise<void> {
        const [follower, following] = await Promise.all([
            this.userRepo.findOne({ where: { id: user.id } }),
            this.userRepo.findOne({ where: { id: followingId } }),
        ]);
        if (!follower || !following)
            throw new BadRequestException('Provided user does not exist');
        if (follower.id === following.id)
            throw new BadRequestException('Cannot unfollow');
        const data = await this.followerRepo.findOne({
            where: {
                follower: { id: user.id },
                following: { id: followingId },
            },
        });
        if (!data)
            throw new BadRequestException('You are not following this account');
        await this.followerRepo.remove(data);
    }
}
