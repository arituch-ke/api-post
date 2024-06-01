import Service from '@/abstracts/Service';
import {UUID} from 'crypto';

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
};

export type RefreshTokenResponse = {
  accessToken: string;
  refreshToken: string;
};

export interface IAuthenticationService extends Service {
  login(email: string, password: string): Promise<LoginResponse>;
  refreshToken(
    userId: UUID,
    accessToken: string,
    refreshToken: string
  ): Promise<RefreshTokenResponse>;
}
