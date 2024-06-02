import {AuthenticationError, ValidationError} from '@/errors';
import {
  mockUser,
  mockUserCreateId,
  mockUserDeleteCount,
  mockUserUpdateId,
  randomAccessToken,
} from '../testHelpers/data/user';

import {UUID} from 'crypto';
import AuthenticationService from '@/services/AuthenticationService';
import * as repositories from '@/repositories';
import UserRepository from '@/repositories/UserRepository';

describe('AuthenticationService', () => {
  let service: AuthenticationService;

  beforeEach(() => {
    service = new AuthenticationService(repositories.blog);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('login', () => {
    it('should return a LoginResponse', async () => {
      // Arrange
      const email = mockUser.email;
      const password = mockUser.password;
      jest
        .spyOn(UserRepository.prototype, 'findByEmail')
        .mockResolvedValue(mockUser);
      jest
        .spyOn(UserRepository.prototype, 'updateById')
        .mockResolvedValue(mockUserCreateId);
      jest.spyOn(service, 'validPassword').mockReturnValue(true);
      jest
        .spyOn(service, 'generateAccessToken')
        .mockReturnValue(randomAccessToken);
      jest
        .spyOn(service, 'generateRefreshToken')
        .mockReturnValue(mockUser.refreshToken);

      // Act
      const result = await service.login(email, password);

      // Assert
      expect(result).toEqual({
        accessToken: randomAccessToken,
        refreshToken: mockUser.refreshToken,
      });
    });

    it('should throw an AuthenticationError when password invalid', async () => {
      // Arrange
      const email = mockUser.email;
      const password = 'wrong-password';
      jest
        .spyOn(UserRepository.prototype, 'findByEmail')
        .mockResolvedValue(mockUser);

      // Act & Assert
      await expect(service.login(email, password)).rejects.toThrow(
        AuthenticationError
      );
      await expect(service.login(email, password)).rejects.toThrow(
        'Invalid email or password.'
      );
    });

    it('should throw an AuthenticationError when email not found', async () => {
      // Arrange
      const email = 'test@gmail.com';
      const password = mockUser.password;
      jest
        .spyOn(UserRepository.prototype, 'findByEmail')
        .mockResolvedValue(null);

      // Act & Assert
      await expect(service.login(email, password)).rejects.toThrow(
        AuthenticationError
      );
      await expect(service.login(email, password)).rejects.toThrow(
        'Invalid email or password.'
      );
    });

    it('should throw an ValidationError when email is empty', async () => {
      // Arrange
      const email = '';
      const password = mockUser.password;

      // Act & Assert
      await expect(service.login(email, password)).rejects.toThrow(
        ValidationError
      );
      await expect(service.login(email, password)).rejects.toThrow(
        '"email" is not allowed to be empty'
      );
    });

    it('should throw an ValidationError when password is empty', async () => {
      // Arrange
      const email = mockUser.email;
      const password = '';

      // Act & Assert
      await expect(service.login(email, password)).rejects.toThrow(
        ValidationError
      );
      await expect(service.login(email, password)).rejects.toThrow(
        '"password" is not allowed to be empty'
      );
    });
  });

  describe('refreshToken', () => {
    it('should return a RefreshTokenResponse', async () => {
      // Arrange
      const userId = mockUser.id;
      const accessToken = randomAccessToken;
      const refreshToken = mockUser.refreshToken;
      jest
        .spyOn(UserRepository.prototype, 'findById')
        .mockResolvedValue(mockUser);
      jest
        .spyOn(UserRepository.prototype, 'updateById')
        .mockResolvedValue(mockUserCreateId);
      jest
        .spyOn(service, 'generateAccessToken')
        .mockReturnValue(randomAccessToken);
      jest
        .spyOn(service, 'generateRefreshToken')
        .mockReturnValue(mockUser.refreshToken);

      // Act
      const result = await service.refreshToken(
        userId,
        accessToken,
        refreshToken
      );

      // Assert
      expect(result).toEqual({
        accessToken: randomAccessToken,
        refreshToken: mockUser.refreshToken,
      });
    });

    it('should throw an ValidationError when userId is empty', async () => {
      // Arrange
      const userId = '' as UUID;
      const accessToken = randomAccessToken;
      const refreshToken = mockUser.refreshToken;

      // Act & Assert
      await expect(
        service.refreshToken(userId, accessToken, refreshToken)
      ).rejects.toThrow(ValidationError);
      await expect(
        service.refreshToken(userId, accessToken, refreshToken)
      ).rejects.toThrow('"userId" is not allowed to be empty');
    });

    it('should throw an ValidationError when accessToken is empty', async () => {
      // Arrange
      const userId = mockUser.id;
      const accessToken = '';
      const refreshToken = mockUser.refreshToken;

      // Act & Assert
      await expect(
        service.refreshToken(userId, accessToken, refreshToken)
      ).rejects.toThrow(ValidationError);
      await expect(
        service.refreshToken(userId, accessToken, refreshToken)
      ).rejects.toThrow('"accessToken" is not allowed to be empty');
    });

    it('should throw an ValidationError when refreshToken is empty', async () => {
      // Arrange
      const userId = mockUser.id;
      const accessToken = randomAccessToken;
      const refreshToken = '';

      // Act & Assert
      await expect(
        service.refreshToken(userId, accessToken, refreshToken)
      ).rejects.toThrow(ValidationError);
      await expect(
        service.refreshToken(userId, accessToken, refreshToken)
      ).rejects.toThrow('"refreshToken" is not allowed to be empty');
    });

    it('should throw an AuthenticationError when user not found', async () => {
      // Arrange
      const userId = mockUser.id;
      const accessToken = randomAccessToken;
      const refreshToken = mockUser.refreshToken;
      jest.spyOn(UserRepository.prototype, 'findById').mockResolvedValue(null);

      // Act & Assert
      await expect(
        service.refreshToken(userId, accessToken, refreshToken)
      ).rejects.toThrow(AuthenticationError);
      await expect(
        service.refreshToken(userId, accessToken, refreshToken)
      ).rejects.toThrow('Invalid user.');
    });

    it('should throw an AuthenticationError when refresh token invalid', async () => {
      // Arrange
      const userId = mockUser.id;
      const accessToken = randomAccessToken;
      const refreshToken = 'invalid-refresh-token';
      jest
        .spyOn(UserRepository.prototype, 'findById')
        .mockResolvedValue(mockUser);

      // Act & Assert
      await expect(
        service.refreshToken(userId, accessToken, refreshToken)
      ).rejects.toThrow(AuthenticationError);
      await expect(
        service.refreshToken(userId, accessToken, refreshToken)
      ).rejects.toThrow('Invalid refresh token.');
    });
  });
});
