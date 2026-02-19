import express from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import {
  getLectureProgress,
  saveLectureProgress,
} from "./lectureProgress.controller.js";
const router = express.Router();

router.post("/", authMiddleware, saveLectureProgress);
router.get("/:lectureId", authMiddleware, getLectureProgress);

export default router;
