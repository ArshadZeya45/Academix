import express from "express";
import {
  createCourse,
  deleteCourseById,
  getCourse,
  getCourseById,
  getSearchCourse,
  updateCourseById,
} from "./course.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { authorizeRoles } from "../../middlewares/role.middleware.js";
import {
  uploadCourseMedia,
  uploadLectureMedia,
} from "../../config/multer.config.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { createCourseSchema, updateCourseSchema } from "./course.validation.js";
import {
  createLecture,
  deleteCourseLectureById,
  getCourseAllLectures,
  getCourseLectureById,
  updateCourseLectureById,
} from "../lecture/lecture.controller.js";

const router = express.Router();

// course routes

router.post(
  "/",
  authMiddleware,
  authorizeRoles("admin"),
  uploadCourseMedia.single("thumbnail"),
  validate(createCourseSchema),
  createCourse,
);
router.get("/", getCourse);
router.get("/suggestions", getSearchCourse);
router.get("/:id", getCourseById);
router.patch(
  "/:id",
  authMiddleware,
  uploadCourseMedia.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "previewVideo", maxCount: 1 },
  ]),
  validate(updateCourseSchema),
  updateCourseById,
);
router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("admin"),
  deleteCourseById,
);

//lecture nested routes
router.post(
  "/:courseId/lectures",
  uploadLectureMedia.fields([
    { name: "videoLecture", maxCount: 1 },
    { name: "lectureNotes", maxCount: 1 },
  ]),
  createLecture,
);
router.get("/:courseId/lectures", getCourseAllLectures);
router.get("/:courseId/lectures/:lectureId", getCourseLectureById);
router.patch(
  "/:courseId/lectures/:lectureId",
  uploadLectureMedia.fields([
    { name: "videoLecture", maxCount: 1 },
    { name: "lectureNotes", maxCount: 1 },
  ]),
  updateCourseLectureById,
);
router.delete("/:courseId/lectures/:lectureId", deleteCourseLectureById);
export default router;
