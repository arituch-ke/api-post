import * as joi from 'joi';
import * as path from 'path';
import * as dotenv from 'dotenv';
import IEnvironment from '@/interfaces/common/IEnvironment';

const pathToProjectRoot = __filename.endsWith('.js') ? '../../..' : '../..';

dotenv.config({
  path: path.resolve(__dirname, pathToProjectRoot, '.env'),
  override: false,
});

const schema = joi
  .object<IEnvironment>()
  .unknown()
  .keys({
    NODE_ENV: joi
      .string()
      .valid('development', 'staging', 'production', 'test')
      .default('development')
      .optional(),

    // Express.js Server
    HOST: joi.string().default('0.0.0.0').optional(),
    PORT: joi.number().default(80).optional(),
    API_BASE_PATH: joi.string().default('/').optional(),
    HTTP_DEFAULT_CACHE_CONTROL: joi
      .string()
      .default('no-store, no-cache, must-revalidate')
      .optional(),
    CORS_WHITELIST_ORIGINS: joi.string().allow('').default('').optional(),

    // Passport.js
    API_JWT_SECRET: joi.string().default('secret').optional(),

    // Database
    DB_HOST: joi.string().default('localhost').optional(),
    DB_PORT: joi.number().default(5432).optional(),
    DB_USERNAME: joi.string().default('postgres').optional(),
    DB_PASSWORD: joi.string().default('postgres').optional(),
    DB_TIMEZONE: joi.string().default('+07:00').optional(),
    DB_LOG_QUERY: joi.boolean().default(false).optional(),
    DB_PREFIX: joi.string().default('api').optional(),

    // Logging
    LOG_LEVEL: joi
      .string()
      .valid('debug', 'info', 'warn', 'error')
      .default('debug')
      .optional(),
  });

// eslint-disable-next-line no-process-env
const result = schema.validate(process.env, {stripUnknown: true});

if (result.error) {
  // On node.js, error.stack is available, unlike bun, which only has error.message
  console.error(result.error.stack ?? result.error);
  // eslint-disable-next-line no-process-exit
  process.exit(1);
}

export default result.value;
