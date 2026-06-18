import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { env } from "./config/env";
import { authRouter } from "./modules/auth/auth.routes";
import { catalogRouter } from "./modules/catalog/catalog.routes";
import { leadsRouter, adminLeadsRouter } from "./modules/leads/leads.routes";
import { collectionsRouter } from "./modules/collections/collections.routes";
import { creditRouter } from "./modules/credit/credit.routes";
import { contentRouter } from "./modules/content/content.routes";
import { adminRouter } from "./modules/admin/admin.routes";
import { errorHandler } from "./middleware/errorHandler";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
  app.use(express.json());

  const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 50 });
  app.use("/api/auth", authLimiter, authRouter);

  app.use("/api", catalogRouter);
  app.use("/api", leadsRouter);
  app.use("/api", adminLeadsRouter);
  app.use("/api", collectionsRouter);
  app.use("/api", creditRouter);
  app.use("/api", contentRouter);
  app.use("/api", adminRouter);

  app.get("/health", (_req, res) => {
    res.json({ ok: true });
  });

  app.use(errorHandler);
  return app;
}
