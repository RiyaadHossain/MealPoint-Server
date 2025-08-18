import type { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import type { Secret } from "jsonwebtoken";
import config from "@/config/index.js";
import ApiError from "@/errors/ApiError.js";
import { jwtHelpers } from "@/helper/jwtHelper.js";

const auth =
  (...requiredRoles: string[]) =>
  async (req: Request, _res: Response, next: NextFunction) => {
    try {
      //get authorization token
      const token = req.headers.authorization;
      if (!token) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "You are not authorized");
      }
      // verify token
      let verifiedUser = null;

      verifiedUser = jwtHelpers.verifyToken(token, config.JWT_SECRET as Secret);

      req.user = verifiedUser; // role  , userid

      // check user role
      if (
        requiredRoles.length &&
        !requiredRoles.includes(verifiedUser["role"])
      ) {
        throw new ApiError(httpStatus.FORBIDDEN, "Forbidden");
      }
      next();
    } catch (error) {
      next(error);
    }
  };

export default auth;
