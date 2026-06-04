import { Router } from "express";
import { NotificationService } from "../../application/services/NotificationService";
import { requireAuth } from "../middleware/authMiddleware";

const router = Router();
const notificationService = new NotificationService();

router.get("/", requireAuth, async (req, res, next) => {
  try {
    const notifications = await notificationService.listForUser(req.user!.id);
    res.json(notifications);
  } catch (err) {
    next(err);
  }
});

router.patch("/:id/read", requireAuth, async (req, res, next) => {
  try {
    await notificationService.markRead(req.user!.id, req.params.id);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

export { router as notificationRoutes };
