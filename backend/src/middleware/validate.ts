import { Request, Response, NextFunction } from "express";
import { ZodType } from "zod";

export function validate(schema: ZodType) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    if (!result.success) {
      next(result.error);
      return;
    }
    next();
  };
}
