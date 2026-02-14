import express from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { getUser } from "./user.controller.js";

const router = express.Router();
router.get("/me", authMiddleware, getUser);

export default router;
