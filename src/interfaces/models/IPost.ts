import {UUID} from 'crypto';
import {IUser} from './IUser';
import {ITag} from './ITag';

export enum PostStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

export interface IPost {
  id: UUID;
  userId: UUID;
  title: string;
  content: string;
  cover: string;
  status: PostStatus;
  createdAt: Date;
  updatedAt: Date;

  // Associations
  user?: IUser;
  tags?: ITag[];
}
