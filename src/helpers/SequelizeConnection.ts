import {Options, Sequelize} from 'sequelize';
import Logger from './Logger';
import * as databaseOptions from '@/configs/databases';

/**
 * SequelizeConnection
 */
export default class SequelizeConnection {
  private readonly config: Options;
  private client: Sequelize;
  private static connections: {[key: string]: SequelizeConnection} = {};

  /**
   * Constructor
   * @param {Options} config Database config
   */
  public constructor(config: Options) {
    this.config = config;
    this.client = new Sequelize(config);
  }

  /**
   * Sequelize instance
   * @return {Sequelize} Sequelize instance
   */
  public getClient(): Sequelize {
    return this.client;
  }

  /**
   * Connect to database by Sequelize
   * @return {Promise<Sequelize>} Sequelize instance
   */
  public async connect(): Promise<Sequelize> {
    try {
      await this.client.authenticate();
      Logger.debug(
        `✅ Connected to database '${this.config.database}' at ${this.config.host}:${this.config.port}`
      );

      return this.client;
    } catch (error: any) {
      Logger.error(`⚠ Cannot connect to database: ${error.stack}`, {
        stack: error.stack,
      });

      throw new Error('Cannot connect to database');
    }
  }

  /**
   * Closed to database connection
   * @return {Promise<Sequelize>} Sequelize instance
   */
  async close(): Promise<Sequelize> {
    try {
      await this.client.close();
      Logger.error('✅ Database connection closed successfully.');

      return this.client;
    } catch (error: any) {
      Logger.error(`⚠ Cannot close database connection: ${error.stack}`, {
        stack: error.stack,
      });

      return this.client;
    }
  }

  /**
   * Connect to all databases
   * @returns {Promise<Array<{databaseName: string, client: Sequelize}>>} Sequelize instances
   */
  static async connectAll(): Promise<
    Array<{databaseName: string; client: Sequelize}>
  > {
    return Promise.all(
      Object.keys(databaseOptions).map(async databaseName => {
        const client = await this.connect(databaseName);
        return {databaseName, client};
      })
    );
  }

  /**
   * Sequelize instance (static)
   * @param {string} databaseName Database name
   * @return {Sequelize} Sequelize instance
   */
  public static getClient(databaseName: string): Sequelize {
    if (
      !this.connections[databaseName] &&
      Object.keys(databaseOptions).includes(databaseName)
    ) {
      const options =
        Object.entries(databaseOptions).find(
          ([k]) => k === databaseName
        )?.[1] ?? {};
      this.connections[databaseName] = new SequelizeConnection(options);
    }

    return this.connections[databaseName].getClient();
  }

  /**
   * Connect to database by Sequelize (static)
   * @param {string} databaseName Database name
   * @return {Sequelize} Sequelize instance
   */
  public static async connect(databaseName: string): Promise<Sequelize> {
    if (
      !this.connections[databaseName] &&
      Object.keys(databaseOptions).includes(databaseName)
    ) {
      const options =
        Object.entries(databaseOptions).find(
          ([k]) => k === databaseName
        )?.[1] ?? {};
      this.connections[databaseName] = new SequelizeConnection(options);
    }

    return this.connections[databaseName].connect();
  }

  /**
   * Closed to database connection (static)
   * @param {string} databaseName Database name
   * @return {Sequelize} Sequelize instance
   */
  public static async close(databaseName: string): Promise<Sequelize> {
    if (
      !this.connections[databaseName] &&
      Object.keys(databaseOptions).includes(databaseName)
    ) {
      const options =
        Object.entries(databaseOptions).find(
          ([k]) => k === databaseName
        )?.[1] ?? {};
      this.connections[databaseName] = new SequelizeConnection(options);
    }

    return this.connections[databaseName].close();
  }
}
