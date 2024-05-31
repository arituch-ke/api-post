import {UUID} from 'crypto';
import {IPost} from './IPost';
import {ITag} from './ITag';

export interface IPostTagMapping {
  postId: UUID;
  tagId: UUID;

  // Associations
  post?: IPost;
  tag?: ITag;
}
