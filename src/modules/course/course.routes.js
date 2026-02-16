import express from "express";
import {
  createCourse,
  deleteCourseById,
  getCourse,
  getCourseById,
  updateCourseById,
} from "./course.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { authorizeRoles } from "../../middlewares/role.middleware.js";
import { uploadCourseMedia } from "../../config/multer.config.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { createCourseSchema, updateCourseSchema } from "./course.validation.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  authorizeRoles("admin"),
  uploadCourseMedia.single("thumbnail"),
  validate(createCourseSchema),
  createCourse,
);
router.get("/", getCourse);
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

export default router;
