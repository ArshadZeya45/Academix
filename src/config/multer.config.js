import multer from "multer";

const storage = multer.memoryStorage();

const courseFileFilter = (req, file, cb) => {
  if (file.fieldname === "thumbnail") {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Thumbnail must be an image file"), false);
    }
    return cb(null, true);
  }

  if (file.fieldname === "previewVideo") {
    if (!file.mimetype.startsWith("video/")) {
      return cb(new Error("Preview video must be a video file"), false);
    }
    return cb(null, true);
  }

  return cb(new Error("Invalid field name for course media"), false);
};

export const uploadCourseMedia = multer({
  storage,
  limits: {
    fileSize: 200 * 1024 * 1024,
  },
  fileFilter: courseFileFilter,
});

const lectureFileFilter = (req, file, cb) => {
  // 🎥 Lecture Video
  if (file.fieldname === "videoLecture") {
    if (!file.mimetype.startsWith("video/")) {
      return cb(new Error("Lecture video must be a video file"), false);
    }
    return cb(null, true);
  }

  if (file.fieldname === "lectureNotes") {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Lecture notes must be a PDF file"), false);
    }
    return cb(null, true);
  }

  return cb(new Error("Invalid field name for lecture media"), false);
};

export const uploadLectureMedia = multer({
  storage,
  limits: {
    fileSize: 500 * 1024 * 1024,
  },
  fileFilter: lectureFileFilter,
});
