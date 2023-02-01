import mongoose from "mongoose";
import asyncHandler from "../middlewares/asyncHandler";
import User from "../models/user_model";
import ErrorResponse from "../utils/ErrorResponse.js";

/**
 * @desc    Get User
 * @route   GET /api/v1/users
 * @access  Private
 */

export const getUsers = asyncHandler(async (req, res, next) => {
  const data = res.advanceResults?.data?.filter((user) => {
    return (
      user._id.toString() !== req.user._id.toString() &&
      user.isVerified === true
    );
  });

  res.status(201).json({
    ...res.advanceResults,
    data: data,
  });
});

/**
 * @desc    Get USER
 * @route   GET /api/v1/user/:id
 * @access  Private
 */
export const getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(
      new ErrorResponse(`User not found of id ${req.params.id}`, 404)
    );
  }

  res.status(201).json({
    success: true,
    data: user,
  });
});

/**
 * @desc    DELETE USER
 * @route   DELETE /api/v1/users/:id
 * @access  Private
 */
export const deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(
      new ErrorResponse(`User not found of id ${req.params.id}`, 404)
    );
  }
  user.remove();

  res.status(201).json({
    success: true,
    data: user,
  });
});

/**
 * @desc    UPDATE USER
 * @route   PUT /api/v1/update_user/:id
 * @access  Private
 */
export const updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.user._id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    success: true,
    data: user,
  });
});
