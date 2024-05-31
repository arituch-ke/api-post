import * as joi from 'joi';
import {ValidationError} from '@/errors';
/**
 * Validation class
 */
export abstract class Validation {
  /**
   * Run Validation
   * @param {*} args Arguments
   * @param {joi.ObjectSchema} schema Joi schema
   * @return {Promise<*>} Validated arguments
   */
  protected async runValidation<T>(
    args: T,
    schema: joi.ObjectSchema
  ): Promise<T> {
    try {
      return await schema.validateAsync(args);
    } catch (error: Error | unknown) {
      if (error instanceof joi.ValidationError) {
        throw new ValidationError(error.message);
      }
      throw error;
    }
  }
}
