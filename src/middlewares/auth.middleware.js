import { env } from "../config/env.js";
import { HTTP_STATUS } from "../constants.js";
import { userModel } from "../modules/user/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";

export const authMiddleware = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Access token missing");
    }
    const decoded = jwt.verify(accessToken, env.jwt_access_secret);
    const user = await userModel.findById(decoded.id);
    if (!user) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "User not found");
    }
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: "Access token expired",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: "Invalid access token",
      });
    }
    next(error);
  }
};
