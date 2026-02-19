import express from "express";
import authRoutes from "../src/modules/auth/auth.routes.js";
import userRoutes from "../src/modules/user/user.routes.js";
import courseRoutes from "../src/modules/course/course.routes.js";
import categoryRoutes from "../src/modules/category/category.routes.js";
const router = express.Router();
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/courses", courseRoutes);
router.use("/categories", categoryRoutes);

export default router;
