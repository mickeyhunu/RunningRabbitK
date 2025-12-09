import { Router } from "express";
import {
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

export default router;
