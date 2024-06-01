import {NextFunction, Request, Response} from 'express';
import environment from '@/configs/environment';
import Logger from '@/helpers/Logger';
import {CustomError, AuthenticationError} from '@/errors';

import {INTERNAL_SERVER_ERROR} from 'http-status';
import {failed} from '@/transports/http/helpers/response';
import {IResponseFailed} from '@/interfaces/common/IResponse';

/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Error Handler
 * @param {CustomError} error the error
 * @param {Request} req express request
 * @param {Response} res express response
 * @param {NextFunction} next express next function
 * @return {Promise<Response>} response
 */
export default async function (
  error: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Translate auth error from passport.js to our own error
  if (
    !(error instanceof AuthenticationError) &&
    error.name === 'AuthenticationError'
  ) {
    error = new AuthenticationError(error.message);
  }

  const responseNormalFailed: IResponseFailed = {
    status: 'ERROR',
    result: error,
  };
  const responseFailed: IResponseFailed = {
    status: 'ERROR',
    result: {
      code: null,
      type: 'INTERNAL_SERVER_ERROR',
      message: 'Oops! something went wrong.',
    },
  };

  const errorMessageWithStack = String(
    error instanceof Error ? error.stack : error
  );

  Logger.error(String(errorMessageWithStack), {error: errorMessageWithStack});

  try {
    if (error instanceof CustomError) {
      return failed(res, responseNormalFailed);
    }

    if (environment.NODE_ENV !== 'production') {
      responseFailed.result.message = errorMessageWithStack;
    }

    return failed(res, responseFailed, INTERNAL_SERVER_ERROR);
  } catch (error: CustomError | Error | unknown) {
    if (error instanceof CustomError || error instanceof Error) {
      Logger.error(`Failed to handle error: ${error.message}`, {
        stack: error.stack,
      });
    }

    return failed(res, responseFailed, INTERNAL_SERVER_ERROR);
  }
}
