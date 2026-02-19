import { HTTP_STATUS } from "../../constants.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import {
  createCourseService,
  deleteCourseByIdService,
  getCourseByIdService,
  getCourseService,
  getSearchCourseService,
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
    const allowedParams = ["type", "page", "limit", "latest"];
    const incomingParams = Object.keys(req.query);

    for (let key of incomingParams) {
      if (!allowedParams.includes(key)) {
        return res.status(400).json({
          success: false,
          message: `Invalid query parameter: ${key}`,
        });
      }
    }

    const allowedTypes = ["all", "latest"];
    const type = req.query.type?.trim() || "all";

    if (!allowedTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid type value",
      });
    }

    const pageNumber = parseInt(req.query.page) || 1;
    const limitNumber = Math.min(parseInt(req.query.limit) || 8, 20);

    const data = await getCourseService(type, pageNumber, limitNumber);

    return res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(HTTP_STATUS.OK, "Course Fetched Successfully", data),
      );
  } catch (error) {
    next(error);
  }
};

export const getSearchCourse = async (req, res, next) => {
  try {
    const { q = "" } = req.query;
    const results = await getSearchCourseService(q);
    return res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(HTTP_STATUS.OK, "Course fetched successfully", results),
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
