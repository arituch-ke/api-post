import {Request, Response, NextFunction} from 'express';
import {failed, success} from '../helpers/response';

export const getApiIdentity = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = {message: 'API Post Service'};

    success(res, {status: 'SUCCESS', result});
  } catch (error) {
    next(error);
  }
};

export const notImplement = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = {
      code: null,
      type: 'INTERNAL_SERVER_ERROR',
      message: 'Not Implemented',
    };

    failed(res, {status: 'ERROR', result}, 501);
  } catch (error) {
    next(error);
  }
};
