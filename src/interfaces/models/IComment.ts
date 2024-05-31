import {UUID} from 'crypto';
import {IUser} from './IUser';
import {IPost} from './IPost';

export interface IComment {
  id: UUID;
  userId: UUID;
  postId: UUID;
  content: string;
  createdAt: Date;
  updatedAt: Date;

  // Associations
  user?: IUser;
  post?: IPost;
}
