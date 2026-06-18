import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { AppError } from "../utils/AppError";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: { message: err.message, code: err.code } });
    return;
  }
  if (err instanceof ZodError) {
    res.status(400).json({
      error: { message: "Validatsiya xatosi", code: "VALIDATION_ERROR", issues: err.issues },
    });
    return;
  }
  console.error(err);
  res.status(500).json({ error: { message: "Server xatosi", code: "INTERNAL" } });
}
