import { StatusCodes } from 'http-status-codes';
import {
  customErrorResponse,
  internalErrorResponse,
  successResponse
} from '../utils/common/responseObject.js';
import { signInService, signUpService } from '../services/userServices.js';

export const signUp = async (req, res) => {
  try {
    const user = await signUpService(req.body);
    return res
      .status(StatusCodes.CREATED)
      .json(successResponse(user, 'User created Successfully'));
  } catch (error) {
    console.log('User controller error', error);
    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
};

export const signIn = async (req, res) => {
  try {
    const response = await signInService(req.body);
    return res
      .status(StatusCodes.OK)
      .json(successResponse(response, 'User signed in successfully'));
  } catch (error) {
    console.log('User controller error ', error);
    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
};
