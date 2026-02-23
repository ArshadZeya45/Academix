import { env } from "../../config/env.js";
import { HTTP_STATUS } from "../../constants.js";
import { ApiError } from "../../utils/ApiError.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/generateToken.js";
import { hashPassword } from "../../utils/hash.js";
import { userModel } from "../user/user.model.js";
import { emailVerificationModel } from "./emailVerification.model.js";
import { sendVerificationEmail } from "../../utils/sendEmail.js";
import { generateVerificationToken } from "./generateVerificationToken.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

export const requestEmailVerificationService = async (email) => {
  const existingUser = await userModel.findOne({ email });

  if (existingUser) {
    throw new ApiError(HTTP_STATUS.CONFLICT, "Email already registered");
  }

  const existingVerification = await emailVerificationModel.findOne({ email });

  if (existingVerification) {
    const now = new Date();

    if (existingVerification.expiresAt > now) {
      throw new ApiError(
        HTTP_STATUS.TOO_MANY_REQUESTS,
        "Please wait before requesting another verification email",
      );
    }
  }

  const { rawToken, tokenHash } = await generateVerificationToken();

  const expiresAt = new Date(Date.now() + 3 * 60 * 1000);

  const emailVerification = await emailVerificationModel.findOneAndUpdate(
    { email },
    { tokenHash, expiresAt },
    { upsert: true, new: true },
  );

  await sendVerificationEmail(email, rawToken);

  return { expiresAt, userEmail: emailVerification.email };
};

export const completeRegistrationService = async (
  token,
  firstname,
  lastname,
  password,
) => {
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const verification = await emailVerificationModel.findOne({ tokenHash });
  if (!verification) {
    throw new ApiError(
      HTTP_STATUS.BAD_RESQUEST,
      "Invalid or expired verification link",
    );
  }
  if (verification.expiresAt < new Date()) {
    throw new ApiError(HTTP_STATUS.BAD_RESQUEST, "Verification link expired");
  }
  const existingUser = await userModel.findOne({
    email: verification.email,
  });
  if (existingUser) {
    await emailVerificationModel.deleteOne({
      _id: verification._id,
    });

    throw new ApiError(HTTP_STATUS.CONFLICT, "Account already exists");
  }
  const hashedPassword = await hashPassword(password);
  const user = await userModel.create({
    email: verification.email,
    firstname,
    lastname,
    password: hashedPassword,
    role: "student",
  });
  await emailVerificationModel.deleteOne({ _id: verification._id });
  const accessToken = await generateAccessToken(user._id, user.role);
  const refreshToken = await generateRefreshToken(user._id, user.role);
  user.refreshToken = refreshToken;
  await user.save();
  return { user, accessToken, refreshToken };
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
      role: user.role,
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
