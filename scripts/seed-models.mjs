/**
 * Model seeding for LIINE.
 *
 * Builds the roster from the photo folders under public/models. Each folder is
 * named "<NOME> H<altezza>" (e.g. "AMANDA H180"); the seed scans it for images,
 * uses the "viso" shot as the board cover and the rest as portfolio stills, and
 * stores the public /models paths directly (nothing is re-encoded).
 *
 * The height in the folder name is stored as a measurement (used by the composit
 * generator); the other measurements are left blank and can be filled from the
 * reserved area.
 *
 * The upsert is idempotent (stable, name-based slugs), so re-running never
 * duplicates. To replace the previous roster, empty the collection first:
 *   npm run db:clear
 *   npm run seed
 *
 * Works are intentionally NOT seeded.
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, relative } from "node:path";
import { MongoClient } from "mongodb";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");
const MODELS_DIR = join(root, "public", "models");

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

// ── Division per model (folder name, uppercased, without the height) ────────
const DIVISION_BY_NAME = {
  AMANDA: "lei",
  DINA: "lei",
  ELINA: "lei",
  JULIE: "lei",
  TATIANA: "lei",
  TATYANA: "lei",
  YULII: "lei",
  BRUNO: "lui",
  GIOVANNI: "lui",
  GUI: "lui",
  HELIOS: "lui",
  ISAAC: "lui",
};

const IMAGE_RE = /\.(jpe?g|png|webp)$/i;

function slugify(input) {
  const base = input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return base || "voce";
}

function titleCase(input) {
  return input.toLowerCase().replace(/(^|\s)\S/g, (c) => c.toUpperCase());
}

// Turn an absolute file path under /public into a URL-encoded public path.
function toPublicUrl(absPath) {
  const rel = relative(join(root, "public"), absPath).split("/");
  return "/" + rel.map(encodeURIComponent).join("/");
}

// Rank for ordering: cover (viso) first, then portfolio, polaroids last.
function rank(relPath) {
  const lower = relPath.toLowerCase();
  const base = lower.split("/").pop() ?? "";
  if (base.startsWith("viso")) return 0;
  if (lower.includes("pola")) return 2;
  return 1;
}

function collectImages(modelDir) {
  const entries = readdirSync(modelDir, { recursive: true });
  const files = entries
    .map((e) => join(modelDir, e))
    .filter((p) => IMAGE_RE.test(p) && statSync(p).isFile());

  const rel = (p) => relative(modelDir, p);
  files.sort((a, b) => {
    const ra = rank(rel(a));
    const rb = rank(rel(b));
    if (ra !== rb) return ra - rb;
    return rel(a).localeCompare(rel(b), "en", { numeric: true });
  });
  return files.map(toPublicUrl);
}

function parseFolder(folder) {
  // "AMANDA H180" | "DINA H 177" | "YULII H 185"
  const m = folder.match(/^(.+?)\s+H\s*(\d+)\s*$/i);
  const rawName = m ? m[1].trim() : folder.trim();
  const height = m ? m[2] : "";
  const key = rawName.toUpperCase();
  return {
    key,
    name: titleCase(rawName),
    height,
    division: DIVISION_BY_NAME[key] ?? "lei",
  };
}

function buildRoster() {
  const folders = readdirSync(MODELS_DIR).filter((f) => {
    try {
      return statSync(join(MODELS_DIR, f)).isDirectory();
    } catch {
      return false;
    }
  });

  const roster = [];
  for (const folder of folders) {
    const meta = parseFolder(folder);
    const images = collectImages(join(MODELS_DIR, folder));
    if (images.length === 0) {
      console.warn(`  ⚠ nessuna immagine in «${folder}» — saltato`);
      continue;
    }
    roster.push({ ...meta, images });
  }

  // Lei first, then Lui; alphabetical within a division.
  const order = { lei: 0, lui: 1, kids: 2 };
  roster.sort(
    (a, b) =>
      (order[a.division] ?? 9) - (order[b.division] ?? 9) ||
      a.name.localeCompare(b.name, "it"),
  );
  return roster;
}

// Deterministic, spaced timestamps preserve the display order (Lei then Lui)
// when the app reads models back sorted by createdAt.
const BASE = Date.UTC(2024, 0, 1);

async function main() {
  const roster = buildRoster();
  if (roster.length === 0) {
    console.error("✗ Nessun modello trovato in public/models.");
    process.exit(1);
  }

  const client = new MongoClient(MONGODB_URI, {
    serverSelectionTimeoutMS: 8000,
  });
  await client.connect();
  const db = client.db(MONGODB_DB);
  const models = db.collection("models");

  await models.createIndex({ slug: 1 }, { unique: true });

  let inserted = 0;
  let updated = 0;

  for (let i = 0; i < roster.length; i++) {
    const m = roster[i];
    const slug = slugify(m.name);

    const res = await models.updateOne(
      { slug },
      {
        $set: {
          name: m.name,
          division: m.division,
          images: m.images,
          height: m.height,
        },
        $setOnInsert: { slug, createdAt: new Date(BASE + i * 1000) },
      },
      { upsert: true },
    );

    if (res.upsertedCount) inserted++;
    else if (res.matchedCount) updated++;
    console.log(
      `  ${res.upsertedCount ? "＋ inserito" : "↻ aggiornato"}  ${m.division.toUpperCase()}  ${m.name}  H${m.height || "?"}  (${m.images.length} img)  /modelli/${slug}`,
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
