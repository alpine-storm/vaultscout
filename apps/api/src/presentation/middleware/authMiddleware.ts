import type { Request, Response, NextFunction } from "express";
import { AuthService } from "../../application/services/AuthService";

const authService = new AuthService();

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const token = header.slice(7);
  const user = await authService.getUserByToken(token);

  if (!user) {
    res.status(401).json({ error: "Invalid or expired session" });
    return;
  }

  req.user = user;
  next();
}

export async function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  if (!req.user || req.user.role !== "ADMIN") {
    res.status(403).json({ error: "Admin access required" });
    return;
  }
  next();
}
