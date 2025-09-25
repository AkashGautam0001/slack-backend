export const internalErrorResponse = (error) => {
  return {
    success: false,
    err: error,
    data: {},
    message: 'Internal Server error'
  };
};

export const customErrorResponse = (error) => {
  if (!error.message && !error.explaintion) {
    return internalErrorResponse(error);
  }
  return {
    success: false,
    err: error.explaintion,
    data: {},
    message: error.message
  };
};

export const successResponse = (data, message) => {
  return {
    success: true,
    message,
    data,
    err: {}
  };
};
