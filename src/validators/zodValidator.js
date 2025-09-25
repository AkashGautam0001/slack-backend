import { StatusCodes } from 'http-status-codes';
import { customErrorResponse } from '../utils/common/responseObject.js';

export const validate = (schema) => {
  return async (req, res, next) => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error) {
      console.log('Validation error i zod resolver', error.errors);
      let explaintion = [];
      let errorMessage = '';
      error.errors.forEach((key) => {
        explaintion.push(key.message);
        errorMessage + ' : ' + key.message;
      });
      res.status(StatusCodes.BAD_REQUEST).json(
        customErrorResponse({
          message: 'Validation Error',
          explaintion: explaintion
        })
      );
    }
  };
};
