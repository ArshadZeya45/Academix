import { HTTP_STATUS } from "../../constants.js";
import { ApiError } from "../../utils/ApiError.js";
import { uploadToCloud } from "../../utils/uploadToCloud.js";
import { courseModel } from "./course.model.js";
import { categoryModel } from "./category.model.js";
import { deleteFromCloudinary } from "../../utils/deleteFromCloudinary.js";

export const createCourseService = async (data, thumbnailFile, user) => {
  if (!thumbnailFile) {
    throw new ApiError(HTTP_STATUS.BAD_RESQUEST, "Thumbnail is required");
  }
  let category = await categoryModel.findOne({ name: data.category });
  if (!category) {
    category = await categoryModel.create({
      name: data.category,
    });
  }
  data.categoryName = category.name;

  const thumbnailUpload = await uploadToCloud(
    thumbnailFile.buffer,
    "course-thumbnails",
    "image",
  );
  const newCourse = await courseModel.create({
    title: data.title,
    shortDescription: data.shortDescription,
    price: data.price,
    category: category._id,
    categoryName: category.name,
    thumbnail: {
      url: thumbnailUpload.secure_url,
      public_id: thumbnailUpload.public_id,
    },

    instructor: user._id,
  });
  category.courseCount += 1;
  await category.save();
  return newCourse;
};
export const getCourseService = async (
  search,
  category,
  sort,
  pageNumber,
  limitNumber,
) => {
  let query = {};

  if (search.trim()) {
    query.$text = { $search: search };
  }

  if (category) {
    const categoriesArray = category
      .split(",")
      .map((cat) => cat.trim().toLowerCase());

    query.categoryName = { $in: categoriesArray };
  }

  let sortOption = {};

  if (search.trim()) {
    sortOption = { score: { $meta: "textScore" } };
  } else if (sort === "latest") {
    sortOption = { createdAt: -1 };
  }

  const totalCourses = await courseModel.countDocuments(query);

  const courses = await courseModel
    .find(query, search ? { score: { $meta: "textScore" } } : {})
    .select("title shortDescription thumbnail categoryName createdAt price")
    .sort(sortOption)
    .skip((pageNumber - 1) * limitNumber)
    .limit(limitNumber)
    .lean();

  const data = {
    totalCourses,
    currentPage: pageNumber,
    totalPages: Math.ceil(totalCourses / limitNumber),
    hasNextPage: pageNumber < Math.ceil(totalCourses / limitNumber),
    courses,
  };
  return data;
};

export const getCourseByIdService = async (id) => {
  const course = await courseModel.findById(id);
  if (!course) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "Course not found");
  }
  return course;
};
export const updateCourseByIdService = async (
  id,
  data,
  thumbnailFile,
  previewVideoFile,
) => {
  const course = await courseModel.findById(id).populate("category");
  if (!course) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "Course not found");
  }
  const updates = { ...data };
  if (thumbnailFile) {
    if (course.thumbnail?.public_id) {
      await deleteFromCloudinary(course.thumbnail.public_id, "image");
    }
    const thumbnailUpload = await uploadToCloud(
      thumbnailFile.buffer,
      "course-thumbnails",
      "image",
    );
    updates.thumbnail = {
      url: thumbnailUpload.secure_url,
      public_id: thumbnailUpload.public_id,
    };
  }

  if (previewVideoFile) {
    if (course.previewVideo?.public_id) {
      await deleteFromCloudinary(course.previewVideo.public_id, "video");
    }
    const previewVideoUpload = await uploadToCloud(
      previewVideoFile.buffer,
      "course-preview-video",
      "video",
    );
    updates.previewVideo = {
      url: previewVideoUpload.secure_url,
      public_id: previewVideoUpload.public_id,
      duration: previewVideoUpload.duration,
    };
  }
  if (data.category) {
    let category = await categoryModel.findOne({ name: data.category });
    if (!category) {
      category = await categoryModel.create({
        name: data.category,
      });
      course.categoryName = data.category;
      category.courseCount += 1;
    }

    await category.save();
  }

  const updatedCourse = await courseModel.findByIdAndUpdate(id, {
    returnDocument: "after",
    runValidators: true,
  });

  return updatedCourse;
};

export const deleteCourseByIdService = async (id) => {
  const course = await courseModel.findById(id);
  if (!course) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "course not found");
  }
  if (course.thumbnail?.public_id) {
    const thumbnailResult = await deleteFromCloudinary(
      course.thumbnail.public_id,
      "image",
    );
  }
  if (course.previewVideo?.public_id) {
    const previewVideoResult = await deleteFromCloudinary(
      course.previewVideo.public_id,
      "video",
    );
  }
  const category = await categoryModel.findById(course.category);
  category.courseCount -= 1;
  await category.save();

  await courseModel.findByIdAndDelete(id);
};
