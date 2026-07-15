import { Router } from "express";
import {
  renderCommunityReviews,
  renderHealth,
  renderHomePage,
  renderRobots,
  renderRssFeed,
  renderSeoLandingPage,
  renderSitemap,
} from "../controllers/pageController.js";

const router = Router();

router.get("/", renderHomePage);
router.get("/sitemap.xml", renderSitemap);
router.get("/rss.xml", renderRssFeed);
router.get("/robots.txt", renderRobots);
router.get("/healthz", renderHealth);
router.get("/api/community-reviews", renderCommunityReviews);
router.get("/:slug", renderSeoLandingPage);

export default router;
