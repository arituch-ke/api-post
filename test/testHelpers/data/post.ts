import {IPost, AllPostStatus} from '@/interfaces/models/IPost';
import {faker} from '@faker-js/faker';
import {UUID} from 'crypto';
import {mockUser} from './user';

const randomId = faker.string.uuid() as UUID;
const randomTitle = faker.lorem.sentence();
const randomContent = faker.lorem.paragraph();
const randomCover = faker.image.avatar();
const randomPostedAt = faker.date.recent();
const randomTags = faker.lorem.words().split(' ');
const randomStatus = faker.helpers.arrayElement(AllPostStatus);
const randomDate = faker.date.recent();

export const mockPostCreateId = faker.string.uuid() as UUID;
export const mockPostUpdateId = faker.string.uuid() as UUID;
export const mockPostDeleteCount = 1;
export const mockUserIdNotHasPermission = faker.string.uuid() as UUID;
export const mockPost: IPost = {
  id: randomId,
  userId: mockUser.id,
  title: randomTitle,
  content: randomContent,
  cover: randomCover,
  postedBy: mockUser.name,
  postedAt: randomPostedAt,
  tags: randomTags,
  status: randomStatus,
  createdAt: randomDate,
  updatedAt: randomDate,
};

export const mockCreatePost: {
  userId: UUID;
  post: Pick<IPost, 'title' | 'content' | 'status' | 'tags'>;
} = {
  userId: mockUser.id,
  post: {
    title: faker.lorem.sentence(),
    content: faker.lorem.paragraph(),
    tags: faker.lorem.words().split(' '),
    status: faker.helpers.arrayElement(AllPostStatus),
  },
};

export const mockUpdatePost: {
  userId: UUID;
  postId: UUID;
  post: Partial<IPost>;
} = {
  userId: mockUser.id,
  postId: mockPost.id,
  post: {
    title: faker.lorem.sentence(),
    content: faker.lorem.paragraph(),
    tags: faker.lorem.words().split(' '),
    status: faker.helpers.arrayElement(AllPostStatus),
  },
};
