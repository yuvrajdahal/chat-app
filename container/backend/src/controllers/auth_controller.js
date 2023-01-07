import crypto from "crypto";
import asyncHandler from "../middlewares/asyncHandler";
import User from "../models/user_model";
import ErrorResponse from "../utils/ErrorResponse.js";
import sendEmail from "../utils/emailHandler";

/**
 * @desc    Register User
 * @route   POST /api/v1/auth/register
 * @access  Public
 */

export const register = asyncHandler(async (req, res, next) => {
  const { email, name, password } = req.body;
  const emailToken = crypto.randomBytes(10).toString("hex");
  const user = await User.create({
    emailToken: crypto.createHash("sha256").update(emailToken).digest("hex"),
    email,
    password,
    name,
  });
  await user.save();
  let mailOptions = {
    email: user.email,
    subject: "Test verify email ",
    html: `<h2>${user.name} Thanks for catchin up to our site</h2>
      <h4>Please verify your email</h4>
      <a href="http://${req.headers.host}/api/v1/auth/verify_email?token=${user.emailToken}">Veriy email</a>
    `,
  };
  sendEmail(mailOptions)
    .then(() => {
      console.log("Email sent");
    })
    .catch(async (e) => {
      await user.remove();
      return next(new ErrorResponse(`Please provide valid Email`, 400));
    });
  res.status(201).json({
    success: true,
    data: "Check email for verfication",
  });
});

/**
 * @desc    Login User
 * @route   POST /api/v1/auth/login
 * @access  Public
 */

export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorResponse(`Please provide email and password`, 400));
  }

  const user = await User.findOne({ email }).select("+password");
  if (user === null || user === {}) {
    return next(new ErrorResponse(`Invalid Credintials`, 401));
  }
  if (!user.isVerified) {
    return next(new ErrorResponse(`Verify your email. Check mail`, 401));
  }

  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse(`Invalid Credintials`, 401));
  }

  sendTokenResponse(user, 200, res);
});

/**
 * @desc    Get Current User
 * @route   POST /api/v1/auth/current_user
 * @access  Public
 */

export const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("-emailToken");
  res.status(201).json({
    success: true,
    data: user,
  });
});

/**
 * @desc    Forgot password
 * @route   POST /api/v1/auth/forgot_password
 * @access  Public
 */
export const forgotPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    next(new ErrorResponse("No user with the email", 404));
  }
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/auth/resetpassword/${resetToken}`;

  const message = `You are receiving this email because you (or someone else)
  has requested the reset of a password. Please make a PUT request to:\n\n ${resetUrl}
  `;
  try {
    await sendEmail({
      email: user.email,
      subject: "Password reset token",
      message,
    });
  } catch (error) {
    user.resetPasswordExpire = undefined;
    user.resetPasswordToken = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorResponse("Email could not be sent", 500));
  }
  res.status(201).json({
    success: true,
    data: { user },
  });
});
/**
 * @desc    Register User
 * @route   POST /api/v1/auth/register
 * @access  Public
 */

export const verifyEmail = asyncHandler(async (req, res, next) => {
  const token = req.query.token;
  const user = await User.findOne({ emailToken: token });
  if (user) {
    user.emailToken = null;
    user.isVerified = true;
    await user.save();
    res.redirect("http://localhost:5173/login");
  } else {
    return next(new ErrorResponse("Canot find user", 404));
  }
});

/**
 * @desc    ResetPassword
 * @route   PUT /api/v1/auth/reset_password/:token
 * @access  Public
 */

export const resetPassword = asyncHandler(async (req, res) => {
  const resetToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    resetPasswordToken: resetToken,
    resetPasswordExpire: {
      $gt: Date.now(),
    },
  });
  if (!user) {
    return next(new ErrorResponse("Invalid token", 400));
  }
  user.password = req.body.password;
  user.resetPasswordExpire = undefined;
  user.resetPasswordToken = undefined;

  await user.save();
  sendTokenResponse(user, 200, res);
});

/**
 * @desc creates a jwt token using model methods
 */
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.addJsonWebToken();
  const options = {
    expires: Date.now() + process.env.JWt_COOKIE_EXPIRE * 24 * 60 * 60 * 1000,
    httpOnly: true,
  };
  // cookie is optional
  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({ success: true, token });

  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }
};
