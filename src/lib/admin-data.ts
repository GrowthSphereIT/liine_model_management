import { ObjectId, type Collection, type Document } from "mongodb";
import { getDb, COLLECTIONS } from "./mongodb";
import { WORK_INDEX, type ModelCard, type WorkItem } from "./site-data";

/**
 * Reserved-area data layer. Uploaded models and works are persisted in
 * MongoDB; images are stored inline as base64 data URLs so the whole feature
 * is self-contained (no object storage / mounted upload volume required).
 *
 * Public read helpers merge Mongo content on top of the static seed roster and
 * fail soft (return the seed only) when the database is unavailable.
 */

export type AdminDivision = "lei" | "lui" | "kids";
export type BoardKey = AdminDivision;

export const DIVISION_LABELS: Record<AdminDivision, string> = {
  lei: "Lei",
  lui: "Lui",
  kids: "Kids",
};

/**
 * Editable free-text fields shown on the public model detail page. Older
 * documents predate these fields, so every read coalesces to these defaults —
 * this keeps existing pages unchanged until an operator overrides them.
 */
export interface ModelInfo {
  /** Sede — hero meta + scheda row. */
  location: string;
  /** Hero meta badge, e.g. "In roster". */
  status: string;
  /** Scheda row "Agenzia". */
  agency: string;
  /** Scheda row "Disponibilità". */
  availability: string;
  /** Scheda row "Casting". */
  casting: string;
  /** Scheda intro paragraph. */
  intro: string;
}

export const MODEL_DEFAULTS: ModelInfo = {
  location: "Londra",
  status: "In roster",
  agency: "LIINE Model Management",
  availability: "Su richiesta",
  casting: "Aperto tutto l'anno",
  intro:
    "Rappresentanza per campagne, sfilate, editoriali e fitting couture. La selezione parte dal capo e da come cade sul corpo, non dalle misure standard.",
};

// ── Document shapes ──────────────────────────────────────────────────────

interface ModelDoc extends Document, Partial<ModelInfo> {
  _id?: ObjectId;
  slug: string;
  name: string;
  division: AdminDivision;
  /** Data URLs. Cover is images[0]. */
  images: string[];
  createdAt: Date;
  updatedAt?: Date;
}

interface WorkDoc extends Document {
  _id?: ObjectId;
  slug: string;
  credit: string;
  client: string;
  model: string;
  year: string;
  location: string;
  images: string[];
  createdAt: Date;
}

// ── Serialized (client-safe) shapes returned to pages ────────────────────

export interface AdminModel extends ModelInfo {
  id: string;
  slug: string;
  name: string;
  division: AdminDivision;
  divisionLabel: string;
  images: string[];
  cover: string;
  createdAt: string;
}

export interface AdminWork {
  id: string;
  slug: string;
  credit: string;
  client: string;
  model: string;
  year: string;
  location: string;
  images: string[];
  cover: string;
  createdAt: string;
}

export interface UploadedModel extends ModelCard, ModelInfo {
  division: AdminDivision;
  divisionLabel: string;
  uploaded: true;
}

export interface UploadedWork extends WorkItem {
  uploaded: true;
}

// ── Helpers ──────────────────────────────────────────────────────────────

async function models(): Promise<Collection<ModelDoc>> {
  const db = await getDb();
  return db.collection<ModelDoc>(COLLECTIONS.models);
}

async function works(): Promise<Collection<WorkDoc>> {
  const db = await getDb();
  return db.collection<WorkDoc>(COLLECTIONS.works);
}

export function slugify(input: string): string {
  const base = input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return base || "voce";
}

/** Appends a short random suffix so uploads never collide with each other. */
function uniqueSlug(base: string): string {
  return `${slugify(base)}-${Math.random().toString(36).slice(2, 7)}`;
}

