import bcrypt from "bcryptjs";
import { env } from "../config/env.js";
export const hashPassword = async (password) => {
  return await bcrypt.hash(password, env.bcryptSalt);
};
