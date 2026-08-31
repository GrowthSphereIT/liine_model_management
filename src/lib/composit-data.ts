import { ObjectId, type Collection, type Document } from "mongodb";
import { getDb, COLLECTIONS } from "./mongodb";
import { removeObject } from "./storage";
import type { CompositTheme } from "./composit";

/**
 * Data layer for saved composits (comp cards). The two photos live in object
 * storage (MinIO); the document holds their keys plus the name, measures and
 * theme, so an operator can reopen and edit a composit later.
 */

export interface CompositMeasures {
  height: string;
  bust: string;
  waist: string;
  hips: string;
  shoes: string;
  hair: string;
  eyes: string;
}

export const COMPOSIT_MEASURE_KEYS: (keyof CompositMeasures)[] = [
  "height",
  "bust",
  "waist",
  "hips",
  "shoes",
  "hair",
  "eyes",
];

interface CompositDoc extends Document, Partial<CompositMeasures> {
  _id?: ObjectId;
  name: string;
  theme: CompositTheme;
  /** Object-storage keys for the two photos. */
  frontKey: string;
  backKey: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface AdminComposit extends CompositMeasures {
  id: string;
  name: string;
  theme: CompositTheme;
  frontKey: string;
  backKey: string;
  /** Same-origin, auth-gated URLs the browser can render / feed to jsPDF. */
  frontUrl: string;
  backUrl: string;
  createdAt: string;
}

async function composits(): Promise<Collection<CompositDoc>> {
  const db = await getDb();
  return db.collection<CompositDoc>(COLLECTIONS.composits);
}

/** Auth-gated route that streams a stored object back to the browser. */
export function compositMediaUrl(key: string): string {
  return `/riservato/composit/media/${key}`;
}

function measures(doc: Partial<CompositMeasures>): CompositMeasures {
  return {
    height: doc.height?.trim() || "",
    bust: doc.bust?.trim() || "",
    waist: doc.waist?.trim() || "",
    hips: doc.hips?.trim() || "",
    shoes: doc.shoes?.trim() || "",
    hair: doc.hair?.trim() || "",
    eyes: doc.eyes?.trim() || "",
  };
}

function serialize(doc: CompositDoc): AdminComposit {
  return {
    id: String(doc._id),
    name: doc.name,
    theme: doc.theme === "dark" ? "dark" : "light",
    frontKey: doc.frontKey,
    backKey: doc.backKey,
    frontUrl: compositMediaUrl(doc.frontKey),
    backUrl: compositMediaUrl(doc.backKey),
    createdAt:
      doc.createdAt instanceof Date
        ? doc.createdAt.toISOString()
        : String(doc.createdAt),
    ...measures(doc),
  };
}

export async function listComposits(): Promise<AdminComposit[]> {
  const col = await composits();
  const docs = await col.find({}).sort({ createdAt: -1 }).toArray();
  return docs.map(serialize);
}

export async function getComposit(id: string): Promise<AdminComposit | null> {
  if (!ObjectId.isValid(id)) return null;
  const col = await composits();
  const doc = await col.findOne({ _id: new ObjectId(id) });
  return doc ? serialize(doc) : null;
}

export interface CompositInput extends Partial<CompositMeasures> {
  name: string;
  theme: CompositTheme;
  frontKey: string;
  backKey: string;
}

export async function createComposit(input: CompositInput): Promise<void> {
  const col = await composits();
  await col.insertOne({
    name: input.name.trim(),
    theme: input.theme,
    frontKey: input.frontKey,
    backKey: input.backKey,
    createdAt: new Date(),
    ...measures(input),
  });
}

/**
 * Updates a composit's name / measures / theme, and optionally swaps either
 * photo. When a new key is passed the previous object is removed from storage.
 */
export async function updateComposit(
  id: string,
  input: Partial<CompositMeasures> & {
    name: string;
    theme: CompositTheme;
    frontKey?: string;
    backKey?: string;
  },
): Promise<void> {
  if (!ObjectId.isValid(id)) return;
  const col = await composits();
  const existing = await col.findOne({ _id: new ObjectId(id) });
  if (!existing) return;

  const set: Partial<CompositDoc> = {
    name: input.name.trim(),
    theme: input.theme,
    updatedAt: new Date(),
    ...measures(input),
  };
  if (input.frontKey && input.frontKey !== existing.frontKey) {
    set.frontKey = input.frontKey;
  }
  if (input.backKey && input.backKey !== existing.backKey) {
    set.backKey = input.backKey;
  }

  await col.updateOne({ _id: existing._id }, { $set: set });

  // Remove the replaced originals only after the record points elsewhere.
  if (set.frontKey) await removeObject(existing.frontKey);
  if (set.backKey) await removeObject(existing.backKey);
}

export async function deleteComposit(id: string): Promise<void> {
  if (!ObjectId.isValid(id)) return;
  const col = await composits();
  const doc = await col.findOneAndDelete({ _id: new ObjectId(id) });
  if (doc) {
    await removeObject(doc.frontKey);
    await removeObject(doc.backKey);
  }
}
