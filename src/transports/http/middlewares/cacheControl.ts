import {NextFunction, Request, Response} from 'express';
import environment from '@/configs/environment';

const middleware = (req: Request, res: Response, next: NextFunction) => {
  res.set('Cache-Control', environment.HTTP_DEFAULT_CACHE_CONTROL);
  next();
};

export default middleware;
