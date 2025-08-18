import catchAsync from "@/shared/catch-async.js";
import sendResponse from "@/shared/send-response.js";
import httpStatus from "http-status";
import { CategoryService } from "./category.services.js";

const getCategories = catchAsync(async (_req, res) => {
  const categories = await CategoryService.getCategories();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Categories retrieved successfully",
    data: categories,
  });
});

const createCategory = catchAsync(async (req, res) => {
  const categoryData = req.body;
  const category = await CategoryService.createCategory(categoryData);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Category created successfully",
    data: category,
  });
});

const updateCategory = catchAsync(async (req, res) => {
  const categoryId = req.params["id"] as string;
  const updateData = req.body;
  const category = await CategoryService.updateCategory(categoryId, updateData);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Category updated successfully",
    data: category,
  });
});

const deleteCategory = catchAsync(async (req, res) => {
  const categoryId = req.params["id"] as string;
  await CategoryService.deleteCategory(categoryId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Category deleted successfully",
    data: null,
  });
});

export const CategoryController = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
