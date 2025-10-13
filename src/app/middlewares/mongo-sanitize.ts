import type { Request, Response, NextFunction } from "express";

export const mongoSanitize = (req: Request, _res: Response, next: NextFunction) => {
  const sanitize = (obj: any) => {
    if (obj && typeof obj === "object") {
      for (const key of Object.keys(obj)) {
        // if key contains "$" or ".", replace them with "_"
        if (key.includes("$") || key.includes(".")) {
          const cleanKey = key.replace(/\$/g, "_").replace(/\./g, "_");
          obj[cleanKey] = obj[key];
          delete obj[key];
        }
        sanitize(obj[key]);
      }
    }
  };

  sanitize(req.body);
  sanitize(req.query);
  sanitize(req.params);
  next();
};
