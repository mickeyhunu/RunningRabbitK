import {
  heroContent,
  homeMeta,
  navigationLinks,
  sections,
  siteMetadata,
  sitemapEntries,
} from "../config/seo.js";

export const renderHomePage = (req, res) => {
  const canonical = `${siteMetadata.baseUrl}${req.path === "/" ? "/" : req.path}`;
  const meta = {
    ...homeMeta,
    title: `${homeMeta.title} | ${siteMetadata.name}`,
    canonical,
    keywords: siteMetadata.keywords.join(", "),
    openGraph: {
      ...homeMeta.openGraph,
      url: canonical,
    },
    structuredData: {
      ...homeMeta.structuredData,
      mainEntity: {
        "@type": "WebPage",
        name: homeMeta.title,
        url: canonical,
      },
    },
  };

  res.render("home", {
    meta,
    navigationLinks,
    heroContent,
    sections,
    siteMetadata,
  });
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
