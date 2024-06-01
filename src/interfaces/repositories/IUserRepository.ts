import {Transaction} from 'sequelize/types/transaction';
import {IUser} from '../models/IUser';
import {
  CreateUserRequest,
  ListUserRequest,
  ListUserResponse,
  UpdateUserRequest,
} from '../services/IUserService';

export interface IUserRepository {
  findAll(
    request: ListUserRequest,
    transaction?: Transaction | null
  ): Promise<ListUserResponse>;
  findById(
    userId: IUser['id'],
    transaction?: Transaction | null
  ): Promise<IUser | null>;
  create(
    request: CreateUserRequest,
    transaction?: Transaction | null
  ): Promise<IUser['id']>;
  updateById(
    userId: IUser['id'],
    request: UpdateUserRequest,
    transaction?: Transaction | null
  ): Promise<IUser['id']>;
  deleteById(
    userId: IUser['id'],
    transaction?: Transaction | null
  ): Promise<{deleteCount: number}>;
}
