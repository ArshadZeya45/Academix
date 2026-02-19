import mongoose from "mongoose";

const lectureProgressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    lecture: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lecture",
      required: true,
    },
    watchedSeconds: {
      type: Number,
      default: 0,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

lectureProgressSchema.index({ user: 1, lecture: 1 }, { unique: true });
export const lectureProgressModel = mongoose.model(
  "LectureProgress",
  lectureProgressSchema,
);
