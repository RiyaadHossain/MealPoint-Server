// controllers/admin.controller.ts
import type { Request, Response } from "express";
import httpStatus from "http-status";
import sendResponse from "@/shared/send-response.js";
import { AdminService } from "./admin.services.js";
import dayjs from "dayjs";

export const AdminController = {
  async getStatistics(_req: Request, res: Response) {
    const data = await AdminService.getStatistics();

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Statistics data retrieved successfully",
      data,
    });
  },

  async getSalesOrdersStatistics(req: Request, res: Response) {
    const { period = "month", range = 6 } = req.query;
    const data = await AdminService.getSalesOrdersStatistics(
      period as "day" | "month",
      Number(range)
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Sales orders statistics retrieved successfully",
      data,
    });
  },

  async getSalesSummary(req: Request, res: Response) {
    const startDate =
      (req.query?.["startDate"] as string) ||
      dayjs().startOf("day").toISOString();
    const endDate =
      (req.query?.["endDate"] as string) || dayjs().endOf("day").toISOString();

    const data = await AdminService.getSalesSummary(
      startDate as string,
      endDate as string
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Sales summary retrieved successfully",
      data,
    });
  },
};
