import { Request, Response, NextFunction } from "express";
import { contentService } from "./content.service";
import { contactsQuerySchema } from "./content.schemas";

export const contentController = {
  async partnerBanks(_req: Request, res: Response, next: NextFunction) {
    try {
      res.status(200).json({ banks: await contentService.partnerBanks() });
    } catch (e) { next(e); }
  },

  async reviews(_req: Request, res: Response, next: NextFunction) {
    try {
      res.status(200).json({ reviews: await contentService.reviews() });
    } catch (e) { next(e); }
  },

  async ratings(_req: Request, res: Response, next: NextFunction) {
    try {
      res.status(200).json({ ratings: await contentService.ratings() });
    } catch (e) { next(e); }
  },

  async blogList(_req: Request, res: Response, next: NextFunction) {
    try {
      res.status(200).json({ posts: await contentService.blogList() });
    } catch (e) { next(e); }
  },

  async blogPost(req: Request, res: Response, next: NextFunction) {
    try {
      const post = await contentService.blogPost(req.params.slug as string);
      res.status(200).json({ post });
    } catch (e) { next(e); }
  },

  async cities(_req: Request, res: Response, next: NextFunction) {
    try {
      res.status(200).json({ cities: await contentService.cities() });
    } catch (e) { next(e); }
  },

  async contacts(req: Request, res: Response, next: NextFunction) {
    try {
      const { query } = contactsQuerySchema.parse({ query: req.query });
      const result = await contentService.contacts(query);
      res.status(200).json(result);
    } catch (e) { next(e); }
  },
};
