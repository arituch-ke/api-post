export default interface IEnvironment {
  NODE_ENV: string;

  // Express
  HOST: string;
  PORT: number;
  API_BASE_PATH: string;
  HTTP_DEFAULT_CACHE_CONTROL: string;
  CORS_WHITELIST_ORIGINS: string;

  // Authentication
  API_JWT_SECRET: string;

  // Database
  DB_HOST: string;
  DB_PORT: number;
  DB_USERNAME: string;
  DB_PASSWORD: string;
  DB_TIMEZONE: string;
  DB_LOG_QUERY: boolean;
  DB_PREFIX: string;

  // Logging
  LOG_LEVEL: string;
}
