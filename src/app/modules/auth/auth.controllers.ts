import catchAsync from "@/shared/catch-async.js";
import sendResponse from "@/shared/send-response.js";
import httpStatus from "http-status";
import { AuthService } from "./auth.services.js";

const register = catchAsync(async (req, res) => {
  const userData = req.body;
  const user = await AuthService.register(userData);

  const responseData = {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "User registered successfully",
    data: user,
  };

  sendResponse(res, responseData);
});

const login = catchAsync(async (req, res) => {
  const userData = req.body;
  const user = await AuthService.login(userData);

  const responseData = {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "User logged in successfully",
    data: user,
  };

  sendResponse(res, responseData);
});

export const AuthController = {
  register,
  login,
};
