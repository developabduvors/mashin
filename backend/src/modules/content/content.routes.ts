import { Router } from "express";
import { contentController } from "./content.controller";
import { validate } from "../../middleware/validate";
import { authenticate } from "../../middleware/authenticate";
import { blogSlugSchema, contactsQuerySchema, createReviewSchema } from "./content.schemas";

// /api ostiga ulanadi — read'lar public.
export const contentRouter = Router();

contentRouter.get("/partner-banks", contentController.partnerBanks);
contentRouter.get("/reviews", contentController.reviews);
// Otziv yozish — login talab qiladi (auth butun router'ga emas, shu route'ga).
contentRouter.post(
  "/reviews",
  authenticate,
  validate(createReviewSchema),
  contentController.createReview,
);
contentRouter.get("/ratings", contentController.ratings);
contentRouter.get("/blog", contentController.blogList);
contentRouter.get("/blog/:slug", validate(blogSlugSchema), contentController.blogPost);
contentRouter.get("/cities", contentController.cities);
contentRouter.get("/contacts", validate(contactsQuerySchema), contentController.contacts);
