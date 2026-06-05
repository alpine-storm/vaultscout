import type { Request, Response, NextFunction } from "express";
import { AppError } from "../../domain/errors/AppError";
import { ZodError } from "zod";

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }

  if (err instanceof ZodError) {
    res.status(400).json({ error: err.errors[0]?.message ?? "Invalid request" });
    return;
  }

  console.error(err);
  res.status(500).json({ error: err.message ?? "Internal server error" });
}
