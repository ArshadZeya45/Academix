import { env } from "../../config/env.js";
import { HTTP_STATUS } from "../../constants.js";
import { ApiError } from "../../utils/ApiError.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/generateToken.js";
import { hashPassword } from "../../utils/hash.js";
import { userModel } from "../user/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerService = async (data) => {
  const { firstname, lastname, email, password } = data;
  const existingUser = await userModel.findOne({ email });
  if (existingUser) {
    throw new ApiError(HTTP_STATUS.CONFLICT, "user already exists");
  }
  const hashedPassword = await hashPassword(password);
  const user = await userModel.create({
    _id: user._id,
    firstname,
    lastname,
    email,
    password: hashedPassword,
    role: "student",
  });
  const accessToken = await generateAccessToken(user._id, { role: user.role });
  const refreshToken = await generateRefreshToken(user._id, {
    role: user.role,
  });
  user.refreshToken = refreshToken;
  await user.save();
  return { user: { firstname, lastname, email }, accessToken, refreshToken };
};

export const loginService = async (data) => {
  const { email, password } = data;

  const user = await userModel
    .findOne({ email })
    .select("+password +refreshToken");
  if (!user) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Incorrect email or password");
  }
  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Incorrect email or password");
  }
  const accessToken = await generateAccessToken(user._id, user.role);
  const refreshToken = await generateRefreshToken(user._id, user.role);
  user.refreshToken = refreshToken;
  await user.save();
  return {
    user: {
      _id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
    },
    accessToken,
    refreshToken,
  };
};

export const logoutService = async (refreshToken) => {
  const user = await userModel
    .findOne({ refreshToken })
    .select("+refreshToken");
  if (!user) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Unauthorized");
  }
  user.refreshToken = null;
  await user.save();
};

export const refreshTokenService = async (refreshToken) => {
  if (!refreshToken) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "No refresh token");
  }
  const decoded = await jwt.verify(refreshToken, env.jwt_refresh_secret);
  const user = await userModel.findById(decoded.id).select("+refreshToken");
  if (!user || user.refreshToken !== refreshToken) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Invalid refresh token");
  }
  const newAccessToken = await generateAccessToken(user._id, user.role);
  const newRefreshToken = await generateRefreshToken(user._id, user.role);
  user.refreshToken = newRefreshToken;
  await user.save();
  return { newAccessToken, newRefreshToken };
};
