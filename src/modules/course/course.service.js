import { HTTP_STATUS } from "../../constants.js";
import { ApiError } from "../../utils/ApiError.js";
import { uploadToCloud } from "../../utils/uploadToCloud.js";
import { courseModel } from "./course.model.js";
import { categoryModel } from "../category/category.model.js";
import { deleteFromCloudinary } from "../../utils/deleteFromCloudinary.js";

export const createCourseService = async (data, thumbnailFile, user) => {
  if (!thumbnailFile) {
    throw new ApiError(HTTP_STATUS.BAD_RESQUEST, "Thumbnail is required");
  }
  const categoryName = data.category.toLowerCase();
  let category = await categoryModel.findOne({ name: categoryName });
  if (!category) {
    category = await categoryModel.create({
      name: categoryName,
      courseCount: 0,
    });
  }

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
  await categoryModel.findByIdAndUpdate(category._id, {
    $inc: { courseCount: 1 },
  });
  return newCourse;
};
export const getCourseService = async (type, pageNumber, limitNumber) => {
  if (type === "latest") {
    const latestCourses = await courseModel
      .find({})
      .select(
        "title shortDescription price thumbnail categoryName createdAt level language",
      )
      .sort({ createdAt: -1 })
      .limit(8)
      .lean();

    return {
      totalCourses: latestCourses.length,
      courses: latestCourses,
    };
  }

  const totalCourses = await courseModel.countDocuments({});
  const courses = await courseModel
    .find({})
    .select(
      "title shortDescription price thumbnail categoryName createdAt level language",
    )
    .sort({ createdAt: -1 })
    .skip((pageNumber - 1) * limitNumber)
    .limit(limitNumber)
    .lean();
  return {
    totalCourses,
    currentPage: pageNumber,
    totalPages: Math.ceil(totalCourses / limitNumber),
    hasNextPage: pageNumber < Math.ceil(totalCourses / limitNumber),
    courses,
  };
};

export const getSearchCourseService = async (q) => {
  if (!q || !q.trim() || q.length < 2) {
    return [];
  }
  const LIMIT = 5;
  const searchValue = q.trim();
  const regex = new RegExp(`^${searchValue}`, "i");

  const titleMatches = await courseModel
    .find({ title: regex })
    .select("title thumbnail categoryName")
    .limit(LIMIT)
    .lean();
  if (titleMatches.length === LIMIT) {
    return titleMatches;
  }
  const categoryMatches = await courseModel
    .find({
      categoryName: regex,
      _id: { $nin: titleMatches.map((c) => c._id) },
    })
    .select("title thumbnail categoryName")
    .limit(LIMIT - titleMatches.length)
    .lean();
  if (titleMatches.length + categoryMatches.length === LIMIT) {
    return [...titleMatches, ...categoryMatches];
  }
  const descMatches = await courseModel
    .find({
      shortDescription: regex,
      _id: {
        $nin: [
          ...titleMatches.map((c) => c._id),
          ...categoryMatches.map((c) => c._id),
        ],
      },
    })
    .select("title thumbnail categoryName")
    .limit(LIMIT - titleMatches.length - categoryMatches.length)
    .lean();
  return [...titleMatches, ...categoryMatches, ...descMatches];
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
  const course = await courseModel.findById(id);
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
    const newCategoryName = data.category.trim().toLowerCase();

    let newCategory = await categoryModel.findOne({
      name: newCategoryName,
    });

    // 🔥 If not found, create
    if (!newCategory) {
      newCategory = await categoryModel.create({
        name: newCategoryName,
        courseCount: 0,
      });
    }

    // 🔥 If category changed
    if (course.category.toString() !== newCategory._id.toString()) {
      // decrease old category count
      await categoryModel.findByIdAndUpdate(course.category, {
        $inc: { courseCount: -1 },
      });

      // increase new category count
      await categoryModel.findByIdAndUpdate(newCategory._id, {
        $inc: { courseCount: 1 },
      });
    }

    updates.category = newCategory._id;
    updates.categoryName = newCategory.name;
    console.log("Incoming category:", data.category);
    console.log("Normalized:", newCategoryName);
    console.log("Found category:", newCategory);
  }

  const updatedCourse = await courseModel.findByIdAndUpdate(
    id,
    { $set: updates },
    {
      new: true,
      runValidators: true,
    },
  );

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
