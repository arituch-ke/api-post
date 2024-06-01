import {UUID} from 'crypto';
import {IUser} from './IUser';
import {IComment} from './IComment';
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
  postedBy: string;
  postedAt: Date;
  tags: string[];
  status: PostStatus;
  createdAt: Date;
  updatedAt: Date;

  // Associations
  user?: IUser;
  comments?: IComment[];
}
