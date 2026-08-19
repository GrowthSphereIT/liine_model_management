/**
 * Shared image-upload helpers for Server Actions. Uploaded images are stored
 * inline as base64 data URLs (no object storage / mounted volume required), so
 * the reserved-area features stay self-contained.
 */

export const MAX_FILES = 8;
export const MAX_FILE_BYTES = 6 * 1024 * 1024; // 6MB per image

export async function filesToDataUrls(files: File[]): Promise<string[]> {
  const usable = files.filter((f) => f && f.size > 0).slice(0, MAX_FILES);
  const out: string[] = [];
  for (const file of usable) {
    if (!file.type.startsWith("image/")) {
      throw new Error("Sono ammesse solo immagini.");
    }
    if (file.size > MAX_FILE_BYTES) {
      throw new Error("Ogni immagine deve pesare meno di 6MB.");
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    out.push(`data:${file.type};base64,${buffer.toString("base64")}`);
  }
  return out;
}

/** Moves the item at `index` to the front (cover position). No-op if invalid. */
export function moveToFront<T>(list: T[], index: number): T[] {
  if (!Number.isInteger(index) || index <= 0 || index >= list.length) {
    return list;
  }
  const copy = [...list];
  const [picked] = copy.splice(index, 1);
  return [picked, ...copy];
}
