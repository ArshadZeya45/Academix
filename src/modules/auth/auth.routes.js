import express from "express";
import {
  completeRegistration,
  loginUser,
  logoutUser,
  refreshAccessToken,
  requestEmailVerification,
} from "./auth.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { loginSchema } from "./auth.validation.js";
const router = express.Router();
router.post("/signup", requestEmailVerification);
router.post("/complete-signup", completeRegistration);
router.post("/login", validate(loginSchema), loginUser);
router.post("/logout", logoutUser);
router.post("/refresh", refreshAccessToken);
export default router;
