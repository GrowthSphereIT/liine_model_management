"use client";

import { useActionState, useRef, useState } from "react";
import {
  submitApplicationAction,
  type FormState,
} from "@/app/riservato/contacts-actions";
import {
  Field,
  TextInput,
  Consent,
  SubmitButton,
  SuccessPanel,
} from "./Fields";

const GENERI = ["Femmina", "Maschio", "Non binario"] as const;

/**
 * Open-casting application — the "farsi notare" form. Submissions are persisted
 * to MongoDB and managed from the reserved area (/riservato/casting).
 */
export default function ApplicationForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(
    submitApplicationAction,
    {},
  );
  const [files, setFiles] = useState<string[]>([]);
  const fileInput = useRef<HTMLInputElement | null>(null);

  if (state.ok) {
    return (
      <SuccessPanel
        title="Grazie, la tua candidatura è arrivata."
        body="Il team casting valuta ogni profilo sulla vestibilità, non solo sui numeri. Se c'è un fit, ti ricontattiamo per il book completo."
      />
    );
  }

  return (
    <form action={action} className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
      <Field label="Nome" htmlFor="ap-nome">
        <TextInput id="ap-nome" name="nome" autoComplete="given-name" required />
      </Field>
      <Field label="Cognome" htmlFor="ap-cognome">
        <TextInput
          id="ap-cognome"
          name="cognome"
          autoComplete="family-name"
          required
        />
      </Field>

      <fieldset className="sm:col-span-2">
        <span className="field-label">Genere</span>
        <div className="seg">
          {GENERI.map((g) => (
            <label key={g}>
              <input
                type="radio"
                name="genere"
                value={g}
                required
                className="sr-only"
              />
              <span className="seg-opt">{g}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <Field label="Data di nascita" htmlFor="ap-nascita">
        <TextInput id="ap-nascita" name="data_nascita" type="date" required />
      </Field>
      <Field label="Paese di nascita" htmlFor="ap-paese">
        <TextInput id="ap-paese" name="paese_nascita" required />
      </Field>

      <Field label="Città di base" htmlFor="ap-citta">
        <TextInput id="ap-citta" name="citta" required />
      </Field>
      <Field label="Altezza" hint="cm" htmlFor="ap-altezza">
        <TextInput
          id="ap-altezza"
          name="altezza"
          type="number"
          min={140}
          max={210}
          inputMode="numeric"
          required
        />
      </Field>

      <div className="grid grid-cols-3 gap-x-4 gap-y-7 sm:col-span-2">
        <Field label="Seno / Torace" hint="cm" htmlFor="ap-seno">
          <TextInput
            id="ap-seno"
            name="circ_seno"
            type="number"
            inputMode="numeric"
          />
        </Field>
        <Field label="Vita" hint="cm" htmlFor="ap-vita">
          <TextInput
            id="ap-vita"
            name="circ_vita"
            type="number"
            inputMode="numeric"
          />
        </Field>
        <Field label="Bacino" hint="cm" htmlFor="ap-bacino">
          <TextInput
            id="ap-bacino"
            name="circ_bacino"
            type="number"
            inputMode="numeric"
          />
        </Field>
      </div>

      <Field label="Numero di scarpe" hint="EU" htmlFor="ap-scarpe">
        <TextInput
          id="ap-scarpe"
          name="scarpe_eu"
          type="number"
          inputMode="numeric"
        />
      </Field>
      <Field label="Indirizzo" htmlFor="ap-indirizzo">
        <TextInput id="ap-indirizzo" name="indirizzo" autoComplete="street-address" />
      </Field>

      <Field label="Email" htmlFor="ap-email">
        <TextInput
          id="ap-email"
          name="email"
          type="email"
          autoComplete="email"
          required
        />
      </Field>
      <Field label="Numero di telefono" htmlFor="ap-tel">
        <TextInput
          id="ap-tel"
          name="telefono"
          type="tel"
          autoComplete="tel"
          required
        />
      </Field>

      <Field label="Numero WhatsApp" hint="facoltativo" htmlFor="ap-wa" className="sm:col-span-2">
        <TextInput id="ap-wa" name="whatsapp" type="tel" />
      </Field>

      <div className="sm:col-span-2">
        <span className="field-label">Immagini</span>
        <label className="dropzone">
          <span className="text-[0.8rem] leading-snug opacity-70">
            {files.length
              ? `${files.length} ${files.length === 1 ? "file selezionato" : "file selezionati"}`
              : "Carica 3–5 scatti: viso, figura intera, profilo"}
          </span>
          <span className="text-[0.5625rem] uppercase tracking-[0.24em] opacity-60">
            Sfoglia
          </span>
          <input
            ref={fileInput}
            type="file"
            name="immagini"
            accept="image/*"
            multiple
            className="sr-only"
            onChange={(e) =>
              setFiles(Array.from(e.target.files ?? []).map((f) => f.name))
            }
          />
        </label>
      </div>

      <div className="sm:col-span-2">
        <Consent id="ap-consenso" />
      </div>

      {state.error ? (
        <p role="alert" className="text-[0.8rem] text-accent sm:col-span-2">
          {state.error}
        </p>
      ) : null}

      <div className="pt-2 sm:col-span-2">
        <SubmitButton tone="dark" pending={pending}>
          Invia candidatura
        </SubmitButton>
      </div>
    </form>
  );
}
