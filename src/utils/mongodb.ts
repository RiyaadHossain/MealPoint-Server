import mongoose from "mongoose";

export const isMongoObjectId = (id: string | number | boolean): boolean => {
  const res = typeof id === "string" && mongoose.Types.ObjectId.isValid(id);
  return res;
};
