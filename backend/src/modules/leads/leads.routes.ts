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
// MUHIM: auth'ni butun router'ga `router.use(...)` bilan qo'ymaymiz — chunki bu router
// /api ga ulangani uchun u orqali O'TGAN har qanday so'rovni (keyin ulangan public
// router'lar: collections, credit, content) 401 bilan to'sib qo'yadi. Shu sabab auth
// har bir admin route'ga ALOHIDA qo'yiladi.
const requireAdmin = [authenticate, authorize("ADMIN")];

export const adminLeadsRouter = Router();
adminLeadsRouter.get("/admin/leads", ...requireAdmin, validate(adminLeadQuerySchema), leadsController.list);
adminLeadsRouter.patch("/admin/leads/:id", ...requireAdmin, validate(updateLeadSchema), leadsController.updateStatus);
