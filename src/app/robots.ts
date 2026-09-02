import type { MetadataRoute } from "next";

const SITE_URL = "https://www.liinemodelmanagement.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/riservato", "/riservato/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
