import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
export const generateAccessToken = async (id, role) => {
  const token = await jwt.sign({ id, role }, env.jwt_access_secret, {
    expiresIn: env.accessTokenExpiresIn,
  });
  return token;
};

export const generateRefreshToken = async (id, role) => {
  const token = await jwt.sign({ id, role }, env.jwt_refresh_secret, {
    expiresIn: env.refreshTokenExpiresIn,
  });
  return token;
};
