"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { putImage } from "@/lib/storage";
import { MAX_FILE_BYTES } from "@/lib/uploads";
import {
  COMPOSIT_MEASURE_KEYS,
  createComposit,
  deleteComposit,
  getComposit,
  updateComposit,
  type CompositMeasures,
} from "@/lib/composit-data";
import type { CompositTheme } from "@/lib/composit";

export type CompositFormState = { error?: string; ok?: boolean };

function readMeasures(fd: FormData): CompositMeasures {
  const out = {} as CompositMeasures;
  for (const k of COMPOSIT_MEASURE_KEYS) out[k] = String(fd.get(k) ?? "");
  return out;
}

function readTheme(fd: FormData): CompositTheme {
  return String(fd.get("theme")) === "dark" ? "dark" : "light";
}

/** Validates and stores one photo, returning its object key (or null if none). */
async function uploadPhoto(file: File | null): Promise<string | null> {
  if (!file || file.size === 0) return null;
  if (!file.type.startsWith("image/")) {
    throw new Error("Sono ammesse solo immagini.");
  }
  if (file.size > MAX_FILE_BYTES) {
    throw new Error("Ogni immagine deve pesare meno di 6MB.");
  }
  const buffer = Buffer.from(await file.arrayBuffer());
  return putImage(buffer, file.type);
}

export async function createCompositAction(
  _prev: CompositFormState,
  formData: FormData,
): Promise<CompositFormState> {
  if (!(await isAuthenticated())) return { error: "Sessione scaduta." };

  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { error: "Il nome è obbligatorio." };

  try {
    const frontKey = await uploadPhoto(formData.get("front") as File | null);
    const backKey = await uploadPhoto(formData.get("back") as File | null);
    if (!frontKey || !backKey) {
      return { error: "Servono due foto: una per il fronte e una per il retro." };
    }
    await createComposit({
      name,
      theme: readTheme(formData),
      frontKey,
      backKey,
      ...readMeasures(formData),
    });
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Salvataggio non riuscito.",
    };
  }

  revalidatePath("/riservato/composit");
  return { ok: true };
}

export async function updateCompositAction(
  _prev: CompositFormState,
  formData: FormData,
): Promise<CompositFormState> {
  if (!(await isAuthenticated())) return { error: "Sessione scaduta." };

  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { error: "Il nome è obbligatorio." };

  const existing = await getComposit(id);
  if (!existing) return { error: "Composit non trovato." };

  try {
    const frontKey = await uploadPhoto(formData.get("front") as File | null);
    const backKey = await uploadPhoto(formData.get("back") as File | null);
    await updateComposit(id, {
      name,
      theme: readTheme(formData),
      ...(frontKey ? { frontKey } : {}),
      ...(backKey ? { backKey } : {}),
      ...readMeasures(formData),
    });
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Salvataggio non riuscito.",
    };
  }

  revalidatePath("/riservato/composit");
  revalidatePath(`/riservato/composit/${id}`);
  redirect("/riservato/composit");
}

export async function deleteCompositAction(formData: FormData): Promise<void> {
  if (!(await isAuthenticated())) return;
  await deleteComposit(String(formData.get("id") ?? ""));
  revalidatePath("/riservato/composit");
}
