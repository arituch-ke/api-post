import Service from '@/abstracts/Service';
import ISequelizeTransactionHelper from '@/interfaces/common/ISequelizeTransaction';
import Logger from '@/helpers/Logger';
import * as joi from 'joi';
import {ValidationError} from '@/errors';
import {IUserRepository} from '@/interfaces/repositories/IUserRepository';
import {
  UserResponse,
  IUserService,
  CommonUserResponse,
  CreateUserRequest,
} from '@/interfaces/services/IUserService';
import {IUser} from '@/interfaces/models/IUser';

/**
 * UserService
 */
export default class UserService extends Service implements IUserService {
  private readonly UserRepository: IUserRepository;
  private readonly runTransaction: ISequelizeTransactionHelper;

  /**
   * Constructor
   * @param {Object.<string, string>|null} repositories Repositories
   */
  constructor({
    UserRepository,
    transaction,
  }: {
    UserRepository: new () => IUserRepository;
    transaction: ISequelizeTransactionHelper;
  }) {
    super();
    this.UserRepository = new UserRepository();
    this.runTransaction = transaction;
  }

  /**
   * Get User by id
   * @param {IUser.id} userId User id
   * @returns {Promise<UserResponse>} UserResponse
   */
  public async getUserById(userId: IUser['id']): Promise<UserResponse> {
    const schema = joi.object().keys({userId: joi.string().uuid().required()});
    const value = await this.runValidation({userId}, schema);

    const user = await this.UserRepository.findById(value.userId);
    if (!user) {
      Logger.error(`User not found by userId=${value.userId}`, {
        userId: value.userId,
      });
      throw new ValidationError('User not found');
    }

    Logger.info(`Successfully get user by userId=${value.userId}`, {
      userId: value.userId,
    });

    return {user};
  }

  /**
   * Create User
   * @param {CreateUserRequest} request User
   * @returns {Promise<CommonUserResponse>} CommonUserResponse
   */
  public async createUser(
    request: CreateUserRequest
  ): Promise<CommonUserResponse> {
    const schema = joi.object().keys({
      email: joi.string().email().required(),
      password: joi.string().required(),
      name: joi.string().required(),
    });
    const value = await this.runValidation(request, schema);

    const user = await this.UserRepository.findByEmail(value.email);
    if (user) {
      Logger.error('Email already exists', {email: value.email});
      throw new ValidationError('Email already exists');
    }

    const userId = await this.UserRepository.create(value);

    Logger.info(`Successfully create user by userId=${userId}`, {
      userId,
    });

    return {message: 'Created user successfully', userId};
  }
}
