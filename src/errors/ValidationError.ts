import {IError} from '@/interfaces/common/IError';
import CustomError from './CustomError';

/**
 * Validation Error
 */
class ValidationError extends CustomError implements IError {
  public static type: string = 'VALIDATION_ERROR';
  public name: string;

  /**
   * Constructor
   * @param {string} message - Error message
   */
  constructor(message: string) {
    super({code: null, type: ValidationError.type, message});
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

CustomError.registerErrorType(ValidationError);
export default ValidationError;
