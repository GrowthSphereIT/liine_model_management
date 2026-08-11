"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { checkPassword, createSession, destroySession, isAuthenticated } from "@/lib/auth";
import {
  createModel,
  createWork,
  deleteModel,
  deleteWork,
  type AdminDivision,
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
    const images = await filesToDataUrls(formData.getAll("images") as File[]);
    if (images.length === 0) return { error: "Carica almeno un'immagine." };
    await createModel({ name, division, images });
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Salvataggio non riuscito.",
    };
  }

  revalidatePath("/riservato/modelli");
  revalidatePath("/");
  return { ok: true };
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
    const images = await filesToDataUrls(formData.getAll("images") as File[]);
    if (images.length === 0) return { error: "Carica almeno un'immagine." };
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
