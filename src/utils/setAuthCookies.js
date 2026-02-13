import { env } from "../config/env.js";

export const setAuthCookies = (res, accessToken, refreshToken) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    sameSite: "strict",
    maxAge: env.accessCookieMaxAge * 60 * 1000,
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "strict",
    maxAge: env.refreshCookieMaxAge * 24 * 60 * 60 * 1000,
  });
};
