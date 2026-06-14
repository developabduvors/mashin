import { Router } from "express";
import { contentController } from "./content.controller";
import { validate } from "../../middleware/validate";
import { blogSlugSchema, contactsQuerySchema } from "./content.schemas";

// /api ostiga ulanadi — barchasi public read.
export const contentRouter = Router();

contentRouter.get("/partner-banks", contentController.partnerBanks);
contentRouter.get("/reviews", contentController.reviews);
contentRouter.get("/ratings", contentController.ratings);
contentRouter.get("/blog", contentController.blogList);
contentRouter.get("/blog/:slug", validate(blogSlugSchema), contentController.blogPost);
contentRouter.get("/cities", contentController.cities);
contentRouter.get("/contacts", validate(contactsQuerySchema), contentController.contacts);
