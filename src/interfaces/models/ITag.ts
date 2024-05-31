import {UUID} from 'crypto';
import {IPost} from './IPost';

export interface ITag {
  id: UUID;
  name: string;
  createdAt: Date;
  updatedAt: Date;

  // Associations
  posts?: IPost[];
}
