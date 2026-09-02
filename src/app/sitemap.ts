import type { MetadataRoute } from "next";
import { getPublicBoard } from "@/lib/admin-data";

const SITE_URL = "https://www.liinemodelmanagement.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const base: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/richiesta`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/candidatura`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
  ];

  let models: MetadataRoute.Sitemap = [];
  try {
    const board = await getPublicBoard();
    const all = [...board.lei, ...board.lui, ...board.kids];
    models = all.map((m) => ({
      url: `${SITE_URL}/modelli/${m.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
  } catch {
    // Database unavailable — ship the static routes only.
  }

  return [...base, ...models];
}