/** Coalesce a document's optional info fields onto the shared defaults. */
function modelInfo(doc: Partial<ModelInfo>): ModelInfo {
  return {
    location: doc.location?.trim() || MODEL_DEFAULTS.location,
    status: doc.status?.trim() || MODEL_DEFAULTS.status,
    agency: doc.agency?.trim() || MODEL_DEFAULTS.agency,
    availability: doc.availability?.trim() || MODEL_DEFAULTS.availability,
    casting: doc.casting?.trim() || MODEL_DEFAULTS.casting,
    intro: doc.intro?.trim() || MODEL_DEFAULTS.intro,
  };
}

function serializeModel(doc: ModelDoc): AdminModel {
  return {
    id: String(doc._id),
    slug: doc.slug,
    name: doc.name,
    division: doc.division,
    divisionLabel: DIVISION_LABELS[doc.division] ?? doc.division,
    images: doc.images,
    cover: doc.images[0] ?? "",
    createdAt:
      doc.createdAt instanceof Date
        ? doc.createdAt.toISOString()
        : String(doc.createdAt),
    ...modelInfo(doc),
  };
}

function serializeWork(doc: WorkDoc): AdminWork {
  return {
    id: String(doc._id),
    slug: doc.slug,
    credit: doc.credit,
    client: doc.client,
    model: doc.model,
    year: doc.year,
    location: doc.location,
    images: doc.images,
    cover: doc.images[0] ?? "",
    createdAt:
      doc.createdAt instanceof Date
        ? doc.createdAt.toISOString()
        : String(doc.createdAt),
  };
}

// ── Reserved-area reads (surface errors to the operator) ─────────────────

export async function listModels(): Promise<AdminModel[]> {
  const col = await models();
  const docs = await col.find({}).sort({ createdAt: -1 }).toArray();
  return docs.map(serializeModel);
}

export async function listWorks(): Promise<AdminWork[]> {
  const col = await works();
  const docs = await col.find({}).sort({ createdAt: -1 }).toArray();
  return docs.map(serializeWork);
}

// ── Reserved-area mutations ──────────────────────────────────────────────

export async function createModel(input: {
  name: string;
  division: AdminDivision;
  images: string[];
} & Partial<ModelInfo>): Promise<void> {
  const col = await models();
  await col.insertOne({
    slug: uniqueSlug(input.name),
    name: input.name.trim(),
    division: input.division,
    images: input.images,
    createdAt: new Date(),
    ...modelInfo(input),
  });
}

/** Single model by id, for the reserved-area edit view. */
export async function getAdminModel(id: string): Promise<AdminModel | null> {
  if (!ObjectId.isValid(id)) return null;
  const col = await models();
  const doc = await col.findOne({ _id: new ObjectId(id) });
  return doc ? serializeModel(doc) : null;
}

export async function updateModel(
  id: string,
  input: {
    name: string;
    division: AdminDivision;
    images: string[];
  } & Partial<ModelInfo>,
): Promise<void> {
  if (!ObjectId.isValid(id)) return;
  const col = await models();
  await col.updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        name: input.name.trim(),
        division: input.division,
        images: input.images,
        updatedAt: new Date(),
        ...modelInfo(input),
      },
    },
  );
}

export async function deleteModel(id: string): Promise<void> {
  if (!ObjectId.isValid(id)) return;
  const col = await models();
  await col.deleteOne({ _id: new ObjectId(id) });
}

export async function createWork(input: {
  credit: string;
  client: string;
  model: string;
  year: string;
  location: string;
  images: string[];
}): Promise<void> {
  const col = await works();
  await col.insertOne({
    slug: uniqueSlug(input.credit),
    credit: input.credit.trim(),
    client: input.client.trim(),
    model: input.model.trim(),
    year: input.year.trim(),
    location: input.location.trim(),
    images: input.images,
    createdAt: new Date(),
  });
}

export async function deleteWork(id: string): Promise<void> {
  if (!ObjectId.isValid(id)) return;
  const col = await works();
  await col.deleteOne({ _id: new ObjectId(id) });
}

