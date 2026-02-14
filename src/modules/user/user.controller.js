import { HTTP_STATUS } from "../../constants.js";
import { getUserService } from "./user.service.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
export const getUser = async (req, res) => {
  try {
    const user = await getUserService(req, res);
    return res
      .status(HTTP_STATUS.OK)
      .json(new ApiResponse(HTTP_STATUS.OK, "User fetched successfully", user));
  } catch (error) {
    next(error);
  }
};
