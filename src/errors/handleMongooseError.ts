// @ts-nocheck
import type { IGenericErrorMessage } from "@/interfaces/error.js";
import mongoose from "mongoose";

export const handleMongooseError = (error: mongoose.Error) => {
  let message = "An error occurred";
  let errorMessages: IGenericErrorMessage[] = [];

  if (error instanceof mongoose.Error.ValidationError) {
    message = "Validation Error";
    errorMessages = Object.entries(error.errors).map(([path, err]) => ({
      path,
      message: err.message,
    }));
  } else if (error instanceof mongoose.Error.CastError) {
    message = `Invalid value for ${error.path}: ${error.value}`;
    errorMessages.push({ path: error.path, message: error.message });
  } else if (error instanceof mongoose.Error.DocumentNotFoundError) {
    message = `Document not found for ${error.modelName} with ID ${error.value}`;
    errorMessages.push({ path: error.path, message: error.message });
  } else {
    message = "An unexpected error occurred";
    errorMessages.push({
      path: error.path || "unknown",
      message: error.message,
    });
  }
  return { message, errorMessages };
};
