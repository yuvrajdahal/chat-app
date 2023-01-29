import ErrorResponse from "../utils/ErrorResponse";

function logError(err) {
  console.error("AppError", {
    stack: err.stack,
    error: err.message,
    statusCode: err.statusCode,
  });
}

function logErrorMiddleware(err, req, res, next) {
  logError(err);
  next(err);
}

function isOperationalError(error) {
  if (error instanceof ErrorResponse) {
    return error.isOperational;
  }
  return false;
}

export { logError, logErrorMiddleware, isOperationalError };
