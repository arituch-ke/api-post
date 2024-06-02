import {ValidationError} from '@/errors';
import UserService from '@/services/UserService';
import * as repositories from '@/repositories';
import UserRepository from '@/repositories/UserRepository';
import {
  mockCreateUser,
  mockUser,
  mockUserCreateId,
} from '../testHelpers/data/user';
import {UUID} from 'crypto';

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    service = new UserService(repositories.blog);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getUserById', () => {
    it('should return a UserResponse', async () => {
      // Arrange
      const userId = mockUser.id;
      jest
        .spyOn(UserRepository.prototype, 'findById')
        .mockResolvedValue(mockUser);

      // Act
      const user = await service.getUserById(userId);

      // Assert
      expect(user).toEqual({user: mockUser});
    });

    it('should throw a ValidationError if userId is not found', async () => {
      // Arrange
      const userId = '00000000-0000-0000-0000-000000000000';
      jest.spyOn(UserRepository.prototype, 'findById').mockResolvedValue(null);

      // Act & Assert
      await expect(service.getUserById(userId)).rejects.toThrow(
        ValidationError
      );
      await expect(service.getUserById(userId)).rejects.toThrow(
        'User not found'
      );
    });

    it('should throw a ValidationError if userId is not a valid UUID', async () => {
      // Arrange
      const userId = 'invalid-uuid' as UUID;

      // Act & Assert
      await expect(service.getUserById(userId)).rejects.toThrow(
        ValidationError
      );
      await expect(service.getUserById(userId)).rejects.toThrow(
        '"userId" must be a valid GUID'
      );
    });
  });

  describe('createUser', () => {
    it('should return a CreateUserResponse', async () => {
      // Arrange
      const request = mockCreateUser;
      jest
        .spyOn(UserRepository.prototype, 'findByEmail')
        .mockResolvedValue(null);
      jest
        .spyOn(UserRepository.prototype, 'create')
        .mockResolvedValue(mockUserCreateId);

      // Act
      const result = await service.createUser(request);
      // Assert
      expect(result.userId).toEqual(mockUserCreateId);
    });

    it('should throw a ValidationError if email is not valid', async () => {
      // Arrange
      const request = {...mockCreateUser, email: 'invalid-email'};

      // Act & Assert
      await expect(service.createUser(request)).rejects.toThrow(
        ValidationError
      );
      await expect(service.createUser(request)).rejects.toThrow(
        '"email" must be a valid email'
      );
    });

    it('should throw a ValidationError if password is not provided', async () => {
      // Arrange
      const request = {...mockCreateUser, password: ''};

      // Act & Assert
      await expect(service.createUser(request)).rejects.toThrow(
        ValidationError
      );
      await expect(service.createUser(request)).rejects.toThrow(
        '"password" is not allowed to be empty'
      );
    });

    it('should throw a ValidationError if name is not provided', async () => {
      // Arrange
      const request = {...mockCreateUser, name: ''};

      // Act & Assert
      await expect(service.createUser(request)).rejects.toThrow(
        ValidationError
      );
      await expect(service.createUser(request)).rejects.toThrow(
        '"name" is not allowed to be empty'
      );
    });

    it('should throw an ValidationError if email already exists', async () => {
      // Arrange
      const request = {...mockCreateUser, email: mockUser.email};
      jest
        .spyOn(UserRepository.prototype, 'findByEmail')
        .mockResolvedValue(mockUser);

      // Act & Assert
      await expect(service.createUser(request)).rejects.toThrow(
        ValidationError
      );
      await expect(service.createUser(request)).rejects.toThrow(
        'Email already exists'
      );
    });
  });
});
