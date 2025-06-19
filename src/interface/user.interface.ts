import { IPost } from './post.interface';

export type IRole = 'USER' | 'CELEBRITY';

export interface IUserFollowerFollowing {
  follower: string;
  following: string;
}

export interface IUserRequest {
  user_name: string;
  password: string;
  role?: IRole;
  isSeeded?: boolean;
}

export interface IUser extends IUserRequest {
  id: string;
  role: IRole;
  createdAt: Date;
  updatedAt: Date;
}

export type IUserResponse = Omit<IUser, 'password'>;

export interface IUserWithPosts extends IUser {
  posts: IPost[];
}

export interface IUserWithFollowers extends IUser {
  followers: IUserFollowerFollowing[];
}

export interface IUserWithFollowing extends IUser {
  following: IUserFollowerFollowing[];
}
// followers: IUserFollowerFollowing[];
//   following: IUserFollowerFollowing[];
//   posts: IPost[];