// ── Public-site reads (fail soft to the static seed) ─────────────────────

function toModelCard(doc: ModelDoc): ModelCard {
  return {
    name: doc.name,
    slug: doc.slug,
    img: doc.images[0] ?? "",
    portfolio: doc.images,
  };
}

export type PublicBoard = Record<BoardKey, ModelCard[]>;

/** The board is built entirely from uploaded models, per division. */
export async function getPublicBoard(): Promise<PublicBoard> {
  const board: PublicBoard = { lei: [], lui: [], kids: [] };
  try {
    const col = await models();
    const docs = await col.find({}).sort({ createdAt: 1 }).toArray();
    for (const doc of docs) {
      (board[doc.division] ??= []).push(toModelCard(doc));
    }
  } catch {
    // Mongo unavailable — serve an empty board rather than crash.
  }
  return board;
}

/** Uploaded works first (newest), then the static seed archive. */
export async function getPublicWorks(): Promise<WorkItem[]> {
  try {
    const col = await works();
    const docs = await col.find({}).sort({ createdAt: -1 }).toArray();
    const uploaded: WorkItem[] = docs.map((doc) => ({
      slug: doc.slug,
      model: doc.model,
      client: doc.client,
      credit: doc.credit,
      year: doc.year,
      location: doc.location,
      images: doc.images,
    }));
    return [...uploaded, ...WORK_INDEX];
  } catch {
    return [...WORK_INDEX];
  }
}

function toUploadedModel(doc: ModelDoc): UploadedModel {
  return {
    ...toModelCard(doc),
    division: doc.division,
    divisionLabel: DIVISION_LABELS[doc.division] ?? doc.division,
    uploaded: true,
    ...modelInfo(doc),
  };
}

export async function getUploadedModel(
  slug: string,
): Promise<UploadedModel | null> {
  try {
    const col = await models();
    const doc = await col.findOne({ slug });
    if (!doc) return null;
    return toUploadedModel(doc);
  } catch {
    return null;
  }
}

// Roster display order: Lei, then Lui, then Kids; oldest-first within a
// division (matches the board and the seeded order).
const DIVISION_ORDER: AdminDivision[] = ["lei", "lui", "kids"];

export interface ModelPage {
  model: UploadedModel;
  prev: UploadedModel;
  next: UploadedModel;
  index: number;
  total: number;
}

/**
 * Full model view for the public detail page: the model plus its wrap-around
 * neighbours and position in the roster — all resolved from the database.
 * Returns null when the slug is unknown or Mongo is unreachable.
 */
export async function getModelPage(slug: string): Promise<ModelPage | null> {
  try {
    const col = await models();
    const docs = await col.find({}).toArray();
    docs.sort((a, b) => {
      const d =
        DIVISION_ORDER.indexOf(a.division) - DIVISION_ORDER.indexOf(b.division);
      if (d !== 0) return d;
      const at = a.createdAt instanceof Date ? a.createdAt.getTime() : 0;
      const bt = b.createdAt instanceof Date ? b.createdAt.getTime() : 0;
      return at - bt;
    });
    const list = docs.map(toUploadedModel);
    const i = list.findIndex((m) => m.slug === slug);
    if (i === -1) return null;
    const n = list.length;
    return {
      model: list[i],
      prev: list[(i - 1 + n) % n],
      next: list[(i + 1) % n],
      index: i + 1,
      total: n,
    };
  } catch {
    return null;
  }
}

export async function getUploadedWork(
  slug: string,
): Promise<UploadedWork | null> {
  try {
    const col = await works();
    const doc = await col.findOne({ slug });
    if (!doc) return null;
    return {
      slug: doc.slug,
      model: doc.model,
      client: doc.client,
      credit: doc.credit,
      year: doc.year,
      location: doc.location,
      images: doc.images,
      uploaded: true,
    };
  } catch {
    return null;
  }
}
