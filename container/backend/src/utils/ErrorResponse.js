class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, new.target.prototype);
    this.isOperational = true;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ErrorResponse);
    }
  }
}

export default ErrorResponse;
