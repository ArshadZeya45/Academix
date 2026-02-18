import { HTTP_STATUS } from "../../constants.js";
import { ApiError } from "../../utils/ApiError.js";
import { courseModel } from "../course/course.model.js";
import { lectureModel } from "./lecture.model.js";
import { uploadToCloud } from "../../utils/uploadToCloud.js";
import { generateVideoThumbnail } from "../../utils/generateVideoThumbnail.js";
import { deleteFromCloudinary } from "../../utils/deleteFromCloudinary.js";
export const createLectureService = async (
  data,
  videoLecture,
  lectureNotes,
  courseId,
) => {
  const course = await courseModel.findById(courseId);
  if (!course) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "Course not found");
  }
  if (!videoLecture) {
    throw new ApiError(HTTP_STATUS.BAD_RESQUEST, "Video lecture is required");
  }
  const videoLectureUpload = await uploadToCloud(
    videoLecture.buffer,
    "video-lectures",
    "video",
  );
  let lectureNotesUpload;
  if (lectureNotes) {
    lectureNotesUpload = await uploadToCloud(
      lectureNotes.buffer,
      "lecture-notes",
      "raw",
    );
  }
  const thumbnailUrl = await generateVideoThumbnail(
    videoLectureUpload.public_id,
  );
  const lecture = await lectureModel.create({
    topic: data.topic,
    videoLecture: {
      url: videoLectureUpload.secure_url,
      publicId: videoLectureUpload.public_id,
      duration: videoLectureUpload.duration,
    },
    notes: {
      url: lectureNotesUpload?.secure_url || "",
      publicId: lectureNotesUpload?.public_id || "",
    },
    lectureThumbnail: {
      url: thumbnailUrl,
    },
    course: courseId,
  });
  return lecture;
};
export const getCourseAllLecturesService = async (
  courseId,
  page = 1,
  limit = 5,
) => {
  const course = await courseModel.findById(courseId);
  if (!course) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "Course not found");
  }
  const pageNumber = parseInt(page) || 1;
  const limitNumber = parseInt(limit) || 5;
  const totalLectures = await lectureModel.countDocuments({ course: courseId });
  const lectures = await lectureModel
    .find({ course: courseId })
    .skip((pageNumber - 1) * limitNumber)
    .limit(limitNumber)
    .lean();
  return {
    totalLectures,
    currentPage: pageNumber,
    totalPages: Math.ceil(totalLectures / limitNumber),
    hasNextPage: pageNumber < Math.ceil(totalLectures / limitNumber),
    lectures,
  };
};

export const getCourseLectureByIdService = async (courseId, lectureId) => {
  const course = await courseModel.findById(courseId);
  if (!course) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "Course not found");
  }
  const lecture = await lectureModel
    .findOne({ _id: lectureId, course: courseId })
    .lean();
  if (!lecture) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "Lecture not found");
  }
  return lecture;
};
export const updateCourseLectureByIdService = async (
  courseId,
  lectureId,
  data,
  videoFile,
  notesFile,
) => {
  const course = await courseModel.findById(courseId);
  if (!course) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "Course not found");
  }

  const lecture = await lectureModel.findOne({
    _id: lectureId,
    course: courseId,
  });

  if (!lecture) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "Lecture not found");
  }

  const updates = { ...data };

  if (videoFile) {
    if (lecture.videoLecture?.publicId) {
      await deleteFromCloudinary(lecture.videoLecture.publicId, "video");
    }

    const result = await uploadToCloud(
      videoFile.buffer,
      "video-lectures",
      "video",
    );
    const thumbnailUrl = await generateVideoThumbnail(result.public_id);
    updates.lectureThumbnail = {
      url: thumbnailUrl,
    };
    updates.videoLecture = {
      url: result.secure_url,
      publicId: result.public_id,
      duration: result.duration,
    };
  }

  if (notesFile) {
    if (lecture.notes?.publicId) {
      await deleteFromCloudinary(lecture.notes.publicId, "raw");
    }

    const result = await uploadToCloud(
      notesFile.buffer,
      "lecture-notes",
      "raw",
    );

    updates.notes = {
      url: result.secure_url,
      publicId: result.public_id,
    };
  }

  const updatedLecture = await lectureModel.findOneAndUpdate(
    { _id: lectureId, course: courseId },
    { $set: updates },
    { returnDocument: "after", runValidators: true },
  );

  return updatedLecture;
};

export const deleteCourseLectureByIdService = async (courseId, lectureId) => {
  const course = await courseModel.findById(courseId);
  if (!course) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "Course not found");
  }
  const lecture = await lectureModel.findOne({
    _id: lectureId,
    course: courseId,
  });
  if (!lecture) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, "Lecture not found");
  }
  await deleteFromCloudinary(lecture.videoLecture.publicId, "video");
  await deleteFromCloudinary(lecture.notes.publicId, "raw");
  await lectureModel.deleteOne({ _id: lectureId });
};
