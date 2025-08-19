import catchAsync from "@/shared/catch-async.js";
import sendResponse from "@/shared/send-response.js";
import httpStatus from "http-status";
import type { Request, Response } from "express";
import { UserService } from "./user.services.js";
import pick from "@/shared/pick.js";
import { paginationFields } from "@/constants/pagination.js";
import { userFilterableFields } from "./user.constants.js";

/**
 * Controller to get users with pagination and filtering
 */
const getUsers = catchAsync(async (req: Request, res: Response) => {
  const paginationOptions = pick(req.query, paginationFields);
  const filterOptions = pick(req.query, userFilterableFields);
  const response = await UserService.getUsers(paginationOptions, filterOptions);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Users retrieved successfully",
    data: response.data,
    meta: response.metaData,
  });
});

/**
 * Controller to get user details by id (admin only)
 */
const getUserById = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params["id"] as string;
  const user = await UserService.getUserById(userId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User details retrieved successfully",
    data: user,
  });
});

export const UserController = {
  getUsers,
  getUserById,
};
