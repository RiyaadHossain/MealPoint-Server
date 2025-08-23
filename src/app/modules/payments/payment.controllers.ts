import { paginationFields } from "@/constants/pagination.js";
import catchAsync from "@/shared/catch-async.js";
import pick from "@/shared/pick.js";
import sendResponse from "@/shared/send-response.js";
import type { Request, Response } from "express";
import httpStatus from "http-status";
import { PaymentService } from "./payment.services.js";
import { paymentFilterableFields } from "./payment.constants.js";

const createPayment = catchAsync(async (req: Request, res: Response) => {
    const userId = req?.user?.['id'] as string
  const result = await PaymentService.createPayment(userId, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Payment created successfully",
    data: result,
  });
});

const getPaymentById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params?.["id"] as string;
  const result = await PaymentService.getPaymentById(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Payment retrieved successfully",
    data: result,
  });
});

const updatePaymentStatus = catchAsync(async (req: Request, res: Response) => {
  const id = req.params?.["id"] as string;
  const result = await PaymentService.updatePaymentStatus(id, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Payment status updated successfully",
    data: result,
  });
});

const getAllPayments = catchAsync(async (req: Request, res: Response) => {
  const paginationOptions = pick(req.query, paginationFields);
  const filterOptions = pick(req.query, paymentFilterableFields);

  const result = await PaymentService.getAllPayments(
    paginationOptions,
    filterOptions
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Payments retrieved successfully",
    data: result.data,
    meta: result.metaData,
  });
});

const getUserPaymentHistory = catchAsync(
  async (req: Request, res: Response) => {
    const paginationOptions = pick(req.query, paginationFields);
    const userId = req.user?.["id"] as string;
    const result = await PaymentService.getUserPaymentHistory(
      userId,
      paginationOptions
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Payment history retrieved successfully",
      data: result.data,
      meta: result.metaData,
    });
  }
);

export const PaymentController = {
  createPayment,
  getAllPayments,
  getPaymentById,
  getUserPaymentHistory,
  updatePaymentStatus,
};
