import * as databases from '@/modes';
import UserRepository from './UserRepository';

/*
 * Export repositories for each service, a service represents a microservice in the future
 */

export const blog = {
  UserRepository,
  transaction: databases.blog.sequelize.transaction.bind(
    databases.blog.sequelize
  ),
};
