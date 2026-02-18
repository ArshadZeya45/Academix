import { categoryModel } from "./category.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { HTTP_STATUS } from "../../constants.js";
import { courseModel } from "../course/course.model.js";

export const createNewCategoryService = async (name) => {
  const isCategoryExist = await categoryModel.findOne({
    name: name.toLowerCase().trim(),
  });
  if (isCategoryExist) {
    throw new ApiError(HTTP_STATUS.CONFLICT, "Category already exists");
  }
  const newCategory = await categoryModel.create({
    name: name.toLowerCase(),
  });
  return newCategory;
};
export const getAllCategoriesService = async () => {
  const categories = await categoryModel.find();
  return categories;
};
export const getCategoryByIdService = async (categoryId) => {
  const category = await categoryModel.findById(categoryId);
  if (!category) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "Category not found");
  }
  return category;
};
export const updateCategoryByIdService = async (categoryId, name) => {
  const category = await categoryModel.findById(categoryId);
  if (!category) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "Category not found");
  }
  const isCategoryExist = await categoryModel.findOne({
    name: name.toLowerCase(),
  });
  if (isCategoryExist) {
    throw new ApiError(HTTP_STATUS.CONFLICT, "Category already exist");
  }
  category.name = name.toLowerCase();
  await category.save();
  return category;
};

export const deleteCategoryByIdService = async (categoryId) => {
  const category = await categoryModel.findById(categoryId);
  if (!category) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "category not found");
  }

  if (category.courseCount !== Number(0)) {
    throw new ApiError(
      HTTP_STATUS.BAD_RESQUEST,
      `${category.courseCount} course exist in this category , you can not delete directly`,
    );
  }
  await categoryModel.deleteOne({ _id: categoryId });
};
