import { Router } from "express";
import rateLimit from "express-rate-limit";
import { leadsController } from "./leads.controller";
import { validate } from "../../middleware/validate";
import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import {
  createLeadSchema,
  adminLeadQuerySchema,
  updateLeadSchema,
} from "./leads.schemas";

// Public POST — spam himoyasi: 10 ariza / daqiqa / IP.
const leadLimiter = rateLimit({ windowMs: 60 * 1000, max: 10 });

// /api ostiga ulanadi → POST /api/leads
export const leadsRouter = Router();
leadsRouter.post("/leads", leadLimiter, validate(createLeadSchema), leadsController.create);

// /api ostiga ulanadi → /api/admin/leads (faqat ADMIN)
export const adminLeadsRouter = Router();
adminLeadsRouter.use(authenticate, authorize("ADMIN"));
adminLeadsRouter.get("/admin/leads", validate(adminLeadQuerySchema), leadsController.list);
adminLeadsRouter.patch("/admin/leads/:id", validate(updateLeadSchema), leadsController.updateStatus);
