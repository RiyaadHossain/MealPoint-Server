import type {
  IGenericErrorMessage,
  IGenericErrorResponse,
} from "@/interfaces/error.js";
import { ZodError } from "zod";

const handleZodError = (error: ZodError): IGenericErrorResponse => {
  const errors: IGenericErrorMessage[] = error.issues.map((issue) => {
    return {
      path: issue?.path[issue.path.length - 1] as string,
      message: issue?.message,
    };
  });

  const statusCode = 400;

  return {
    statusCode,
    message: "Validation Error",
    errorMessages: errors,
  };
};

export default handleZodError;
