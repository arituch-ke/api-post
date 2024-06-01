import ISequelizeTransactionHelper from '@/interfaces/common/ISequelizeTransaction';
import Service from '@/abstracts/Service';
import {IUserRepository} from '@/interfaces/repositories/IUserRepository';
import {
  IAuthenticationService,
  LoginResponse,
  RefreshTokenResponse,
} from '@/interfaces/services/IAuthenticationService';
import Logger from '@/helpers/Logger';
import {UUID} from 'crypto';
import * as bcrypt from 'bcryptjs';
import dayjs from '@/helpers/dayjs';
import * as jwt from 'jsonwebtoken';
import environment from '@/configs/environment';
import {
  DEFAULT_ACCESS_TOKEN_LIFETIME,
  DEFAULT_REFRESH_TOKEN_LIFETIME,
} from '@/helpers/constants';
import {AuthenticationError} from '@/errors';
import * as joi from 'joi';

/**
 * AuthenticationService
 */
export default class AuthenticationService
  extends Service
  implements IAuthenticationService
{
  private readonly UserRepository: IUserRepository;
  private readonly runTransaction: ISequelizeTransactionHelper;

  /**
   * Constructor
   * @param {Object.<string, string>|null} repositories Repositories
   */
  constructor({
    UserRepository,
    transaction,
  }: {
    UserRepository: new () => IUserRepository;
    transaction: ISequelizeTransactionHelper;
  }) {
    super();
    this.UserRepository = new UserRepository();
    this.runTransaction = transaction;
  }

  /**
   * Generate access token
   * @param {UUID} userId - The user ID
   * @param {string | number} expiresIn - The expires
   * @return {string} Access token
   */
  private generateAccessToken(
    userId: UUID,
    expiresIn: string | number = DEFAULT_ACCESS_TOKEN_LIFETIME
  ) {
    const token = jwt.sign(
      {id: userId, type: 'access', expiresIn},
      environment.API_JWT_SECRET,
      {expiresIn}
    );

    Logger.info(
      `Successfully generated access token for user id=${userId} with expiresIn=${expiresIn}`,
      {userId, expiresIn}
    );

    return token;
  }

  /**
   * Valid Password
   * @param {string} password - The user password
   * @param {string} hashPassword - The user hash password
   * @return {Boolean} The user
   * @private
   */
  private validPassword(password: string, hashPassword: string): Boolean {
    return bcrypt.compareSync(password, hashPassword);
  }

  /**
   * Refresh access token
   * @param {UUID} userId - The user ID
   * @param {string | number} expiresIn - The expires
   * @return {string} Access token
   */
  private generateRefreshToken(
    userId: UUID,
    expiresIn: string | number = DEFAULT_REFRESH_TOKEN_LIFETIME
  ) {
    const token = jwt.sign(
      {id: userId, type: 'refresh', expiresIn},
      environment.API_JWT_SECRET,
      {expiresIn}
    );

    Logger.debug(
      `Successfully generated refresh token for user id=${userId} with expiresIn=${expiresIn}`,
      {userId, expiresIn}
    );

    return token;
  }

  /**
   * Login is valid by email and password.
   * @param {String} email - The user email
   * @param {String} password - The password
   * @returns {Promise<LoginResponse>} The user
   */
  public async login(email: string, password: string): Promise<LoginResponse> {
    const schema = joi.object().keys({
      email: joi.string().email().required(),
      password: joi.string().required(),
    });

    const value = await this.runValidation({email, password}, schema);

    const user = await this.UserRepository.findByEmail(value.email);
    if (!user) {
      Logger.error(`User with email=${email} not found`, {email: value.email});
      throw new AuthenticationError('Invalid email or password.');
    }

    if (!this.validPassword(password, user.password)) {
      Logger.error(`User with email=${email} has invalid password`, {
        email: value.email,
      });
      throw new AuthenticationError('Invalid email or password.');
    }

    const accessToken = this.generateAccessToken(user.id);
    const refreshToken = this.generateRefreshToken(user.id);

    this.runTransaction(async transaction => {
      await this.UserRepository.updateById(
        user.id,
        {lastLogin: dayjs().toDate(), refreshToken},
        transaction
      );
    });

    Logger.info(`Successfully login user with email=${email}`, {email});

    return {
      accessToken,
      refreshToken,
    };
  }

  /**
   * Revoke auth token by user ID
   * @param {UUID} userId - The user ID
   * @param {string} accessToken - The access token
   * @param {string} refreshToken - The refresh token
   * @return {Promise<RefreshTokenResponse>} Refresh token response
   */
  public async refreshToken(
    userId: UUID,
    accessToken: string,
    refreshToken: string
  ): Promise<RefreshTokenResponse> {
    const schema = joi.object().keys({
      userId: joi.string().uuid().required(),
      accessToken: joi.string().required(),
      refreshToken: joi.string().required(),
    });

    const value = await this.runValidation(
      {userId, accessToken, refreshToken},
      schema
    );

    const user = await this.UserRepository.findById(value.userId);
    if (!user) {
      Logger.error(`User with userId=${userId} not found`, {
        userId: value.userId,
      });
      throw new AuthenticationError('Invalid user.');
    }

    if (user.refreshToken !== value.refreshToken) {
      Logger.error(`User with userId=${userId} has invalid refresh token`, {
        userId: value.userId,
      });
      throw new AuthenticationError('Invalid refresh token.');
    }

    const newAccessToken = this.generateAccessToken(user.id);
    const newRefreshToken = this.generateRefreshToken(user.id);

    this.runTransaction(async transaction => {
      await this.UserRepository.updateById(
        user.id,
        {refreshToken: newRefreshToken},
        transaction
      );
    });

    Logger.info(`Successfully refresh access token for userId=${userId}`, {
      userId: value.userId,
    });

    return {accessToken: newAccessToken, refreshToken: newRefreshToken};
  }
}
