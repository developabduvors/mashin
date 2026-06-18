import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";

type Role = "BUYER" | "SELLER" | "ADMIN";

export function authorize(...roles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new AppError("Avtorizatsiya kerak", 401, "UNAUTHORIZED"));
      return;
    }
    if (!roles.includes(req.user.role)) {
      next(new AppError("Ruxsat yo'q", 403, "FORBIDDEN"));
      return;
    }
    next();
  };
}
