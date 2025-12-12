import path from "path";
import { fileURLToPath } from "url";
import { siteMetadata, sitemapEntries } from "../config/seo.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const renderHomePage = (_req, res) => {
  res.sendFile(path.join(__dirname, "../views/home.html"));
};

export const renderSitemap = (_req, res) => {
  const xmlEntries = sitemapEntries
    .map(
      (entry) => `  <url>\n    <loc>${entry.loc}</loc>\n    <changefreq>${entry.changefreq}</changefreq>\n    <priority>${entry.priority}</priority>\n  </url>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${xmlEntries}\n</urlset>`;
  res.type("application/xml").send(xml);
};

export const renderRobots = (_req, res) => {
  const robots = [`User-agent: *`, `Allow: /`, `Sitemap: ${siteMetadata.baseUrl}/sitemap.xml`].join(
    "\n"
  );
  res.type("text/plain").send(robots);
};

export const renderHealth = (_req, res) => {
  res.json({ ok: true, message: "healthy" });
};
