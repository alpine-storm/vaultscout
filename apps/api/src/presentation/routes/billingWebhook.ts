import { Router } from "express";
import { billingService } from "./billingRoutes";

const router = Router();

router.post("/", async (req, res, next) => {
  try {
    const signature = req.headers["stripe-signature"];
    if (!signature || Array.isArray(signature)) {
      res.status(400).json({ error: "Missing stripe-signature header" });
      return;
    }

    await billingService.handleWebhook(req.body as Buffer, signature);
    res.json({ received: true });
  } catch (err) {
    next(err);
  }
});

export { router as billingWebhook };
