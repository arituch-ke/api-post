import {Sequelize} from 'sequelize';
import SequelizeConnection from '@/helpers/SequelizeConnection';
import Post from './Post';
import Comment from './Comment';
import User from './User';

// Database model to connection configuration
const config = {
  blog: {
    connection: SequelizeConnection.getClient('blog'),
    models: {Post, Comment, User},
  },
};

/*
 * Setup models with database connection
 */
Object.values(config).forEach(({connection, models}) => {
  Object.values(models).forEach(Model => Model.initModel(connection));

  Object.values(models).forEach(Model => Model.associateModel(models));
});

export const blog = {
  ...config.blog.models,
  Sequelize,
  sequelize: config.blog.connection,
};
