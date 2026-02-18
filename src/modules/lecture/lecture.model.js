import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema(
  {
    topic: {
      type: String,
      required: true,
      trim: true,
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    videoLecture: {
      url: {
        type: String,
        required: true,
      },
      publicId: {
        type: String,
        required: true,
      },
      duration: {
        type: Number,
        default: 0,
      },
    },
    lectureThumbnail: {
      url: {
        type: String,
        required: true,
      },
    },
    notes: {
      url: String,
      publicId: String,
    },
  },
  { timestamps: true },
);

export const lectureModel = mongoose.model("Lecture", lectureSchema);
