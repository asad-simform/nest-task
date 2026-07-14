import { PostType } from 'src/database/entities/post.entity';

export interface IUser {
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl: string;
    isPrivate: boolean;
    accessToken: string;
}

export type IUserDetails = Omit<IUser, 'accessToken'>;

export interface ISignature {
    uploadUrl: string;
    cloudName: string;
    apiKey: string;
    timestamp: number;
    signature: string;
    publicId: string;
    resourceType: PostType;
}
