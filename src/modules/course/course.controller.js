import { HTTP_STATUS } from "../../constants.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import {
  createCourseService,
  deleteCourseByIdService,
  getCourseByIdService,
  getCourseService,
  updateCourseByIdService,
} from "./course.service.js";

export const createCourse = async (req, res, next) => {
  try {
    const data = req.body;
    const thumbnailFile = req.file;
    const user = req.user;
    const newCourse = await createCourseService(data, thumbnailFile, user);

    return res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(
          HTTP_STATUS.OK,
          "Course created successfully",
          newCourse,
        ),
      );
  } catch (error) {
    next(error);
  }
};

export const getCourse = async (req, res, next) => {
  try {
    const {
      search = "",
      category,
      sort = "latest",
      page = 1,
      limit = 8,
    } = req.query;

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    const data = await getCourseService(
      search,
      category,
      sort,
      pageNumber,
      limitNumber,
    );
    return res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(HTTP_STATUS.OK, "Course fetched successfully", data),
      );
  } catch (error) {
    next(error);
  }
};

export const getCourseById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const course = await getCourseByIdService(id);
    return res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(HTTP_STATUS.OK, "course fetched successfully", course),
      );
  } catch (error) {
    next(error);
  }
};
export const updateCourseById = async (req, res, next) => {
  try {
    const data = req.body;
    const { id } = req.params;
    const thumbnailFile = req.files.thumbnail?.[0];
    const previewVideoFile = req.files.previewVideo?.[0];

    const updatedCourse = await updateCourseByIdService(
      id,
      data,
      thumbnailFile,
      previewVideoFile,
    );
    return res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(
          HTTP_STATUS.OK,
          "Course updated sucessfully",
          updatedCourse,
        ),
      );
  } catch (error) {
    next(error);
  }
};

export const deleteCourseById = async (req, res, next) => {
  try {
    const { id } = req.params;
    await deleteCourseByIdService(id);
    return res
      .status(HTTP_STATUS.OK)
      .json(new ApiResponse(HTTP_STATUS.OK, "course deleted successfully"));
  } catch (error) {
    next(error);
  }
};
