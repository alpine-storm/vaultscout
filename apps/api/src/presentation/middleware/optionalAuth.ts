import type { Request, Response, NextFunction } from "express";
import { AuthService } from "../../application/services/AuthService";

const authService = new AuthService();

export async function optionalAuth(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  const header = req.headers.authorization;
  if (header?.startsWith("Bearer ")) {
    const user = await authService.getUserByToken(header.slice(7));
    if (user) req.user = user;
  }
  next();
}
