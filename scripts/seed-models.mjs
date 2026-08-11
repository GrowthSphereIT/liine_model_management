/**
 * Initial model seeding for LIINE.
 *
 * Migrates the roster that used to live hardcoded in src/lib/site-data.ts into
 * MongoDB, so from now on models are managed entirely from the reserved area
 * (/riservato). Images stay as the existing /public asset paths — nothing is
 * re-encoded. Slugs are stable (name-based) and the upsert is idempotent, so
 * re-running never duplicates or reshuffles anything.
 *
 * Works are intentionally NOT seeded.
 *
 * Usage (with the stack up and Mongo reachable on the URI in .env.local):
 *   npm run seed
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { MongoClient } from "mongodb";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");

// ── Minimal .env.local loader (no dependency on Node's --env-file) ──────────
function loadEnv() {
  for (const file of [".env.local", ".env"]) {
    try {
      const raw = readFileSync(join(root, file), "utf8");
      for (const line of raw.split("\n")) {
        const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
        if (!m) continue;
        const key = m[1];
        if (process.env[key] !== undefined) continue; // real env wins
        let val = m[2].trim();
        if (
          (val.startsWith('"') && val.endsWith('"')) ||
          (val.startsWith("'") && val.endsWith("'"))
        ) {
          val = val.slice(1, -1);
        }
        process.env[key] = val;
      }
    } catch {
      // file absent — rely on the process environment
    }
  }
}
loadEnv();

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || "liine";

if (!MONGODB_URI) {
  console.error(
    "✗ MONGODB_URI is not set. Add it to .env.local or export it before running.",
  );
  process.exit(1);
}

// ── Roster to migrate (formerly BOARD in site-data.ts) ──────────────────────
// images[0] is the board cover; the rest are portfolio stills. Every path
// already exists under /public.
const portfolio = (base, n) =>
  Array.from({ length: n }, (_, i) => `/models/portfolio/${base}-0${i + 1}.jpg`);

const ROSTER = [
  { name: "Liubava", division: "lei", board: "lei-liubava", stills: portfolio("liubava", 1) },
  { name: "Bianca", division: "lei", board: "lei-bianca", stills: portfolio("bianca", 1) },
  { name: "Sara", division: "lei", board: "lei-sara", stills: portfolio("sara", 1) },
  { name: "Nadia", division: "lei", board: "lei-nadia", stills: portfolio("nadia", 1) },
  { name: "Iryna", division: "lei", board: "lei-iryna", stills: portfolio("iryna", 6) },
  { name: "Daria", division: "lei", board: "lei-daria", stills: portfolio("daria", 6) },
  { name: "Chloe", division: "lei", board: "lei-chloe", stills: portfolio("chloe", 6) },
  { name: "Tatyana", division: "lei", board: "lei-tatyana", stills: portfolio("tatyana", 1) },
  { name: "Straulova", division: "lei", board: "lei-straulova", stills: portfolio("straulova", 1) },
  { name: "Emanuele", division: "lui", board: "lui-emanuele", stills: portfolio("emanuele", 4) },
  { name: "Tommaso", division: "lui", board: "lui-tommaso", stills: portfolio("tommaso", 2) },
];

function slugify(input) {
  const base = input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return base || "voce";
}

// Deterministic, spaced timestamps preserve the display order (Lei then Lui)
// when the app reads models back sorted by createdAt.
const BASE = Date.UTC(2020, 0, 1);

async function main() {
  const client = new MongoClient(MONGODB_URI, {
    serverSelectionTimeoutMS: 8000,
  });
  await client.connect();
  const db = client.db(MONGODB_DB);
  const models = db.collection("models");

  await models.createIndex({ slug: 1 }, { unique: true });

  let inserted = 0;
  let updated = 0;

  for (let i = 0; i < ROSTER.length; i++) {
    const m = ROSTER[i];
    const slug = slugify(m.name);
    const images = [`/models/board/${m.board}.jpg`, ...m.stills].filter(
      (v, idx, arr) => arr.indexOf(v) === idx,
    );

    const res = await models.updateOne(
      { slug },
      {
        $set: { name: m.name, division: m.division, images },
        $setOnInsert: { slug, createdAt: new Date(BASE + i * 1000) },
      },
      { upsert: true },
    );

    if (res.upsertedCount) inserted++;
    else if (res.matchedCount) updated++;
    console.log(
      `  ${res.upsertedCount ? "＋ inserito" : "↻ aggiornato"}  ${m.division.toUpperCase()}  ${m.name}  (${images.length} img)  /modelli/${slug}`,
    );
  }

  const total = await models.countDocuments();
  console.log(
    `\n✓ Seed completato — ${inserted} inseriti, ${updated} aggiornati. Modelli totali in «${MONGODB_DB}»: ${total}.`,
  );
  console.log("  (I lavori non sono stati toccati.)");

  await client.close();
}

main().catch((err) => {
  console.error("\n✗ Seed fallito:", err.message);
  process.exit(1);
});
