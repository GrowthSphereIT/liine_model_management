"use server";

import { revalidatePath } from "next/cache";
import { isAuthenticated } from "@/lib/auth";
import { filesToDataUrls } from "@/lib/uploads";
import {
  createApplication,
  createRequest,
  deleteApplication,
  deleteRequest,
  setApplicationHandled,
  setRequestHandled,
} from "@/lib/contacts-data";

export type FormState = { error?: string; ok?: boolean };

const s = (formData: FormData, key: string) =>
  String(formData.get(key) ?? "").trim();

// ── Public submissions ─────────────────────────────────────────────────────

export async function submitApplicationAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const nome = s(formData, "nome");
  const cognome = s(formData, "cognome");
  const email = s(formData, "email");

  if (!nome || !cognome) return { error: "Nome e cognome sono obbligatori." };
  if (!email) return { error: "L'email è obbligatoria." };
  if (!formData.get("consenso")) {
    return { error: "È necessario acconsentire al trattamento dei dati." };
  }

  try {
    const images = await filesToDataUrls(formData.getAll("immagini") as File[]);
    await createApplication({
      nome,
      cognome,
      genere: s(formData, "genere"),
      dataNascita: s(formData, "data_nascita"),
      paeseNascita: s(formData, "paese_nascita"),
      citta: s(formData, "citta"),
      altezza: s(formData, "altezza"),
      seno: s(formData, "circ_seno"),
      vita: s(formData, "circ_vita"),
      bacino: s(formData, "circ_bacino"),
      scarpe: s(formData, "scarpe_eu"),
      indirizzo: s(formData, "indirizzo"),
      email,
      telefono: s(formData, "telefono"),
      whatsapp: s(formData, "whatsapp"),
      images,
    });
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Invio non riuscito, riprova.",
    };
  }

  revalidatePath("/riservato/casting");
  return { ok: true };
}

export async function submitRequestAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const nome = s(formData, "nome");
  const cognome = s(formData, "cognome");
  const email = s(formData, "email");
  const richiesta = s(formData, "richiesta");

  if (!nome || !cognome) return { error: "Nome e cognome sono obbligatori." };
  if (!email) return { error: "L'email è obbligatoria." };
  if (!richiesta) return { error: "Descrivi la tua richiesta." };
  if (!formData.get("consenso")) {
    return { error: "È necessario acconsentire al trattamento dei dati." };
  }

  try {
    await createRequest({
      nome,
      cognome,
      azienda: s(formData, "azienda"),
      citta: s(formData, "citta"),
      email,
      telefono: s(formData, "telefono"),
      richiesta,
    });
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Invio non riuscito, riprova.",
    };
  }

  revalidatePath("/riservato/clienti");
  return { ok: true };
}

// ── Reserved-area management ────────────────────────────────────────────────

export async function toggleApplicationHandledAction(
  formData: FormData,
): Promise<void> {
  if (!(await isAuthenticated())) return;
  await setApplicationHandled(
    String(formData.get("id") ?? ""),
    formData.get("handled") === "true",
  );
  revalidatePath("/riservato/casting");
}

export async function deleteApplicationAction(
  formData: FormData,
): Promise<void> {
  if (!(await isAuthenticated())) return;
  await deleteApplication(String(formData.get("id") ?? ""));
  revalidatePath("/riservato/casting");
}

export async function toggleRequestHandledAction(
  formData: FormData,
): Promise<void> {
  if (!(await isAuthenticated())) return;
  await setRequestHandled(
    String(formData.get("id") ?? ""),
    formData.get("handled") === "true",
  );
  revalidatePath("/riservato/clienti");
}

export async function deleteRequestAction(formData: FormData): Promise<void> {
  if (!(await isAuthenticated())) return;
  await deleteRequest(String(formData.get("id") ?? ""));
  revalidatePath("/riservato/clienti");
}
