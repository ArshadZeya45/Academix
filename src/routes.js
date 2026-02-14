import express from "express";
import authRoutes from "../src/modules/auth/auth.routes.js";
import userRoutes from "../src/modules/user/user.routes.js";
const router = express.Router();
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
export default router;
