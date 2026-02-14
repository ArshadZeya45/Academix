import { HTTP_STATUS } from "../constants.js";
import { ApiError } from "../utils/ApiError.js";

export const adminMiddleware = async (req, res, next) => {
  try {
    const user = req.user;
    if (user.role !== "admin") {
      return new ApiError(
        HTTP_STATUS.UNAUTHORIZED,
        "You can not access this content",
      );
    }
    next();
  } catch (error) {
    next(error);
  }
};
