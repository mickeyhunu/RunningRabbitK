import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { seoLandingPages, siteMetadata, sitemapEntries } from "../config/seo.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const homePagePath = path.join(__dirname, "../views/home.html");

export const renderHomePage = (_req, res) => {
  res.sendFile(homePagePath);
};

export const renderSeoLandingPage = (req, res, next) => {
  const slug = req.params.slug;
  const page = seoLandingPages.find((entry) => entry.slug === slug);

  if (!page) {
    next();
    return;
  }

  const html = fs
    .readFileSync(homePagePath, "utf8")
    .replace(
      /<title>.*?<\/title>/,
      `<title>${page.title} | 강남달토 달리는토끼 공식 안내</title>`
    )
    .replace(
      /<meta name="description" content=".*?" \/>/,
      `<meta name="description" content="${page.description}" />`
    )
    .replace(
      /<link rel="canonical" href=".*?" \/>/,
      `<link rel="canonical" href="${siteMetadata.baseUrl}/${page.slug}" />`
    )
    .replace(
      '<body data-rsssl=1 data-burst_id="6" data-burst_type="page">',
      `<body data-rsssl=1 data-burst_id="6" data-burst_type="page" data-seo-page="${page.slug}">`
    );

  res.type("html").send(html);
};

const escapeXml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

export const renderSitemap = (_req, res) => {
  const xmlEntries = sitemapEntries
    .map(
      (entry) => `  <url>\n    <loc>${escapeXml(entry.loc)}</loc>\n    <lastmod>${entry.lastmod}</lastmod>\n    <changefreq>${entry.changefreq}</changefreq>\n    <priority>${entry.priority}</priority>\n  </url>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${xmlEntries}\n</urlset>\n`;

  res.set("Cache-Control", "public, max-age=3600");
  res.type("application/xml").send(xml);
};

export const renderRobots = (_req, res) => {
  const robots = [
    `User-agent: *`,
    `Allow: /`,
    `Disallow: /api/`,
    `Disallow: /healthz`,
    ``,
    `Host: ${siteMetadata.baseUrl}`,
    `Sitemap: ${siteMetadata.baseUrl}/sitemap.xml`,
    ``,
  ].join("\n");

  res.set("Cache-Control", "public, max-age=3600");
  res.type("text/plain").send(robots);
};

export const renderHealth = (_req, res) => {
  res.json({ ok: true, message: "healthy" });
};

const COMMUNITY_REVIEW_API = "https://nightmens.com/api/posts/search-signal";
const COMMUNITY_REVIEW_KEYWORDS = new Set(["달토", "ㄷㅌ"]);

export const renderCommunityReviews = async (req, res) => {
  try {
    const keyword = typeof req.query.keyword === "string" ? req.query.keyword.trim() : "달토";
    const safeKeyword = COMMUNITY_REVIEW_KEYWORDS.has(keyword) ? keyword : "달토";
    const apiUrl = new URL(COMMUNITY_REVIEW_API);
    apiUrl.searchParams.set("board", "후기");
    apiUrl.searchParams.set("keyword", safeKeyword);

    const response = await fetch(apiUrl);
    if (response.status === 404) {
      res.json({ content: [] });
      return;
    }

    if (!response.ok) {
      const error = new Error("Failed to fetch community reviews");
      error.status = response.status;
      throw error;
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Community reviews fetch failed:", error);
    res.json({ content: [] });
  }
};
