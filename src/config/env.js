import dotenv from "dotenv";
dotenv.config();

export const env = {
  port: process.env.PORT,
  mongo_uri: process.env.MONGO_URI,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
  refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
  accessCookieMaxAge: Number(process.env.ACCESS_COOKIE_MAX_AGE),
  refreshCookieMaxAge: Number(process.env.REFRESH_COOKIE_MAX_AGE),
  bcryptSalt: Number(process.env.BCRYPT_SALT),
  cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD,
  cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
  cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
  emailUser: process.env.EMAIL_USER,
  emailPass: process.env.EMAIL_PASS,
  frontendUrl: process.env.FRONTEND_URL,
};
