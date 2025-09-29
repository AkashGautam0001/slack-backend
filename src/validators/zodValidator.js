import { StatusCodes } from 'http-status-codes';
import { customErrorResponse } from '../utils/common/responseObject.js';

export const validate = (schema) => {
  return async (req, res, next) => {
    try {
      await schema.parse(req.body);
      next();
    } catch (error) {
      console.log('Validation error in zod resolver', error);
      let explaintion = [];
      let errorMessage = 'Validation Error => ';
      JSON.parse(error)?.forEach((key) => {
        explaintion.push(key.path[0] + ' ' + key.message);
        errorMessage += 'Path - ' + key.path[0] + ' : ' + key.message + ' \n ';
      });
      res.status(StatusCodes.BAD_REQUEST).json(
        customErrorResponse({
          message: 'Validation error' + errorMessage,
          explaintion: explaintion
        })
      );
    }
  };
};
