import { IRole } from './user.interface';

export interface IPostRequest {
  content: string;
  imageURL?: string;
}

export interface IPost extends IPostRequest {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: IRole;
  createdAt: Date;
  updatedAt: Date;
}
