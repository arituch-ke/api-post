import Service from '@/abstracts/Service';
import ISequelizeTransactionHelper from '@/interfaces/common/ISequelizeTransaction';
import Logger from '@/helpers/Logger';
import * as joi from 'joi';
import {PermissionError, ValidationError} from '@/errors';
import {
  CommonPostResponse,
  CreatePostRequest,
  IPostService,
  ListPostRequest,
  ListPostResponse,
  PostResponse,
} from '@/interfaces/services/IPostService';
import {IPostRepository} from '@/interfaces/repositories/IPostRepository';
import {IPost, AllPostStatus} from '@/interfaces/models/IPost';
import {IUser} from '@/interfaces/models/IUser';
import {IUserService} from '@/interfaces/services/IUserService';
import dayjs = require('dayjs');

/**
 * PostService
 */
export default class PostService extends Service implements IPostService {
  private readonly PostRepository: IPostRepository;
  private readonly runTransaction: ISequelizeTransactionHelper;
  private UserService!: IUserService;
  /**
   * Constructor
   * @param {Object.<string, string>|null} repositories Repositories
   */
  constructor({
    PostRepository,
    transaction,
  }: {
    PostRepository: new () => IPostRepository;
    transaction: ISequelizeTransactionHelper;
  }) {
    super();
    this.PostRepository = new PostRepository();
    this.runTransaction = transaction;
  }

  /**
   * Inject services
   * @param {{ILabService,IMatchTemplateService}} services Services
   * @return {void} Nothing
   */
  injectServices(services: {UserService: IUserService}): void {
    this.UserService = services.UserService;
  }

  /**
   * Get all post
   * @param {ListPostRequest} request Request
   * @return {Promise<ListPostResponse>} List post response
   */
  public async getAllPost(request: ListPostRequest): Promise<ListPostResponse> {
    const schema = joi.object().keys({
      page: joi.number().min(1).default(1).optional(),
      limit: joi.number().min(1).default(1).optional(),
      search: joi.string().optional(),
      status: joi
        .string()
        .valid(...AllPostStatus)
        .optional(),
      sort: joi.string().valid('ASC', 'DESC').optional(),
    });
    const value = await this.runValidation(request, schema);

    const posts = await this.PostRepository.findAll(value);

    Logger.info('Successfully get all post', {...value});

    return posts;
  }

  /**
   * Get post by id
   * @param {IPost.id} postId Post id
   * @return {Promise<PostResponse>} Post response
   */
  public async getPostById(postId: IPost['id']): Promise<PostResponse> {
    const schema = joi.object().keys({postId: joi.string().uuid().required()});
    const value = await this.runValidation({postId}, schema);

    const post = await this.PostRepository.findById(value.postId);
    if (!post) {
      Logger.error(`Post not found with id: ${value.postId}`, {
        postId: value.postId,
      });
      throw new ValidationError('Post not found');
    }

    Logger.info(`Successfully get post by postId=${postId}`, {postId: post.id});

    return {post};
  }

  /**
   * Create post
   * @param {IUser.id} userId User id
   * @param {CreatePostRequest} request Request
   * @return {Promise<CommonPostResponse>} Common post response
   */
  public async createPost(
    userId: IUser['id'],
    request: CreatePostRequest
  ): Promise<CommonPostResponse> {
    const schema = joi.object().keys({
      userId: joi.string().uuid().required(),
      post: joi.object().keys({
        title: joi.string().required(),
        content: joi.string().required(),
        status: joi
          .string()
          .valid(...AllPostStatus)
          .required(),
        tags: joi.array().items(joi.string()).required(),
      }),
    });
    const value = await this.runValidation({userId, post: request}, schema);

    const userResult = await this.UserService.getUserById(value.userId);
    if (!userResult) {
      Logger.error(`User not found with id: ${value.userId}`, {
        userId: value.userId,
      });
      throw new ValidationError('User not found');
    }

    const {user} = userResult;

    const {status} = value.post;
    const postedAt = status === 'PUBLISHED' ? dayjs().toDate() : null;

    const createdPostId = await this.runTransaction(async transaction => {
      return this.PostRepository.create(
        {...value.post, userId: user.id, postedBy: user.name, postedAt},
        transaction
      );
    });

    Logger.info('Created post successfully', {postId: createdPostId});

    return {
      message: 'Created post successfully',
      postId: createdPostId,
    };
  }

  /**
   * Update post by id
   * @param {IUser.id} userId User id
   * @param {IPost.id} postId Post id
   * @param {Partial<IPost>} request Request
   * @return {Promise<CommonPostResponse>} Common post response
   */
  public async updatePostById(
    userId: IUser['id'],
    postId: IPost['id'],
    request: Partial<IPost>
  ): Promise<CommonPostResponse> {
    const schema = joi.object().keys({
      userId: joi.string().uuid().required(),
      postId: joi.string().uuid().required(),
      post: joi.object().keys({
        title: joi.string().optional(),
        content: joi.string().optional(),
        status: joi
          .string()
          .valid(...AllPostStatus)
          .optional(),
        tags: joi.array().items(joi.string()).optional(),
      }),
    });
    const value = await this.runValidation(
      {userId, postId, post: request},
      schema
    );

    const post = await this.PostRepository.findById(value.postId);
    if (!post) {
      Logger.error(`Post not found with id: ${value.postId}`, {
        postId: value.postId,
      });
      throw new ValidationError('Post not found');
    }

    if (post.userId !== value.userId) {
      Logger.error('Unauthorized to update post', {
        postId: value.postId,
        userId,
      });
      throw new PermissionError('Unauthorized to update post');
    }

    const updatedPostId = await this.runTransaction(async transaction => {
      return this.PostRepository.updateById(post.id, value.post, transaction);
    });

    Logger.info('Updated post successfully', {postId: updatedPostId});

    return {
      message: 'Updated post successfully',
      postId: updatedPostId,
    };
  }

  /**
   * Delete post by id
   * @param {IUser.id} userId User id
   * @param {IPost.id} postId Post id
   * @return {Promise<CommonPostResponse>} Common post response
   */
  public async deletePostById(
    userId: IUser['id'],
    postId: IPost['id']
  ): Promise<CommonPostResponse> {
    const schema = joi.object().keys({postId: joi.string().uuid().required()});
    const value = await this.runValidation({postId}, schema);

    const post = await this.PostRepository.findById(value.postId);
    if (!post) {
      Logger.error(`Post not found with id: ${value.postId}`, {
        postId: value.postId,
      });
      throw new ValidationError('Post not found');
    }

    if (post.userId !== userId) {
      Logger.error('Unauthorized to delete post', {
        postId: value.postId,
        userId,
      });
      throw new PermissionError('Unauthorized to delete post');
    }

    await this.runTransaction(async transaction => {
      await this.PostRepository.deleteById(post.id, transaction);
    });

    Logger.info('Deleted post successfully', {postId});

    return {
      message: 'Deleted post successfully',
      postId,
    };
  }
}
