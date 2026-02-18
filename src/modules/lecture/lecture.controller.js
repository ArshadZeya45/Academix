import { HTTP_STATUS } from "../../constants.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import {
  createLectureService,
  deleteCourseLectureByIdService,
  getCourseAllLecturesService,
  getCourseLectureByIdService,
  updateCourseLectureByIdService,
} from "./lecture.service.js";

export const createLecture = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const videoLecture = req.files.videoLecture?.[0];
    const lectureNotes = req.files.lectureNotes?.[0];
    const data = req.body;
    const lecture = await createLectureService(
      data,
      videoLecture,
      lectureNotes,
      courseId,
    );
    return res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(
          HTTP_STATUS.OK,
          "Lecture created successfully",
          lecture,
        ),
      );
  } catch (error) {
    next(error);
  }
};

export const getCourseAllLectures = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const { page = 1, limit = 5 } = req.query;
    const data = await getCourseAllLecturesService(courseId, page, limit);
    return res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(HTTP_STATUS.OK, "lectures fetched successfully", data),
      );
  } catch (error) {
    next(error);
  }
};

export const getCourseLectureById = async (req, res, next) => {
  try {
    const { courseId, lectureId } = req.params;
    const lecture = await getCourseLectureByIdService(courseId, lectureId);
    return res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(
          HTTP_STATUS.OK,
          "lecture fetched successfully",
          lecture,
        ),
      );
  } catch (error) {
    next(error);
  }
};

export const updateCourseLectureById = async (req, res, next) => {
  try {
    const { courseId, lectureId } = req.params;
    const data = req.body;
    const videoFile = req.files.videoLecture?.[0];
    const notesFile = req.files.lectureNotes?.[0];
    const updatedLecture = await updateCourseLectureByIdService(
      courseId,
      lectureId,
      data,
      videoFile,
      notesFile,
    );
    return res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(
          HTTP_STATUS.OK,
          "Lecture updated successfully",
          updatedLecture,
        ),
      );
  } catch (error) {
    next(error);
  }
};

export const deleteCourseLectureById = async (req, res, next) => {
  try {
    const { courseId, lectureId } = req.params;
    await deleteCourseLectureByIdService(courseId, lectureId);
    return res
      .status(HTTP_STATUS.OK)
      .json(new ApiResponse(HTTP_STATUS.OK, "lecture deleted successfully"));
  } catch (error) {
    next(error);
  }
};
