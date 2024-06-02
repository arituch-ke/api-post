import {blog as database} from '@/modes';
import {Transaction} from 'sequelize/types/transaction';
import {IUserRepository} from '@/interfaces/repositories/IUserRepository';
import {IUser} from '@/interfaces/models/IUser';
import {
  CreateUserRequest,
  ListUserRequest,
  ListUserResponse,
  UpdateUserRequest,
} from '@/interfaces/services/IUserService';
import * as bcrypt from 'bcryptjs';

const {User} = database;

/**
 * UserRepository
 */
export default class UserRepository implements IUserRepository {
  /**
   * Generate Hash Password
   * @param {string} password - The user password
   * @return {string} The user
   * @private
   */
  private generateHashPassword(password: string): string {
    return bcrypt.hashSync(password, bcrypt.genSaltSync());
  }

  /**
   * Find All Users
   * @param {ListUserRequest} request List User Request
   * @param {Transaction} transaction Transaction
   * @returns {Promise<ListUserResponse>} List User
   */
  public async findAll(
    {page, limit}: ListUserRequest,
    transaction?: Transaction | null
  ): Promise<ListUserResponse> {
    const offset = (Number(page) - 1) * Number(limit);
    const options = {offset, limit: Number(limit), transaction};

    const {count: total, rows: users} = await User.findAndCountAll(options);

    return {
      users,
      page: Number(page),
      limit: Number(limit),
      total: Number(total),
    };
  }

  /**
   * Find User By ID
   * @param {IUser.id} userId User ID
   * @param {Transaction} transaction Transaction
   * @returns {Promise<IUser | null>} User
   */
  public async findById(
    userId: IUser['id'],
    transaction?: Transaction | null
  ): Promise<IUser | null> {
    return User.findByPk(userId, {transaction});
  }

  /**
   * Find User By Email
   * @param {IUser.email} email User Email
   * @param {Transaction} transaction Transaction
   * @returns {Promise<IUser | null>} User
   */
  public async findByEmail(
    email: IUser['email'],
    transaction?: Transaction | null
  ): Promise<IUser | null> {
    return User.findOne({where: {email}, transaction});
  }

  /**
   * Create User
   * @param {CreateUserRequest} request Create User Request
   * @param {Transaction} transaction Transaction
   * @returns {Promise<IUser.id>} User ID
   */
  public async create(
    request: CreateUserRequest,
    transaction?: Transaction | null
  ): Promise<IUser['id']> {
    request.password = this.generateHashPassword(request.password);
    const user = await User.create(request, {transaction});
    return user.id;
  }

  /**
   * Update Update By ID
   * @param {IUser.id} userId User ID
   * @param {Partial<IUser>} request Update User Request
   * @param {Transaction} transaction Transaction
   * @returns {Promise<IUser.id>} User ID
   */
  public async updateById(
    userId: IUser['id'],
    request: UpdateUserRequest,
    transaction?: Transaction | null
  ): Promise<IUser['id']> {
    const user = await User.update(request, {
      where: {id: userId},
      transaction,
      returning: true,
    });

    return user[1][0].id;
  }

  /**
   * Delete User By ID
   * @param {IUser.id} userId User ID
   * @param {Transaction} transaction Transaction
   * @returns {Promise<{deleteCount: number}>} Delete Count
   */
  public async deleteById(
    userId: IUser['id'],
    transaction?: Transaction | null
  ): Promise<{deleteCount: number}> {
    const user = await User.destroy({
      where: {id: userId},
      transaction,
    });

    return {deleteCount: user};
  }
}
