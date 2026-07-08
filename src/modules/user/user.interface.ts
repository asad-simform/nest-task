export interface IUser {
    firstName: string;
    lastName: string;
    email: string;
    accessToken: string;
}

export type IUserDetails = Omit<IUser, 'accessToken'>;
