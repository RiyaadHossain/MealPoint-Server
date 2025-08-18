import catchAsync from "@/shared/catch-async.js";
import sendResponse from "@/shared/send-response.js";
import httpStatus from "http-status";
import type { Request, Response } from "express";
import { MenuService } from "./menu.services.js";
import pick from "@/shared/pick.js";
import { paginationFields } from "@/constants/pagination.js";
import { filterableFields } from "./menu.constants.js";

const getMenus = catchAsync(async (req: Request, res: Response) => {
  const paginationOptions = pick(req.query, paginationFields);
  const filterOptions = pick(req.query, filterableFields);

  const response = await MenuService.getMenus(paginationOptions, filterOptions);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Menus retrieved successfully",
    data: response.data,
    meta: response.metaData,
  });
});

const createMenu = catchAsync(async (req: Request, res: Response) => {
  const menuData = req.body;
  const menu = await MenuService.createMenu(menuData);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Menu created successfully",
    data: menu,
  });
});

const updateMenu = catchAsync(async (req: Request, res: Response) => {
  const menuData = req.body;
  const menuId = req.params["id"] as string;
  const menu = await MenuService.updateMenu(menuId, menuData);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Menu updated successfully",
    data: menu,
  });
});

const deleteMenu = catchAsync(async (req: Request, res: Response) => {
  const menuId = req.params["id"] as string;
  await MenuService.deleteMenu(menuId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Menu deleted successfully",
    data: null,
  });
});

export const MenuController = {
  getMenus,
  createMenu,
  updateMenu,
  deleteMenu,
};
