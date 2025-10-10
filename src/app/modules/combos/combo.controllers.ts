import type { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "@/shared/catch-async.js";
import sendResponse from "@/shared/send-response.js";
import { ComboService } from "./combo.services.js";
import pick from "@/shared/pick.js";
import { comboFilterableFields } from "./combo.constants.js";
import { paginationFields } from "@/constants/pagination.js";

const createCombo = catchAsync(async (req: Request, res: Response) => {
  const combo = await ComboService.createCombo(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Combo created successfully",
    data: combo,
  });
});

const getCombos = catchAsync(async (req: Request, res: Response) => {
  const filtersOptions = pick(req.query, comboFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);
  const response = await ComboService.getCombos(
    paginationOptions,
    filtersOptions
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Combos retrieved successfully",
    data: response.data,
    meta: response.metaData,
  });
});

const getComboById = catchAsync(async (req: Request, res: Response) => {
  const comboId = req.params?.["id"] as string;
  const data = await ComboService.getComboById(comboId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Combos retrieved successfully",
    data,
  });
});

const updateCombo = catchAsync(async (req: Request, res: Response) => {
  const id = req.params["id"] as string;
  const combo = await ComboService.updateCombo(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Combo updated successfully",
    data: combo,
  });
});

const deleteCombo = catchAsync(async (req: Request, res: Response) => {
  const id = req.params["id"] as string;
  await ComboService.deleteCombo(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Combo deleted successfully",
    data: null,
  });
});

const getComboDetailsBySlug = catchAsync(
  async (req: Request, res: Response) => {
    const slug = req.params["slug"] as string;
    const combo = await ComboService.getComboDetailsBySlug(slug);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Combo details retrieved successfully",
      data: combo,
    });
  }
);

export const ComboController = {
  createCombo,
  getComboById,
  getCombos,
  updateCombo,
  deleteCombo,
  getComboDetailsBySlug,
};
