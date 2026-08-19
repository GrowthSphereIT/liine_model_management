import { ObjectId, type Collection, type Document } from "mongodb";
import { getDb, COLLECTIONS } from "./mongodb";

/**
 * Contacts data layer for the reserved area: open-casting applications
 * (candidatura) and client/booking requests (richiesta). Public forms write
 * here; the reserved area lists, paginates and manages the submissions.
 */

// ── Document shapes ──────────────────────────────────────────────────────

interface ApplicationDoc extends Document {
  _id?: ObjectId;
  nome: string;
  cognome: string;
  genere: string;
  dataNascita: string;
  paeseNascita: string;
  citta: string;
  altezza: string;
  seno: string;
  vita: string;
  bacino: string;
  scarpe: string;
  indirizzo: string;
  email: string;
  telefono: string;
  whatsapp: string;
  /** Data URLs of the submitted photos. */
  images: string[];
  handled: boolean;
  createdAt: Date;
}

interface RequestDoc extends Document {
  _id?: ObjectId;
  nome: string;
  cognome: string;
  azienda: string;
  citta: string;
  email: string;
  telefono: string;
  richiesta: string;
  handled: boolean;
  createdAt: Date;
}

// ── Serialized (client-safe) shapes ──────────────────────────────────────

export interface AdminApplication {
  id: string;
  nome: string;
  cognome: string;
  genere: string;
  dataNascita: string;
  paeseNascita: string;
  citta: string;
  altezza: string;
  seno: string;
  vita: string;
  bacino: string;
  scarpe: string;
  indirizzo: string;
  email: string;
  telefono: string;
  whatsapp: string;
  images: string[];
  handled: boolean;
  createdAt: string;
}

export interface AdminRequest {
  id: string;
  nome: string;
  cognome: string;
  azienda: string;
  citta: string;
  email: string;
  telefono: string;
  richiesta: string;
  handled: boolean;
  createdAt: string;
}

export interface Page<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  pages: number;
}

export const CONTACTS_PAGE_SIZE = 12;

// ── Helpers ──────────────────────────────────────────────────────────────

async function applications(): Promise<Collection<ApplicationDoc>> {
  const db = await getDb();
  return db.collection<ApplicationDoc>(COLLECTIONS.applications);
}

async function requests(): Promise<Collection<RequestDoc>> {
  const db = await getDb();
  return db.collection<RequestDoc>(COLLECTIONS.requests);
}

function iso(value: Date | unknown): string {
  return value instanceof Date ? value.toISOString() : String(value ?? "");
}

function serializeApplication(doc: ApplicationDoc): AdminApplication {
  return {
    id: String(doc._id),
    nome: doc.nome ?? "",
    cognome: doc.cognome ?? "",
    genere: doc.genere ?? "",
    dataNascita: doc.dataNascita ?? "",
    paeseNascita: doc.paeseNascita ?? "",
    citta: doc.citta ?? "",
    altezza: doc.altezza ?? "",
    seno: doc.seno ?? "",
    vita: doc.vita ?? "",
    bacino: doc.bacino ?? "",
    scarpe: doc.scarpe ?? "",
    indirizzo: doc.indirizzo ?? "",
    email: doc.email ?? "",
    telefono: doc.telefono ?? "",
    whatsapp: doc.whatsapp ?? "",
    images: doc.images ?? [],
    handled: Boolean(doc.handled),
    createdAt: iso(doc.createdAt),
  };
}

function serializeRequest(doc: RequestDoc): AdminRequest {
  return {
    id: String(doc._id),
    nome: doc.nome ?? "",
    cognome: doc.cognome ?? "",
    azienda: doc.azienda ?? "",
    citta: doc.citta ?? "",
    email: doc.email ?? "",
    telefono: doc.telefono ?? "",
    richiesta: doc.richiesta ?? "",
    handled: Boolean(doc.handled),
    createdAt: iso(doc.createdAt),
  };
}

/** Clamp a 1-based page to the available range for a given total. */
function pageMeta(total: number, page: number, pageSize: number) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const current = Math.min(Math.max(1, Math.floor(page) || 1), pages);
  return { pages, current };
}

// ── Public writes ─────────────────────────────────────────────────────────

export type NewApplication = Omit<
  AdminApplication,
  "id" | "handled" | "createdAt"
>;
export type NewRequest = Omit<AdminRequest, "id" | "handled" | "createdAt">;

export async function createApplication(input: NewApplication): Promise<void> {
  const col = await applications();
  await col.insertOne({ ...input, handled: false, createdAt: new Date() });
}

export async function createRequest(input: NewRequest): Promise<void> {
  const col = await requests();
  await col.insertOne({ ...input, handled: false, createdAt: new Date() });
}

// ── Reserved-area reads (paginated, newest first) ──────────────────────────

export async function listApplications(
  page = 1,
  pageSize = CONTACTS_PAGE_SIZE,
): Promise<Page<AdminApplication>> {
  const col = await applications();
  const total = await col.countDocuments({});
  const { pages, current } = pageMeta(total, page, pageSize);
  const docs = await col
    .find({})
    .sort({ createdAt: -1 })
    .skip((current - 1) * pageSize)
    .limit(pageSize)
    .toArray();
  return {
    items: docs.map(serializeApplication),
    total,
    page: current,
    pageSize,
    pages,
  };
}

export async function listRequests(
  page = 1,
  pageSize = CONTACTS_PAGE_SIZE,
): Promise<Page<AdminRequest>> {
  const col = await requests();
  const total = await col.countDocuments({});
  const { pages, current } = pageMeta(total, page, pageSize);
  const docs = await col
    .find({})
    .sort({ createdAt: -1 })
    .skip((current - 1) * pageSize)
    .limit(pageSize)
    .toArray();
  return {
    items: docs.map(serializeRequest),
    total,
    page: current,
    pageSize,
    pages,
  };
}

/** Lightweight totals for the dashboard: total and still-new (unhandled). */
export async function countApplications(): Promise<{ total: number; nuovi: number }> {
  const col = await applications();
  const [total, nuovi] = await Promise.all([
    col.countDocuments({}),
    col.countDocuments({ handled: { $ne: true } }),
  ]);
  return { total, nuovi };
}

export async function countRequests(): Promise<{ total: number; nuovi: number }> {
  const col = await requests();
  const [total, nuovi] = await Promise.all([
    col.countDocuments({}),
    col.countDocuments({ handled: { $ne: true } }),
  ]);
  return { total, nuovi };
}

// ── Reserved-area mutations ────────────────────────────────────────────────

export async function setApplicationHandled(
  id: string,
  handled: boolean,
): Promise<void> {
  if (!ObjectId.isValid(id)) return;
  const col = await applications();
  await col.updateOne({ _id: new ObjectId(id) }, { $set: { handled } });
}

export async function deleteApplication(id: string): Promise<void> {
  if (!ObjectId.isValid(id)) return;
  const col = await applications();
  await col.deleteOne({ _id: new ObjectId(id) });
}

export async function setRequestHandled(
  id: string,
  handled: boolean,
): Promise<void> {
  if (!ObjectId.isValid(id)) return;
  const col = await requests();
  await col.updateOne({ _id: new ObjectId(id) }, { $set: { handled } });
}

export async function deleteRequest(id: string): Promise<void> {
  if (!ObjectId.isValid(id)) return;
  const col = await requests();
  await col.deleteOne({ _id: new ObjectId(id) });
}
