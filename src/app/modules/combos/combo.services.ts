import { Combo } from "./combo.model.js";
import type { ICombo } from "./combo.interface.js";
import httpStatus from "http-status";
import ApiError from "@/errors/ApiError.js";
import { generateComboId } from "@/utils/menu-id.js";
import type { IPaginationType } from "@/interfaces/paginaiton.js";
import type { IMenuFilterOptoins } from "../menus/menu.interface.js";
import { paginationHelpers } from "@/helper/paginationHelper.js";
import type { SortOrder } from "mongoose";
import { comboSearchableFields } from "./combo.constants.js";
import { actualFilterField } from "@/utils/format-text.js";
import { rangeEnd, rangeStart } from "@/constants/range.query.js";
import { isMongoObjectId } from "@/utils/mongodb.js";
import mongoose from "mongoose";
import { Menu } from "../menus/menu.model.js";
import { NotificationService } from "../notifications/notification.services.js";
import { NotificationType } from "@/enums/notification-type.enum.js";
import { NotificationEvents } from "../notifications/notification.constants.js";

const createCombo = async (payload: Omit<ICombo, "id">) => {
  // Generate combo id
  const id = await generateComboId();

  // Validate all menu items exist
  for (const comboItem of payload.items) {
    const menuExists = await Menu.findById(comboItem.item);
    if (!menuExists)
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        `Menu item not found: ${comboItem.item}`
      );

    comboItem.price = menuExists.price * comboItem.quantity;
  }

  await NotificationService.createNotificationForEvent(
    null,
    NotificationType.ALL_USER,
    NotificationEvents.NEW_ITEMS
  );

  // Create combo
  return Combo.create({ ...payload, id });
};

const getCombos = async (
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
      $or: comboSearchableFields.map((field) => ({
        [field]: { $regex: searchTerm, $options: "i" },
      })),
    });
  }

  if (Object.keys(filtersData).length) {
    andCondition.push({
      $and: Object.entries(filtersData).map(([field, value]) => {
        // Handle range queries
        if (field.startsWith(rangeStart))
          return { [actualFilterField(field, rangeStart)]: { $gte: value } };

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

  const data = await Combo.find(whereCondition)
    .skip(skip)
    .limit(limit)
    .populate({
      path: "items.item",
      populate: { path: "category", select: "name description" },
      select: "name id description price",
    })
    .lean();

  const total = await Combo.countDocuments(whereCondition);

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

const getComboById = async (id: string) => {
  const combo = await Combo.findOne({ id }).populate({
    path: "items.item",
    populate: { path: "category", select: "name description" },
    select: "name id description price",
  });

  if (!combo) throw new ApiError(httpStatus.NOT_FOUND, "Combo not found");
  return combo;
};

const updateCombo = async (id: string, payload: Partial<ICombo>) => {
  // Check combo exists
  const comboExists = await Combo.exists({ id });
  if (!comboExists) throw new ApiError(httpStatus.NOT_FOUND, "Combo not found");

  // If updating items, validate menu items
  if (payload.items) {
    for (const comboItem of payload.items) {
      const menuExists = await Menu.exists({ _id: comboItem.item });
      if (!menuExists) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          `Menu item not found: ${comboItem.item}`
        );
      }
    }
  }

  const combo = await Combo.findOneAndUpdate({ id }, payload, { new: true });
  return combo;
};

const deleteCombo = async (id: string) => {
  // Check combo exists
  const comboExists = await Combo.exists({ id });
  if (!comboExists) throw new ApiError(httpStatus.NOT_FOUND, "Combo not found");
  const combo = await Combo.findOneAndDelete({ id });
  return combo;
};
export const ComboService = {
  createCombo,
  getCombos,
  getComboById,
  updateCombo,
  deleteCombo,
};
