import { HTTP_STATUS } from "../../constants.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import {
  getLectureProgressService,
  saveLectureProgressService,
} from "./lectureProgress.service.js";

export const saveLectureProgress = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { lectureId, watchedSeconds } = req.body;
    const updatedProgress = await saveLectureProgressService(
      userId,
      lectureId,
      watchedSeconds,
    );
    return res
      .status(HTTP_STATUS.OK)
      .json(new ApiResponse(HTTP_STATUS.OK, "progress saved", updatedProgress));
  } catch (error) {
    next(error);
  }
};

export const getLectureProgress = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { lectureId } = req.params;
    const progress = await getLectureProgressService(userId, lectureId);
    return res.status(HTTP_STATUS.OK).json(
      new ApiResponse(HTTP_STATUS.OK, "video progress get successfully", {
        watchedSeconds: progress?.watchedSeconds || 0,
      }),
    );
  } catch (error) {
    next(error);
  }
};
