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
    cloudName: string;
    apiKey: string;
    timestamp: number;
    signature: string;
    publicId: string;
}
