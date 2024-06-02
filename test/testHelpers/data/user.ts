import {IUser, UserStatus} from '@/interfaces/models/IUser';
import {faker} from '@faker-js/faker';
import {UUID} from 'crypto';
import * as bcrypt from 'bcryptjs';

const randomId = faker.string.uuid() as UUID;
const randomName = faker.person.fullName();
const randomUsername = faker.internet.userName();
const randomEmail = faker.internet.email();
const randomPassword = faker.internet.password();
const randomDate = faker.date.recent();

export const mockUserCreateId = faker.string.uuid() as UUID;
export const mockUserUpdateId = faker.string.uuid() as UUID;
export const mockUserDeleteCount = 1;
export const randomRefreshToken = faker.internet.password();
export const randomAccessToken = faker.internet.password();
export const mockUser: IUser = {
  id: randomId,
  name: randomName,
  username: randomUsername,
  email: randomEmail,
  password: bcrypt.hashSync(randomPassword, bcrypt.genSaltSync()),
  status: UserStatus.ACTIVE,
  lastLogin: randomDate,
  refreshToken: randomRefreshToken,
  createdAt: randomDate,
  updatedAt: randomDate,
};

export const mockCreateUser: Pick<IUser, 'email' | 'name' | 'password'> = {
  name: faker.person.fullName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
};
