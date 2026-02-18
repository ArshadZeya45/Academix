import {
  createNewCategoryService,
  deleteCategoryByIdService,
  getAllCategoriesService,
  getCategoryByIdService,
  updateCategoryByIdService,
} from "./category.service.js";
import { HTTP_STATUS } from "../../constants.js";
import { ApiResponse } from "../../utils/ApiResponse.js";

export const createNewCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    const newCategory = await createNewCategoryService(name);
    return res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(
          HTTP_STATUS.OK,
          "New category created successfully",
          newCategory,
        ),
      );
  } catch (error) {
    next(error);
  }
};

export const getAllCategories = async (req, res, next) => {
  try {
    const categories = await getAllCategoriesService();
    return res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(
          HTTP_STATUS.OK,
          "All category fetched successfully",
          categories,
        ),
      );
  } catch (error) {
    next(error);
  }
};

export const getCategoryById = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const category = await getCategoryByIdService(categoryId);
    return res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(
          HTTP_STATUS.OK,
          "category fetched successfully",
          category,
        ),
      );
  } catch (error) {
    next(error);
  }
};

export const updateCategoryById = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const { name } = req.body;
    const category = await updateCategoryByIdService(categoryId, name);
    return res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(
          HTTP_STATUS.OK,
          "category updated successfully",
          category,
        ),
      );
  } catch (error) {
    next(error);
  }
};

export const deleteCategoryById = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    await deleteCategoryByIdService(categoryId);
    return res
      .status(HTTP_STATUS.OK)
      .json(new ApiResponse(HTTP_STATUS.OK, "Category deleted successfully"));
  } catch (error) {
    next(error);
  }
};
