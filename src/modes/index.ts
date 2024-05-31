import {Sequelize} from 'sequelize';
import SequelizeConnection from '@/helpers/SequelizeConnection';

// Database model to connection configuration
const config = {
  blog: {
    connection: SequelizeConnection.getClient('blog'),
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
  ...config.blog.models,
  Sequelize,
  sequelize: config.blog.connection,
};
