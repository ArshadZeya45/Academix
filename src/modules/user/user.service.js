import { HTTP_STATUS } from "../../constants.js";
import { ApiError } from "../../utils/ApiError.js";
export const getUserService = async (req, res) => {
  const user = req.user;
  if (!user) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "User not found");
  }
  return user;
};
