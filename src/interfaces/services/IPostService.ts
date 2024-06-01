import services from '@/abstracts/Service';
import {
  RequestWithPagination,
  ResponseWithPagination,
} from '../common/IPagination';
import {IPost} from '../models/IPost';
import {IUser} from '../models/IUser';

export type PostResponse = {post: IPost};
export type ListPostResponse = ResponseWithPagination & {posts: IPost[]};
export type ListPostRequest = RequestWithPagination & {
  status?: IPost['status'];
  sort?: 'ASC' | 'DESC';
};

export type UpdatePostRequest = Partial<IPost>;
export type CommonPostResponse = {message: string; postId: IPost['id']};

export type CreatePostRequest = Pick<
  IPost,
  'title' | 'content' | 'status' | 'tags'
>;

export interface IPostService extends services {
  getAllPost(request: ListPostRequest): Promise<ListPostResponse>;
  getPostById(postId: IPost['id']): Promise<PostResponse>;
  createPost(
    userId: IUser['id'],
    request: CreatePostRequest
  ): Promise<CommonPostResponse>;
  updatePostById(
    userId: IUser['id'],
    postId: IPost['id'],
    request: UpdatePostRequest
  ): Promise<CommonPostResponse>;
  deletePostById(
    userId: IUser['id'],
    postId: IPost['id']
  ): Promise<CommonPostResponse>;
}
