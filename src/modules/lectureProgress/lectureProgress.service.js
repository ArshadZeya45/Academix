import { HTTP_STATUS } from "../../constants.js";
import { lectureModel } from "../lecture/lecture.model.js";
import { lectureProgressModel } from "./lectureProgress.model.js";

export const saveLectureProgressService = async (
  userId,
  lectureId,
  watchedSeconds,
) => {
  const lecture = await lectureModel.findById(lectureId);
  if (!lecture) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "lecture not found");
  }
  const isCompleted = watchedSeconds >= lecture.videoLecture.duration - 5;
  const updatedProgress = await lectureProgressModel.findOneAndUpdate(
    { user: userId, lecture: lectureId },
    { watchedSeconds, isCompleted },
    { upsert: true, new: true },
  );
  return updatedProgress;
};

export const getLectureProgressService = async (userId, lectureId) => {
  const progress = await lectureProgressModel.findOne({
    user: userId,
    lecture: lectureId,
  });
  return progress;
};
