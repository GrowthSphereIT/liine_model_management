/**
 * Empties the LIINE content collections so the roster can be re-seeded from
 * scratch. Removes every document from `models` and `works` (the two
 * seedable content collections) — casting/clienti contacts are left untouched.
 *
 * Usage:
 *   npm run db:clear
 *   npm run seed
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { MongoClient } from "mongodb";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");

function loadEnv() {
  for (const file of [".env.local", ".env"]) {
    try {
      const raw = readFileSync(join(root, file), "utf8");
      for (const line of raw.split("\n")) {
        const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
        if (!m) continue;
        const key = m[1];
        if (process.env[key] !== undefined) continue;
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

async function main() {
  const client = new MongoClient(MONGODB_URI, {
    serverSelectionTimeoutMS: 8000,
  });
  await client.connect();
  const db = client.db(MONGODB_DB);

  for (const name of ["models", "works"]) {
    const res = await db.collection(name).deleteMany({});
    console.log(`  ✕ svuotata «${name}» — ${res.deletedCount} documenti rimossi`);
  }

  console.log(
    `\n✓ Database «${MONGODB_DB}» svuotato. Esegui «npm run seed» per ricaricare i modelli.`,
  );
  await client.close();
}

main().catch((err) => {
  console.error("\n✗ Pulizia fallita:", err.message);
  process.exit(1);
});
