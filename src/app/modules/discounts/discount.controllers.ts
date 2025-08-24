import type { Request, Response } from "express";
import { DiscountService } from "./discount.services.js";
import type { IDiscount } from "./discount.interface.js";
import sendResponse from "@/shared/send-response.js";
import { paginationFields } from "@/constants/pagination.js";
import { discountFilterableFields } from "./discount.constants.js";
import pick from "@/shared/pick.js";

/**
 * Controller functions for Discount endpoints
 */
const createDiscount = async (req: Request, res: Response) => {
  const result = await DiscountService.createDiscount(req.body);
  sendResponse<IDiscount>(res, {
    statusCode: 201,
    success: true,
    message: "Discount created successfully",
    data: result,
  });
};

const getDiscounts = async (req: Request, res: Response) => {
  const paginationOptions = pick(req.query, paginationFields);
  const filterOptions = pick(req.query, discountFilterableFields);

  const response = await DiscountService.getDiscounts(
    paginationOptions,
    filterOptions
  );

  sendResponse<IDiscount[]>(res, {
    statusCode: 200,
    success: true,
    message: "Discounts fetched successfully",
    data: response.data,
    meta: response.metaData
  });
};

const getDiscountById = async (req: Request, res: Response) => {
  const discountId = req.params?.["id"] as string;
  const result = await DiscountService.getDiscountById(discountId);
  sendResponse<IDiscount | null>(res, {
    statusCode: 200,
    success: true,
    message: "Discount fetched successfully",
    data: result,
  });
};

const updateDiscount = async (req: Request, res: Response) => {
  const discountId = req.params?.["id"] as string;
  const result = await DiscountService.updateDiscount(discountId, req.body);
  sendResponse<IDiscount | null>(res, {
    statusCode: 200,
    success: true,
    message: "Discount updated successfully",
    data: result,
  });
};

const deleteDiscount = async (req: Request, res: Response) => {
  const discountId = req.params?.["id"] as string;
  const result = await DiscountService.deleteDiscount(discountId);
  sendResponse<IDiscount | null>(res, {
    statusCode: 200,
    success: true,
    message: "Discount deleted successfully",
    data: result,
  });
};

const applyDiscount = async (req: Request, res: Response) => {
  const userId = req?.user?.["id"];
  const { orderId, discountId } = req.body;
  const result = await DiscountService.applyDiscount(
    orderId,
    discountId,
    userId
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Discount applied successfully",
    data: result,
  });
};

const getAvailableDiscounts = async (req: Request, res: Response) => {
  const userId = req?.user?.["id"] as string;
  const result = await DiscountService.getAvailableDiscounts(userId);
  sendResponse<IDiscount[]>(res, {
    statusCode: 200,
    success: true,
    message: "Available discounts fetched successfully",
    data: result,
  });
};

export const DiscountController = {
  createDiscount,
  getDiscounts,
  getDiscountById,
  updateDiscount,
  deleteDiscount,
  applyDiscount,
  getAvailableDiscounts,
};
