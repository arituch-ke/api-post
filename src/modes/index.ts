import {Sequelize} from 'sequelize';
import SequelizeConnection from '@/helpers/SequelizeConnection';

// Database model to connection configuration
const config = {
  blogPostsArchive: {
    connection: SequelizeConnection.getClient('blogPostsArchive'),
    models: {},
  },
};

/*
 * Setup models with database connection
 */
// Object.values(config).forEach(({connection, models}) => {
//   Object.values(models).forEach(Model => Model.initModel(connection));

//   Object.values(models).forEach(Model => Model.associateModel(models));
// });

export const blogPostsArchive = {
  ...config.blogPostsArchive.models,
  Sequelize,
  sequelize: config.blogPostsArchive.connection,
};
