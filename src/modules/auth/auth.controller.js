import {
  completeRegistrationService,
  loginService,
  logoutService,
  refreshTokenService,
  requestEmailVerificationService,
} from "./auth.service.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { HTTP_STATUS } from "../../constants.js";
import { setAuthCookies } from "../../utils/setAuthCookies.js";
export const requestEmailVerification = async (req, res, next) => {
  try {
    const { email } = req.body;
    const { expiresAt, userEmail } =
      await requestEmailVerificationService(email);
    res.status(HTTP_STATUS.OK).json(
      new ApiResponse(
        HTTP_STATUS.OK,
        `Verification link successfully sent on ${userEmail}`,
        {
          expiresAt,
        },
      ),
    );
  } catch (error) {
    next(error);
  }
};
export const completeRegistration = async (req, res, next) => {
  try {
    const { token, firstname, lastname, password } = req.body;
    const { user, accessToken, refreshToken } =
      await completeRegistrationService(token, firstname, lastname, password);
    setAuthCookies(res, accessToken, refreshToken);
    return res.status(HTTP_STATUS.CREATED).json(
      new ApiResponse(HTTP_STATUS.OK, "Account created successfully", {
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        role: user.role,
        _id: user._id,
      }),
    );
  } catch (error) {
    next(error);
  }
};
export const loginUser = async (req, res, next) => {
  try {
    const { user, accessToken, refreshToken } = await loginService(req.body);
    setAuthCookies(res, accessToken, refreshToken);

    return res
      .status(HTTP_STATUS.OK)
      .json(new ApiResponse(HTTP_STATUS.OK, "User login successfully", user));
  } catch (error) {
    next(error);
  }
};

export const logoutUser = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    await logoutService(refreshToken);

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    return res
      .status(HTTP_STATUS.OK)
      .json(new ApiResponse(HTTP_STATUS.OK, "User logged out"));
  } catch (error) {
    next(error);
  }
};

export const refreshAccessToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    const { newAccessToken, newRefreshToken } =
      await refreshTokenService(refreshToken);
    setAuthCookies(res, newAccessToken, newRefreshToken);
    return res
      .status(HTTP_STATUS.OK)
      .json(new ApiResponse(HTTP_STATUS.OK, "Token refreshed"));
  } catch (error) {
    next(error);
  }
};
