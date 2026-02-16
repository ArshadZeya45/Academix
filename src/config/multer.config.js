import multer from "multer";

const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
  if (file.fieldname === "thumbnail") {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Thumbnail must me an image file"), false);
    }
  } else if (file.fieldname === "previewVideo") {
    if (file.mimetype.startsWith("video/")) {
      cb(null, true);
    } else {
      cb(new Error("preview must be video file"), false);
    }
  } else {
    cb(new Error("Invalid field name"), false);
  }
};
export const uploadCourseMedia = multer({
  storage,
  limits: {
    fileSize: 20 * 1024 * 1024,
  },
  fileFilter,
});
