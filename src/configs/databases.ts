import {Options} from 'sequelize';
import environment from '@/configs/environment';
import Logger from '@/helpers/Logger';

const commonConfig: Options = {
  dialect: 'postgres',
  host: environment.DB_HOST,
  port: Number(environment.DB_PORT),
  username: environment.DB_USERNAME,
  password: environment.DB_PASSWORD,
  timezone: environment.DB_TIMEZONE,
  logging: environment.DB_LOG_QUERY
    ? message => Logger.label('Sequelize').debug(message)
    : false,
};

export const blog = {
  ...commonConfig,
  database: `${environment.DB_PREFIX}`,
};
