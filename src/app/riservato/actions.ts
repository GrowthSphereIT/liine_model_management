"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { checkPassword, createSession, destroySession, isAuthenticated } from "@/lib/auth";
import {
  createModel,
  createWork,
  deleteModel,
  deleteWork,
  getAdminModel,
  updateModel,
  type AdminDivision,
  type ModelInfo,
} from "@/lib/admin-data";

export type FormState = { error?: string; ok?: boolean };

const DIVISIONS: AdminDivision[] = ["lei", "lui", "kids"];
const MAX_FILES = 8;
const MAX_FILE_BYTES = 6 * 1024 * 1024; // 6MB per image

async function filesToDataUrls(files: File[]): Promise<string[]> {
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
function moveToFront<T>(list: T[], index: number): T[] {
  if (!Number.isInteger(index) || index <= 0 || index >= list.length) {
    return list;
  }
  const copy = [...list];
  const [picked] = copy.splice(index, 1);
  return [picked, ...copy];
}

/** Reads the editable detail-page info fields shared by create and update. */
function readModelInfo(formData: FormData): Partial<ModelInfo> {
  return {
    location: String(formData.get("location") ?? ""),
    status: String(formData.get("status") ?? ""),
    agency: String(formData.get("agency") ?? ""),
    availability: String(formData.get("availability") ?? ""),
    casting: String(formData.get("casting") ?? ""),
    intro: String(formData.get("intro") ?? ""),
  };
}

// ── Auth ─────────────────────────────────────────────────────────────────

export async function loginAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const password = String(formData.get("password") ?? "");
  if (!checkPassword(password)) {
    return { error: "Password non valida." };
  }
  await createSession();

  const from = String(formData.get("from") ?? "");
  const dest = from.startsWith("/riservato") ? from : "/riservato";
  redirect(dest);
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/riservato/login");
}

// ── Models ───────────────────────────────────────────────────────────────

export async function createModelAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  if (!(await isAuthenticated())) return { error: "Sessione scaduta." };

  const name = String(formData.get("name") ?? "").trim();
  const division = String(formData.get("division") ?? "") as AdminDivision;

  if (!name) return { error: "Il nome è obbligatorio." };
  if (!DIVISIONS.includes(division)) return { error: "Divisione non valida." };

  try {
    const uploaded = await filesToDataUrls(formData.getAll("images") as File[]);
    if (uploaded.length === 0) return { error: "Carica almeno un'immagine." };
    const cover = Number(formData.get("cover") ?? 0);
    const images = moveToFront(uploaded, cover);
    await createModel({ name, division, images, ...readModelInfo(formData) });
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Salvataggio non riuscito.",
    };
  }

  revalidatePath("/riservato/modelli");
  revalidatePath("/");
  return { ok: true };
}

/**
 * Edits an existing model. Image handling is index-based so the (potentially
 * large) stored data URLs never round-trip through the browser: the client
 * sends which existing images to keep, which one is the cover, and only the
 * newly added files as multipart.
 */
export async function updateModelAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  if (!(await isAuthenticated())) return { error: "Sessione scaduta." };

  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const division = String(formData.get("division") ?? "") as AdminDivision;

  if (!name) return { error: "Il nome è obbligatorio." };
  if (!DIVISIONS.includes(division)) return { error: "Divisione non valida." };

  const existing = await getAdminModel(id);
  if (!existing) return { error: "Modello non trovato." };

  const removed = parseIndexSet(formData.get("remove"));
  const kept = existing.images.filter((_, i) => !removed.has(i));
  const cover = String(formData.get("cover") ?? ""); // "existing:<i>" | "new:<i>"

  try {
    const added = await filesToDataUrls(formData.getAll("images") as File[]);

    let images: string[];
    const [kind, rawIdx] = cover.split(":");
    const idx = Number(rawIdx);
    if (kind === "new" && added[idx]) {
      images = [added[idx], ...kept, ...added.filter((_, k) => k !== idx)];
    } else if (kind === "existing" && existing.images[idx] && !removed.has(idx)) {
      const coverUrl = existing.images[idx];
      images = [coverUrl, ...kept.filter((u) => u !== coverUrl), ...added];
    } else {
      images = [...kept, ...added];
    }

    if (images.length === 0) {
      return { error: "Il modello deve avere almeno un'immagine." };
    }
    await updateModel(id, {
      name,
      division,
      images,
      ...readModelInfo(formData),
    });
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Salvataggio non riuscito.",
    };
  }

  revalidatePath("/riservato/modelli");
  revalidatePath(`/riservato/modelli/${id}`);
  revalidatePath("/");
  revalidatePath(`/modelli/${existing.slug}`);
  redirect("/riservato/modelli");
}

/** Parses a JSON array of integer indices (from a hidden form field). */
function parseIndexSet(value: FormDataEntryValue | null): Set<number> {
  try {
    const parsed = JSON.parse(String(value ?? "[]"));
    if (!Array.isArray(parsed)) return new Set();
    return new Set(parsed.filter((n) => Number.isInteger(n)) as number[]);
  } catch {
    return new Set();
  }
}

export async function deleteModelAction(formData: FormData): Promise<void> {
  if (!(await isAuthenticated())) return;
  const id = String(formData.get("id") ?? "");
  await deleteModel(id);
  revalidatePath("/riservato/modelli");
  revalidatePath("/");
}

// ── Works ────────────────────────────────────────────────────────────────

export async function createWorkAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  if (!(await isAuthenticated())) return { error: "Sessione scaduta." };

  const credit = String(formData.get("credit") ?? "").trim();
  const client = String(formData.get("client") ?? "").trim();
  const model = String(formData.get("model") ?? "").trim();
  const year = String(formData.get("year") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();

  if (!credit) return { error: "Il titolo del lavoro è obbligatorio." };

  try {
    const uploaded = await filesToDataUrls(formData.getAll("images") as File[]);
    if (uploaded.length === 0) return { error: "Carica almeno un'immagine." };
    const images = moveToFront(uploaded, Number(formData.get("cover") ?? 0));
    await createWork({ credit, client, model, year, location, images });
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Salvataggio non riuscito.",
    };
  }

  revalidatePath("/riservato/lavori");
  revalidatePath("/");
  return { ok: true };
}

export async function deleteWorkAction(formData: FormData): Promise<void> {
  if (!(await isAuthenticated())) return;
  const id = String(formData.get("id") ?? "");
  await deleteWork(id);
  revalidatePath("/riservato/lavori");
  revalidatePath("/");
}
