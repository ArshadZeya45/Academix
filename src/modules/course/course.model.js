import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    shortDescription: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      default: 0,
    },
    discountPrice: {
      type: Number,
      validate: {
        validator: function (value) {
          return value < this.price;
        },
        message: "Discount price must be less than actual price",
      },
    },
    isFree: {
      type: Boolean,
      default: function () {
        return this.price === 0;
      },
    },
    thumbnail: {
      url: {
        type: String,
        required: true,
      },
      public_id: {
        type: String,
        required: true,
      },
    },

    previewVideo: {
      url: String,
      public_id: String,
      duration: Number,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    categoryName: {
      type: String,
    },
    tags: [
      {
        type: String,
      },
    ],
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    totalLectures: {
      type: Number,
      default: 0,
    },
    courseDuration: {
      type: Number,
      default: 0,
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    totalRatings: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
    },
    courseLanguage: {
      type: String,
      enum: ["English", "Hinglish"],
      default: "Hinglish",
    },
    enrolledStudents: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

courseSchema.index({ title: 1 });
courseSchema.index({ categoryName: 1 });
courseSchema.index({ shortDescription: 1 });

export const courseModel = mongoose.model("Course", courseSchema);
