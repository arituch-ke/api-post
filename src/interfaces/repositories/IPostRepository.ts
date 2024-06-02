import {Transaction} from 'sequelize/types/transaction';
import {
  ListPostRequest,
  ListPostResponse,
  CreatePostRequest,
  UpdatePostRequest,
} from '../services/IPostService';
import {IPost} from '../models/IPost';

export interface IPostRepository {
  findAll(
    request: ListPostRequest,
    transaction?: Transaction | null
  ): Promise<ListPostResponse>;
  findById(
    postId: IPost['id'],
    transaction?: Transaction | null
  ): Promise<IPost | null>;
  create(
    request: CreatePostRequest & {
      userId: IPost['userId'];
      postedBy: string;
      postedAt: Date | null;
    },
    transaction?: Transaction | null
  ): Promise<IPost['id']>;
  updateById(
    postId: IPost['id'],
    request: UpdatePostRequest,
    transaction?: Transaction | null
  ): Promise<IPost['id']>;
  deleteById(
    postId: IPost['id'],
    transaction?: Transaction | null
  ): Promise<{deleteCount: number}>;
}
