/**
 * In-place image optimiser for the public roster photos.
 *
 * Walks public/models, auto-orients from EXIF, downscales anything larger than
 * MAX_EDGE on its longest side and re-encodes (mozjpeg / webp / png) at a web
 * quality. Filenames and extensions are preserved, so the seeded /models paths
 * keep working. Non-image files (e.g. .MOV) are left untouched.
 *
 * Usage:
 *   npm run images:optimize
 */

import { readdirSync, statSync, readFileSync, writeFileSync, renameSync, unlinkSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, relative, extname } from "node:path";
import sharp from "sharp";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");
const TARGET = join(root, "public", "models");

const MAX_EDGE = 2000;
const JPEG_Q = 80;
const WEBP_Q = 80;
const IMAGE_RE = /\.(jpe?g|png|webp)$/i;

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    const s = statSync(p);
    if (s.isDirectory()) out.push(...walk(p));
    else if (IMAGE_RE.test(entry)) out.push(p);
  }
  return out;
}

function human(bytes) {
  return bytes >= 1024 * 1024
    ? (bytes / (1024 * 1024)).toFixed(1) + "MB"
    : Math.round(bytes / 1024) + "KB";
}

async function optimise(file) {
  const before = statSync(file).size;
  const input = readFileSync(file);
  const ext = extname(file).toLowerCase();

  let pipeline = sharp(input, { failOn: "none" }).rotate();
  const meta = await pipeline.metadata();
  const longest = Math.max(meta.width ?? 0, meta.height ?? 0);
  if (longest > MAX_EDGE) {
    pipeline = pipeline.resize({
      width: meta.width >= meta.height ? MAX_EDGE : undefined,
      height: meta.height > meta.width ? MAX_EDGE : undefined,
      withoutEnlargement: true,
    });
  }

  if (ext === ".png") {
    pipeline = pipeline.png({ compressionLevel: 9, palette: true, quality: 82 });
  } else if (ext === ".webp") {
    pipeline = pipeline.webp({ quality: WEBP_Q });
  } else {
    pipeline = pipeline.jpeg({ quality: JPEG_Q, mozjpeg: true, progressive: true });
  }

  const out = await pipeline.toBuffer();
  // Only replace when we actually save bytes.
  if (out.length >= before) return { before, after: before, skipped: true };

  const tmp = file + ".tmp";
  writeFileSync(tmp, out);
  renameSync(tmp, file);
  return { before, after: out.length, skipped: false };
}

async function main() {
  const files = walk(TARGET);
  console.log(`Ottimizzo ${files.length} immagini in public/models …\n`);

  let totalBefore = 0;
  let totalAfter = 0;
  for (const file of files) {
    try {
      const { before, after, skipped } = await optimise(file);
      totalBefore += before;
      totalAfter += after;
      const rel = relative(root, file);
      console.log(
        `  ${skipped ? "= " : "↓ "}${human(before).padStart(6)} → ${human(after).padStart(6)}  ${rel}`,
      );
    } catch (err) {
      console.warn(`  ⚠ ${relative(root, file)}: ${err.message}`);
      try {
        unlinkSync(file + ".tmp");
      } catch {}
    }
  }

  const saved = totalBefore - totalAfter;
  const pct = totalBefore ? Math.round((saved / totalBefore) * 100) : 0;
  console.log(
    `\n✓ Fatto — ${human(totalBefore)} → ${human(totalAfter)} (risparmiati ${human(saved)}, -${pct}%).`,
  );
}

main().catch((err) => {
  console.error("\n✗ Ottimizzazione fallita:", err.message);
  process.exit(1);
});
