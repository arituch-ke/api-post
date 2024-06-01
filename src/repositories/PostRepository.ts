import {blog as database} from '@/modes';
import {Transaction} from 'sequelize/types/transaction';
import {IPostRepository} from '@/interfaces/repositories/IPostRepository';
import {IPost} from '@/interfaces/models/IPost';
import {
  ListPostRequest,
  ListPostResponse,
  CreatePostRequest,
  UpdatePostRequest,
} from '@/interfaces/services/IPostService';
import {Op, Order, WhereOptions} from 'sequelize';
import {escapeSearchQueryString} from '@/helpers/sql';

const {Post} = database;

/**
 * UserRepository
 */
export default class PostRepository implements IPostRepository {
  /**
   * Find All Posts
   * @param {ListPostRequest} request List Post Request
   * @param {Transaction} transaction Transaction
   * @returns {Promise<ListPostResponse>} List Post
   */
  public async findAll(
    request: ListPostRequest,
    transaction?: Transaction | null
  ): Promise<ListPostResponse> {
    const where: WhereOptions = {};

    // Search by title, content, or tags
    if (request.search) {
      const searchConditions = {
        [Op.or]: [
          {
            title: {
              [Op.iLike]: `%${escapeSearchQueryString(request.search)}%`,
            },
          },
          {
            tags: {[Op.contains]: [escapeSearchQueryString(request.search)]},
          },
        ],
      };

      Object.assign(where, searchConditions);
    }

    // Filter by status
    if (request.status) {
      where.status = request.status;
    }

    // Sort by postedBy
    const order: Order = [['postedBy', request.sort || 'DESC']];

    const offset = (Number(request.page) - 1) * Number(request.limit);
    const options = {
      order,
      where,
      offset,
      limit: Number(request.limit),
      transaction,
    };

    const {count: total, rows: posts} = await Post.findAndCountAll(options);

    return {
      posts,
      page: Number(request.page),
      limit: Number(request.limit),
      total: Number(total),
    };
  }

  /**
   * Find Post By ID
   * @param {IPost.id} postId Post ID
   * @param {Transaction} transaction Transaction
   * @returns {Promise<IPost | null>} Post
   */
  public async findById(
    postId: IPost['id'],
    transaction?: Transaction | null
  ): Promise<IPost | null> {
    return Post.findByPk(postId, {transaction});
  }

  /**
   * Create Post
   * @param {CreatePostRequest} request Create Post Request
   * @param {Transaction} transaction Transaction
   * @returns {Promise<IPost.id>} Post ID
   */
  public async create(
    request: CreatePostRequest,
    transaction?: Transaction | null
  ): Promise<IPost['id']> {
    const post = await Post.create(request, {transaction});
    return post.id;
  }

  /**
   * Update Post By ID
   * @param {IPost.id} postId Post ID
   * @param {UpdatePostRequest} request Update Post Request
   * @param {Transaction} transaction Transaction
   * @returns {Promise<IPost.id>} Post ID
   */
  public async updateById(
    postId: IPost['id'],
    request: UpdatePostRequest,
    transaction?: Transaction | null
  ): Promise<IPost['id']> {
    const post = await Post.update(request, {
      where: {id: postId},
      transaction,
      returning: true,
    });

    return post[1][0].id;
  }

  /**
   * Delete Post By ID
   * @param {IPost.id} postId Post ID
   * @param {Transaction} transaction Transaction
   * @returns {Promise<{deleteCount: number}>} Delete Count
   */
  public async deleteById(
    postId: IPost['id'],
    transaction?: Transaction | null
  ): Promise<{deleteCount: number}> {
    const post = await Post.destroy({
      where: {id: postId},
      transaction,
    });

    return {deleteCount: post};
  }
}
