import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { rssFeedMetadata, seoLandingPages, siteMetadata, sitemapEntries } from "../config/seo.js";

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
    `Sitemap: ${siteMetadata.baseUrl}${rssFeedMetadata.path}`,
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
const COMMUNITY_REVIEW_FEED_KEYWORDS = ["달토", "ㄷㅌ"];
const LIVE_SIGNAL_API = "https://nightmens.com/api/live/signal";

const toValidDate = (value) => {
  if (!value) return new Date();
  const date = new Date(String(value).replace(" ", "T"));
  return Number.isNaN(date.getTime()) ? new Date() : date;
};

const normalizeExternalUrl = (value, fallbackPath = "/") => {
  if (!value) return `${siteMetadata.baseUrl}${fallbackPath}`;

  try {
    const parsed = new URL(value, siteMetadata.baseUrl);
    if (parsed.hostname === "localhost") {
      parsed.protocol = "https:";
      parsed.hostname = "nightmens.com";
      parsed.port = "";
    }
    return parsed.href;
  } catch (_error) {
    return `${siteMetadata.baseUrl}${fallbackPath}`;
  }
};

const stripHtml = (value) => String(value ?? "").replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();

const fetchCommunityReviewFeedItems = async () => {
  const responses = await Promise.allSettled(
    COMMUNITY_REVIEW_FEED_KEYWORDS.map((keyword) => {
      const apiUrl = new URL(COMMUNITY_REVIEW_API);
      apiUrl.searchParams.set("board", "후기");
      apiUrl.searchParams.set("keyword", keyword);
      return fetch(apiUrl).then((response) => {
        if (!response.ok) throw new Error("Failed to fetch community reviews for RSS");
        return response.json();
      });
    })
  );

  return responses
    .filter((result) => result.status === "fulfilled")
    .flatMap((result) => (Array.isArray(result.value.content) ? result.value.content : []))
    .filter((review) => review && review.id)
    .filter((review, index, all) => all.findIndex((item) => item.id === review.id) === index)
    .map((review) => ({
      title: `[후기] ${review.title || "제목 없는 후기"}`,
      description: stripHtml(review.content || "커뮤니티 후기를 확인해 보세요."),
      link: normalizeExternalUrl(review.url, "/reviews"),
      guid: `community-review-${review.id}`,
      pubDate: toValidDate(review.createdAt || review.updatedAt),
    }));
};

const fetchLiveSignalFeedItems = async () => {
  const [roomResponse, entryResponse] = await Promise.allSettled(
    ["room", "entry"].map((type) => {
      const apiUrl = new URL(LIVE_SIGNAL_API);
      apiUrl.searchParams.set("storeNo", "1");
      apiUrl.searchParams.set("type", type);
      apiUrl.searchParams.set("limit", type === "room" ? "1" : "200");
      return fetch(apiUrl).then((response) => {
        if (!response.ok) throw new Error(`Failed to fetch ${type} live signal for RSS`);
        return response.json();
      });
    })
  );

  const items = [];
  if (roomResponse.status === "fulfilled") {
    const room = Array.isArray(roomResponse.value.content) ? roomResponse.value.content[0] : null;
    if (room) {
      items.push({
        title: "[실시간] 룸·웨이팅 현황 업데이트",
        description: `이용 가능 룸 ${room.roomInfo ?? "-"}, 웨이팅 ${room.waitInfo ?? "-"}. 예약 전 현장 상황을 확인해 주세요.`,
        link: `${siteMetadata.baseUrl}/#live-info`,
        guid: `live-room-${room.id || room.snapshotAt || room.updatedAt || Date.now()}`,
        pubDate: toValidDate(room.snapshotAt || room.updatedAt),
      });
    }
  }

  if (entryResponse.status === "fulfilled") {
    const entries = Array.isArray(entryResponse.value.content) ? entryResponse.value.content : [];
    const names = entries.map((entry) => entry.workerName).filter(Boolean).slice(0, 12).join(", ");
    items.push({
      title: "[실시간] 오늘 출근부 업데이트",
      description: `오늘 출근부 총 ${entryResponse.value.totalElements ?? entries.length}명${names ? `: ${names}` : ""}`,
      link: `${siteMetadata.baseUrl}/#live-info`,
      guid: `live-entry-${entryResponse.value.totalElements ?? entries.length}-${new Date().toISOString().slice(0, 10)}`,
      pubDate: new Date(),
    });
  }

  return items;
};

export const renderRssFeed = async (_req, res) => {
  const [reviewItemsResult, liveItemsResult] = await Promise.allSettled([
    fetchCommunityReviewFeedItems(),
    fetchLiveSignalFeedItems(),
  ]);

  const items = [
    ...(reviewItemsResult.status === "fulfilled" ? reviewItemsResult.value : []),
    ...(liveItemsResult.status === "fulfilled" ? liveItemsResult.value : []),
  ]
    .sort((a, b) => b.pubDate - a.pubDate)
    .slice(0, 20);

  const feedUrl = `${siteMetadata.baseUrl}${rssFeedMetadata.path}`;
  const xmlItems = items
    .map((item) => `    <item>\n      <title>${escapeXml(item.title)}</title>\n      <link>${escapeXml(item.link)}</link>\n      <guid isPermaLink="false">${escapeXml(item.guid)}</guid>\n      <pubDate>${item.pubDate.toUTCString()}</pubDate>\n      <description>${escapeXml(item.description)}</description>\n    </item>`)
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n  <channel>\n    <title>${escapeXml(rssFeedMetadata.title)}</title>\n    <link>${escapeXml(siteMetadata.baseUrl)}</link>\n    <atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml" />\n    <description>${escapeXml(rssFeedMetadata.description)}</description>\n    <language>${escapeXml(siteMetadata.language)}</language>\n    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>\n    <ttl>${rssFeedMetadata.ttlMinutes}</ttl>\n${xmlItems}\n  </channel>\n</rss>\n`;

  res.set("Cache-Control", "public, max-age=1800");
  res.type("application/rss+xml").send(xml);
};

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
