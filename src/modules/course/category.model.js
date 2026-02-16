import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    courseCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

export const categoryModel = mongoose.model("Category", categorySchema);
