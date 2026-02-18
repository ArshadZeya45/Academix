import express from "express";
import {
  createNewCategory,
  deleteCategoryById,
  getAllCategories,
  getCategoryById,
  updateCategoryById,
} from "./category.controller.js";
const router = express.Router();
router.get("/", getAllCategories);
router.post("/", createNewCategory);
router.get("/:categoryId", getCategoryById);
router.patch("/:categoryId", updateCategoryById);
router.delete("/:categoryId", deleteCategoryById);

export default router;
