import mongoose from "mongoose";

const emailVerificationSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    tokenHash: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      expires: 0,
    },
  },
  { timestamps: true },
);

export const emailVerificationModel = mongoose.model(
  "EmailVerification",
  emailVerificationSchema,
);
