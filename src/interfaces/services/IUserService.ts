import {UUID} from 'crypto';
import {IUser} from '@/interfaces/models/IUser';
import {Transaction} from 'sequelize';
import services from '@/abstracts/Service';
import {Pagination, ResponseWithPagination} from '../common/IPagination';

export type UserResponse = {user: Omit<IUser, 'password'>};
export type ListUserResponse = {users: IUser[]} & ResponseWithPagination;
export type ListUserRequest = Pagination;
export type UpdateUserRequest = Partial<IUser>;
export type CommonUserResponse = {message: string; userId: IUser['id']};

export type CreateUserRequest = Pick<IUser, 'email' | 'name' | 'password'>;

export interface IUserService extends services {
  getUserById(
    userId: UUID,
    transaction?: Transaction
  ): Promise<UserResponse | null>;
  createUser(
    request: CreateUserRequest,
    transaction?: Transaction
  ): Promise<CommonUserResponse>;
}
