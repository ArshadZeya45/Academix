import { HTTP_STATUS } from "../constants.js";
import { ApiError } from "../utils/ApiError.js";

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new ApiError(HTTP_STATUS.FORBIDDEN, "Access denied"));
    }
    next();
  };
};
