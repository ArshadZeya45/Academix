import mongoose from "mongoose";
import { env } from "../config/env.js";

const connectToDb = async () => {
  try {
    await mongoose.connect(env.mongo_uri);
    console.log("Database connected sucessfully");
  } catch (error) {
    console.error("Database connection error", error.message);
    process.exit(1);
  }
};

export default connectToDb;
