import {UUID} from 'crypto';
import {IPost} from './IPost';
import {IComment} from './IComment';

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export interface IUser {
  id: UUID;
  name: string;
  username: string;
  email: string;
  password: string;
  status: UserStatus;
  lastLogin: Date;
  refreshToken: string;
  createdAt: Date;
  updatedAt: Date;

  // Associations
  posts?: IPost[];
  comments?: IComment[];
}
