import { Category } from "./category.model.js";
import ApiError from "@/errors/ApiError.js";
import httpStatus from "http-status";
import type { ICategory } from "./category.interface.js";

const getCategories = async () => {
  return Category.find();
};

const createCategory = async (categoryData: ICategory) => {
  const category = await Category.create(categoryData);
  return category;
};

const updateCategory = async (
  categoryId: string,
  updateData: Partial<ICategory>
) => {
  // check if the category exists
  const existingCategory = await Category.findById(categoryId);
  if (!existingCategory) {
    throw new Error("Category not found");
  }

  const category = await Category.findOneAndUpdate(
    { _id: categoryId },
    updateData,
    { new: true }
  );

  return category;
};

const deleteCategory = async (categoryId: string) => {
  // check if the category exists
  const existingCategory = await Category.findById(categoryId);
  if (!existingCategory) {
    throw new Error("Category not found");
  }

  const category = await Category.findByIdAndDelete(categoryId);
  if (!category) {
    throw new Error("Category not found");
  }
  return null;
};

const getCategoryDetailsBySlug = async (slug: string) => {
  const category = await Category.findOne({ slug });
  if (!category) throw new ApiError(httpStatus.NOT_FOUND, "Category not found");
  return category;
};

export const CategoryService = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryDetailsBySlug,
};
