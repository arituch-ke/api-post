import {Request, Response, NextFunction} from 'express';
import * as services from '@/services';
import {success} from '../helpers/response';
import {UUID} from 'crypto';

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {email, password} = req.body as {email: string; password: string};
    const result = await services.AuthenticationService.login(email, password);

    success(res, {status: 'SUCCESS', result});
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {id: userId} = req.user as {id: UUID};
    const {accessToken, refreshToken} = req.body as {
      accessToken: string;
      refreshToken: string;
    };

    const result = await services.AuthenticationService.refreshToken(
      userId,
      accessToken,
      refreshToken
    );

    success(res, {status: 'SUCCESS', result});
  } catch (error) {
    next(error);
  }
};
