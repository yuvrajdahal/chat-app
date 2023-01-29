import ErrorResponse from "../utils/ErrorResponse";
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  if (err.name === "CastError") {
    const message = `Resource not found of id ${err.value}`;
    error = new ErrorResponse(message, 404);
  }

  if (err.code === 11000) {
    const message = `Already exist`;
    console.log(err.message);
    error = new ErrorResponse(message, 404);
  }

  if (err.name === "ValdationError") {
    const message = Object.values(err.errors).map((e) => e.message);
    error = new ErrorResponse(message, 404);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Server Error",
    statuscode: error.statusCode || 500
  });
};
export default errorHandler;
