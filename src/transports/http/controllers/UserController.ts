import {Request, Response, NextFunction} from 'express';
import * as services from '@/services';
import {success} from '../helpers/response';
import {UUID} from 'crypto';

export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {id: userId} = req.user as {id: UUID};
    const result = await services.UserService.getUserById(userId);

    success(res, {status: 'SUCCESS', result});
  } catch (error) {
    next(error);
  }
};

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const body = req.body;
    const result = await services.UserService.createUser(body);

    success(res, {status: 'SUCCESS', result});
  } catch (error) {
    next(error);
  }
};
