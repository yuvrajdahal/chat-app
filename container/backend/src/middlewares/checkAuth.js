import asyncHandler from "./asyncHandler";
import jwt from "jsonwebtoken";
import ErrorResponse from "../utils/ErrorResponse";
import User from "../models/user_model";

export const checkAuth = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = JSON.parse(req.headers.authorization.split(" ")[1]);
  }
  if (!token) {
    return next(new ErrorResponse("Not authorized to access this route", 401));
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded?.id);
    req.user = user;
    next();
  } catch (e) {
    return next(new ErrorResponse("Not authorized to access this route", 401));
  }
});
