import { Menu } from "./menu.model.js";
import type { IMenu, IMenuFilterOptoins } from "./menu.interface.js";
import { generateMenuId } from "@/utils/menu-id.js";
import type { IPaginationType } from "@/interfaces/paginaiton.js";
import { paginationHelpers } from "@/helper/paginationHelper.js";
import type { SortOrder } from "mongoose";
import { searchableFields } from "./menu.constants.js";
import { rangeEnd, rangeStart } from "@/constants/range.query.js";
import { actualFilterField } from "@/utils/format-text.js";
import { isMongoObjectId } from "@/utils/mongodb.js";
import mongoose from "mongoose";

const getMenus = async (
  paginationOptions: IPaginationType,
  filtersOptions: IMenuFilterOptoins
) => {
  // Pagination Options
  const { skip, page, limit, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  // Sort condition
  const sortCondition: { [key: string]: SortOrder } = {};
  sortCondition[sortBy] = sortOrder;

  // Filter Options
  const { searchTerm, ...filtersData } = filtersOptions;

  const andCondition = [];
  if (searchTerm) {
    andCondition.push({
      $or: searchableFields.map((field) => ({
        [field]: { $regex: searchTerm, $options: "i" },
      })),
    });
  }

  if (Object.keys(filtersData).length) {
    andCondition.push({
      $and: Object.entries(filtersData).map(([field, value]) => {
        // Handle range queries
        if (field.startsWith(rangeStart))
          return { [actualFilterField(field, rangeStart)]: { $lte: value } };

        if (field.startsWith(rangeEnd))
          return { [actualFilterField(field, rangeEnd)]: { $lte: value } };

        // Handle ObjectId Query
        if (isMongoObjectId(value))
          return { [field]: new mongoose.Types.ObjectId(value) };

        return { [field]: value };
      }),
    });
  }

  const whereCondition = Object.keys(andCondition).length
    ? { $and: andCondition }
    : {};

  const data = await Menu.find(whereCondition).skip(skip).limit(limit).lean();

  const total = await Menu.countDocuments(whereCondition);

  const response = {
    data,
    metaData: {
      total,
      page,
      limit,
    },
  };

  return response;
};

const createMenu = async (menuData: IMenu) => {
  let nextId = await generateMenuId();
  menuData.id = nextId;
  const menu = await Menu.create(menuData);
  return menu;
};

const updateMenu = async (menuId: string, updateData: Partial<IMenu>) => {
  // check if the menu exists
  const existingMenu = await Menu.findOne({ id: menuId });
  if (!existingMenu) {
    throw new Error("Menu not found");
  }

  // Update menu
  const menu = await Menu.findOneAndUpdate({ id: menuId }, updateData, {
    new: true,
  });

  return menu;
};

const deleteMenu = async (menuId: string) => {
  // check if the menu exists
  const existingMenu = await Menu.findOne({ id: menuId });
  if (!existingMenu) {
    throw new Error("Menu not found");
  }

  await Menu.findOneAndDelete({ id: menuId });
  return null;
};

export const MenuService = {
  getMenus,
  createMenu,
  updateMenu,
  deleteMenu,
};
