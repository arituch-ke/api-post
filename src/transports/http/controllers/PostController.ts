import {Request, Response, NextFunction} from 'express';
import * as services from '@/services';
import {success} from '../helpers/response';
import {UUID} from 'crypto';
import {ListPostRequest} from '@/interfaces/services/IPostService';

export const getAllPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const request = req.query as ListPostRequest;
    const result = await services.PostService.getAllPost(request);

    success(res, {status: 'SUCCESS', result});
  } catch (error) {
    next(error);
  }
};

export const createPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {id: userId} = req.user as {id: UUID};
    const body = req.body;
    const result = await services.PostService.createPost(userId, body);

    success(res, {status: 'SUCCESS', result});
  } catch (error) {
    next(error);
  }
};

export const getPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {postId} = req.params as {postId: UUID};
    const result = await services.PostService.getPostById(postId);

    success(res, {status: 'SUCCESS', result});
  } catch (error) {
    next(error);
  }
};

export const updatePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {id: userId} = req.user as {id: UUID};
    const {postId} = req.params as {postId: UUID};
    const body = req.body;
    const result = await services.PostService.updatePostById(
      userId,
      postId,
      body
    );

    success(res, {status: 'SUCCESS', result});
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {id: userId} = req.user as {id: UUID};
    const {postId} = req.params as {postId: UUID};
    const result = await services.PostService.deletePostById(userId, postId);

    success(res, {status: 'SUCCESS', result});
  } catch (error) {
    next(error);
  }
};
