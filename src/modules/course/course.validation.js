import { z } from "zod";

export const createCourseSchema = z.object({
  title: z.string().trim().min(2, "Title must be at least 2 characters"),

  shortDescription: z
    .string()
    .trim()
    .min(10, "Short description must be at least 10 characters"),

  price: z.coerce.number().min(0, "Price must be positive").default(0),

  category: z.string().trim().min(2, "Category must be at least 2 characters"),
});

export const updateCourseSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Title must be at least 2 characters")
    .optional(),

  shortDescription: z
    .string()
    .trim()
    .min(10, "Short description must be at least 10 characters")
    .optional(),

  description: z
    .string()
    .trim()
    .min(30, "Description must be at least 30 characters")
    .optional(),

  price: z.coerce.number().min(0, "Price must be positive").optional(),

  discountPrice: z.coerce
    .number()
    .min(0, "Discount price must be positive")
    .optional(),

  category: z
    .string()
    .trim()
    .min(2, "Category must be at least 2 characters")
    .optional(),

  tags: z.array(z.string().trim()).optional(),

  courseDuration: z.coerce.number().min(0).optional(),

  isPublished: z.coerce.boolean().optional(),

  level: z.enum(["beginner", "intermediate", "advanced"]).optional(),

  courseLanguage: z.enum(["English", "Hinglish"]).optional(),
});
