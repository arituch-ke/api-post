import * as databases from '@/modes';
import UserRepository from './UserRepository';
import PostRepository from './PostRepository';

/*
 * Export repositories for each service, a service represents a microservice in the future
 */
export const blog = {
  UserRepository,
  PostRepository,
  transaction: databases.blog.sequelize.transaction.bind(
    databases.blog.sequelize
  ),
};
