import { Router } from "express";
import {
  renderCommunityReviews,
  renderHealth,
  renderHomePage,
  renderRobots,
  renderSitemap,
} from "../controllers/pageController.js";

const router = Router();

router.get("/", renderHomePage);
router.get("/sitemap.xml", renderSitemap);
router.get("/robots.txt", renderRobots);
router.get("/healthz", renderHealth);
router.get("/api/community-reviews", renderCommunityReviews);

export default router;
