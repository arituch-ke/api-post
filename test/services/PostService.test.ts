import {AuthenticationError, PermissionError, ValidationError} from '@/errors';
import {
  mockCreatePost,
  mockPost,
  mockPostCreateId,
  mockPostDeleteCount,
  mockPostUpdateId,
  mockUpdatePost,
  mockUserIdNotHasPermission,
} from '../testHelpers/data/post';

import * as repositories from '@/repositories';
import {UUID} from 'crypto';
import PostService from '@/services/PostService';
import UserService from '@/services/UserService';
import {mockUser, mockUserCreateId} from '../testHelpers/data/user';
import {ListPostRequest} from '@/interfaces/services/IPostService';
import PostRepository from '@/repositories/PostRepository';
import UserRepository from '@/repositories/UserRepository';
import {PostStatus} from '@/interfaces/models/IPost';

describe('PostService', () => {
  let service: PostService;

  beforeEach(() => {
    service = new PostService(repositories.blog);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getAllPost', () => {
    it('should return a ListPostResponse', async () => {
      // Arrange
      const request = {page: 1, limit: 10};
      jest
        .spyOn(PostRepository.prototype, 'findAll')
        .mockResolvedValue({posts: [mockPost], page: 1, limit: 10, total: 1});

      // Act
      const result = await service.getAllPost(request);

      // Assert
      expect(result.posts).toEqual([mockPost]);
    });

    it('should throw a ValidationError when page is zero', async () => {
      // Arrange
      const request = {page: 0, limit: 1};

      // Act & Assert
      await expect(service.getAllPost(request)).rejects.toThrow(
        ValidationError
      );
      await expect(service.getAllPost(request)).rejects.toBe(
        '"page" must be greater than or equal to 1'
      );
    });

    it('should throw a ValidationError when limit is Zero', async () => {
      // Arrange
      const request = {page: 1, limit: 0};

      // Act & Assert
      await expect(service.getAllPost(request)).rejects.toThrow(
        ValidationError
      );
      await expect(service.getAllPost(request)).rejects.toBe(
        '"limit" must be greater than or equal to 1'
      );
    });

    it('should throw a ValidationError when page is negative', async () => {
      // Arrange
      const request = {page: -1, limit: 1};

      // Act & Assert
      await expect(service.getAllPost(request)).rejects.toThrow(
        ValidationError
      );
      await expect(service.getAllPost(request)).rejects.toBe(
        '"page" must be greater than or equal to 1'
      );
    });

    it('should throw a ValidationError when limit is negative', async () => {
      // Arrange
      const request = {page: 1, limit: -1};

      // Act & Assert
      await expect(service.getAllPost(request)).rejects.toThrow(
        ValidationError
      );
      await expect(service.getAllPost(request)).rejects.toBe(
        '"limit" must be greater than or equal to 1'
      );
    });

    it('should throw a ValidationError when filter status is not valid', async () => {
      // Arrange
      const request = {
        page: 1,
        limit: 10,
        status: 'INVALID_STATUS' as ListPostRequest['status'],
      };

      // Act & Assert
      await expect(service.getAllPost(request)).rejects.toThrow(
        ValidationError
      );
      await expect(service.getAllPost(request)).rejects.toBe(
        '"status" must be one of [DRAFT, PUBLISHED, ARCHIVED]'
      );
    });

    it('should throw a ValidationError when sort is not valid', async () => {
      // Arrange
      const request = {
        page: 1,
        limit: 10,
        sort: 'INVALID_SORT' as 'ASC' | 'DESC',
      };

      // Act & Assert
      await expect(service.getAllPost(request)).rejects.toThrow(
        ValidationError
      );
      await expect(service.getAllPost(request)).rejects.toBe(
        '"sort" must be one of [ASC, DESC]'
      );
    });

    it('should throw a ValidationError when search is null', async () => {
      // Arrange
      const request = {search: null};

      // Act & Assert
      await expect(service.getAllPost(request)).rejects.toThrow(
        ValidationError
      );
      await expect(service.getAllPost(request)).rejects.toBe(
        '"search" must be a string'
      );
    });
  });

  describe('getPostById', () => {
    it('should return a PostResponse', async () => {
      // Arrange
      const postId = mockPost.id;
      jest
        .spyOn(PostRepository.prototype, 'findById')
        .mockResolvedValue(mockPost);

      // Act
      const result = await service.getPostById(postId);

      // Assert
      expect(result).toEqual({post: mockPost});
    });

    it('should throw a ValidationError when postId is not a UUID', async () => {
      // Arrange
      const postId = 'INVALID_UUID' as UUID;

      // Act & Assert
      await expect(service.getPostById(postId)).rejects.toThrow(
        ValidationError
      );
      await expect(service.getPostById(postId)).rejects.toBe(
        '"postId" must be a valid GUID'
      );
    });

    it('should throw a ValidationError when postId not found', async () => {
      // Arrange
      const postId = mockPost.userId;
      jest.spyOn(PostRepository.prototype, 'findById').mockResolvedValue(null);

      // Act & Assert
      await expect(service.getPostById(postId)).rejects.toThrow(
        ValidationError
      );
      await expect(service.getPostById(postId)).rejects.toBe('Post not found');
    });
  });

  describe('createPost', () => {
    it('should return a CommonPostResponse', async () => {
      // Arrange
      const userId = mockUser.id;
      const request = mockCreatePost;
      jest
        .spyOn(UserRepository.prototype, 'findById')
        .mockResolvedValue(mockUser);
      jest
        .spyOn(PostRepository.prototype, 'create')
        .mockResolvedValue(mockPostCreateId);

      // Act
      const result = await service.createPost(userId, request.post);

      // Assert
      expect(result).toEqual({
        message: 'Created post successfully',
        postId: mockPostCreateId,
      });
    });

    it('should throw a ValidationError when userId is not a UUID', async () => {
      // Arrange
      const userId = 'INVALID_UUID' as UUID;
      const request = mockCreatePost;

      // Act & Assert
      await expect(service.createPost(userId, request.post)).rejects.toThrow(
        ValidationError
      );
      await expect(service.createPost(userId, request.post)).rejects.toBe(
        '"userId" must be a valid GUID'
      );
    });

    it('should throw a ValidationError when user not found', async () => {
      // Arrange
      const userId = mockPost.id;
      const request = mockCreatePost;
      jest.spyOn(UserRepository.prototype, 'findById').mockResolvedValue(null);

      // Act & Assert
      await expect(service.createPost(userId, request.post)).rejects.toThrow(
        ValidationError
      );
      await expect(service.createPost(userId, request.post)).rejects.toBe(
        'User not found'
      );
    });

    it('should throw a ValidationError when status is not valid', async () => {
      // Arrange
      const userId = mockUser.id;
      const request = {
        ...mockCreatePost,
        post: {
          ...mockCreatePost.post,
          status: 'INVALID_STATUS' as PostStatus,
        },
      };

      // Act & Assert
      await expect(service.createPost(userId, request.post)).rejects.toThrow(
        ValidationError
      );
      await expect(service.createPost(userId, request.post)).rejects.toBe(
        '"post.status" must be one of [DRAFT, PUBLISHED, ARCHIVED]'
      );
    });

    it('should throw a ValidationError when title is empty', async () => {
      // Arrange
      const userId = mockUser.id;
      const request = {
        ...mockCreatePost,
        post: {...mockCreatePost.post, title: ''},
      };

      // Act & Assert
      await expect(service.createPost(userId, request.post)).rejects.toThrow(
        ValidationError
      );
      await expect(service.createPost(userId, request.post)).rejects.toBe(
        '"post.title" is not allowed to be empty'
      );
    });

    it('should throw a ValidationError when content is empty', async () => {
      // Arrange
      const userId = mockUser.id;
      const request = {
        ...mockCreatePost,
        post: {...mockCreatePost.post, content: ''},
      };

      // Act & Assert
      await expect(service.createPost(userId, request.post)).rejects.toThrow(
        ValidationError
      );
      await expect(service.createPost(userId, request.post)).rejects.toBe(
        '"post.content" is not allowed to be empty'
      );
    });

    it('should throw a ValidationError when tags is not an array', async () => {
      // Arrange
      const userId = mockUser.id;
      const request = {
        ...mockCreatePost,
        post: {...mockCreatePost.post, tags: '' as any},
      };

      // Act & Assert
      await expect(service.createPost(userId, request.post)).rejects.toThrow(
        ValidationError
      );
      await expect(service.createPost(userId, request.post)).rejects.toBe(
        '"post.tags" must be an array'
      );
    });
  });

  describe('updatePost', () => {
    it('should return a CommonPostResponse', async () => {
      // Arrange
      const userId = mockUser.id;
      const postId = mockPost.id;
      const request = mockUpdatePost;
      jest
        .spyOn(PostRepository.prototype, 'findById')
        .mockResolvedValue(mockPost);
      jest
        .spyOn(PostRepository.prototype, 'updateById')
        .mockResolvedValue(mockPostUpdateId);

      // Act
      const result = await service.updatePostById(userId, postId, request.post);

      // Assert
      expect(result).toEqual({
        message: 'Updated post successfully',
        postId: mockPostUpdateId,
      });
    });

    it('should throw a ValidationError when userId is not a UUID', async () => {
      // Arrange
      const userId = 'INVALID_UUID' as UUID;
      const postId = mockPost.id;
      const request = mockUpdatePost;

      // Act & Assert
      await expect(
        service.updatePostById(userId, postId, request.post)
      ).rejects.toThrow(ValidationError);
      await expect(
        service.updatePostById(userId, postId, request.post)
      ).rejects.toBe('"userId" must be a valid GUID');
    });

    it('should throw a ValidationError when postId is not a UUID', async () => {
      // Arrange
      const userId = mockUser.id;
      const postId = 'INVALID_UUID' as UUID;
      const request = mockUpdatePost;

      // Act & Assert
      await expect(
        service.updatePostById(userId, postId, request.post)
      ).rejects.toThrow(ValidationError);
      await expect(
        service.updatePostById(userId, postId, request.post)
      ).rejects.toBe('"postId" must be a valid GUID');
    });

    it('should throw a ValidationError when user not has permission', async () => {
      // Arrange
      const userId = mockUserIdNotHasPermission;
      const postId = mockPost.id;
      const request = mockUpdatePost;
      jest
        .spyOn(PostRepository.prototype, 'findById')
        .mockResolvedValue(mockPost);

      // Act & Assert
      await expect(
        service.updatePostById(userId, postId, request.post)
      ).rejects.toThrow(PermissionError);
      await expect(
        service.updatePostById(userId, postId, request.post)
      ).rejects.toBe('Unauthorized to update post');
    });

    it('should throw a ValidationError when post not found', async () => {
      // Arrange
      const userId = mockUser.id;
      const postId = mockPost.id;
      const request = mockUpdatePost;
      jest.spyOn(PostRepository.prototype, 'findById').mockResolvedValue(null);

      // Act & Assert
      await expect(
        service.updatePostById(userId, postId, request.post)
      ).rejects.toThrow(ValidationError);
      await expect(
        service.updatePostById(userId, postId, request.post)
      ).rejects.toBe('Post not found');
    });

    it('should throw a ValidationError when status is not valid', async () => {
      // Arrange
      const userId = mockUser.id;
      const postId = mockPost.id;
      const request = {
        ...mockUpdatePost,
        post: {...mockUpdatePost.post, status: 'INVALID_STATUS' as PostStatus},
      };

      // Act & Assert
      await expect(
        service.updatePostById(userId, postId, request.post)
      ).rejects.toThrow(ValidationError);
      await expect(
        service.updatePostById(userId, postId, request.post)
      ).rejects.toBe(
        '"post.status" must be one of [DRAFT, PUBLISHED, ARCHIVED]'
      );
    });

    it('should throw a ValidationError when title is empty', async () => {
      // Arrange
      const userId = mockUser.id;
      const postId = mockPost.id;
      const request = {
        ...mockUpdatePost,
        post: {...mockUpdatePost.post, title: ''},
      };

      // Act & Assert
      await expect(
        service.updatePostById(userId, postId, request.post)
      ).rejects.toThrow(ValidationError);
      await expect(
        service.updatePostById(userId, postId, request.post)
      ).rejects.toBe('"post.title" is not allowed to be empty');
    });

    it('should throw a ValidationError when content is empty', async () => {
      // Arrange
      const userId = mockUser.id;
      const postId = mockPost.id;
      const request = {
        ...mockUpdatePost,
        post: {...mockUpdatePost.post, content: ''},
      };

      // Act & Assert
      await expect(
        service.updatePostById(userId, postId, request.post)
      ).rejects.toThrow(ValidationError);
      await expect(
        service.updatePostById(userId, postId, request.post)
      ).rejects.toBe('"post.content" is not allowed to be empty');
    });

    it('should throw a ValidationError when tags is not an array', async () => {
      // Arrange
      const userId = mockUser.id;
      const postId = mockPost.id;
      const request = {
        ...mockUpdatePost,
        post: {...mockUpdatePost.post, tags: '' as any},
      };

      // Act & Assert
      await expect(
        service.updatePostById(userId, postId, request.post)
      ).rejects.toThrow(ValidationError);
      await expect(
        service.updatePostById(userId, postId, request.post)
      ).rejects.toBe('"post.tags" must be an array');
    });
  });
});
