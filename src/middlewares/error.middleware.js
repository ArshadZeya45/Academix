import { HTTP_STATUS } from "../constants.js";
import { ZodError } from "zod";

export const errorHandler = (err, req, res, next) => {
  if (err instanceof ZodError) {
    return res.status(HTTP_STATUS.BAD_RESQUEST).json({
      success: false,
      statusCode: HTTP_STATUS.BAD_RESQUEST,
      message: "Validation error",
      errors: err.issues.map((e) => ({
        field: e.path[0],
        message: e.message,
      })),
    });
  }
  const statusCode = err.statusCode || 500;
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message: err.message || "Internal server error",
  });
};
