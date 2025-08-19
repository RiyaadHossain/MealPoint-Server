import { User } from "./user.model.js";
import type { IPaginationType } from "@/interfaces/paginaiton.js";
import { paginationHelpers } from "@/helper/paginationHelper.js";
import type { SortOrder } from "mongoose";
import { userSearchableFields } from "./user.constants.js";
import { actualFilterField } from "@/utils/format-text.js";
import { rangeEnd, rangeStart } from "@/constants/range.query.js";
import { isMongoObjectId } from "@/utils/mongodb.js";
import mongoose from "mongoose";
import type { IUserFilterOptions } from "./user.interface.js";

/**
 * Get users with pagination and filtering
 */
const getUsers = async (
  paginationOptions: IPaginationType,
  filtersOptions: IUserFilterOptions
) => {
  const { skip, page, limit, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const sortCondition: { [key: string]: SortOrder } = {};
  sortCondition[sortBy] = sortOrder;

  const { searchTerm, ...filtersData } = filtersOptions;
  const andCondition = [];

  if (searchTerm) {
    andCondition.push({
      $or: userSearchableFields.map((field) => ({
        [field]: { $regex: searchTerm, $options: "i" },
      })),
    });
  }

  if (Object.keys(filtersData).length) {
    andCondition.push({
      $and: Object.entries(filtersData).map(([field, value]) => {
        if (field.startsWith(rangeStart))
          return { [actualFilterField(field, rangeStart)]: { $gte: value } };
        if (field.startsWith(rangeEnd))
          return { [actualFilterField(field, rangeEnd)]: { $lte: value } };
        if (isMongoObjectId(value))
          return { [field]: new mongoose.Types.ObjectId(value) };
        return { [field]: value };
      }),
    });
  }

  const whereCondition = Object.keys(andCondition).length
    ? { $and: andCondition }
    : {};

  const data = await User.find(whereCondition).skip(skip).limit(limit).lean();
  const total = await User.countDocuments(whereCondition);

  return {
    data,
    metaData: {
      total,
      page,
      limit,
    },
  };
};

/**
 * Get user details by id
 */
const getUserById = async (id: string) => {
  const user = await User.findOne({ id }).lean();
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};

export const UserService = {
  getUsers,
  getUserById,
};
