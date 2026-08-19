"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { createWorkAction, type FormState } from "@/app/riservato/actions";
import ImagePicker from "./ImagePicker";

export default function WorkForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(
    createWorkAction,
    {},
  );
  const formRef = useRef<HTMLFormElement>(null);
  const [resetSignal, setResetSignal] = useState(0);

  useEffect(() => {
    if (state.ok) {
      formRef.current?.reset();
      setResetSignal((n) => n + 1);
    }
  }, [state]);

  return (
    <form
      ref={formRef}
      action={action}
      className="grid gap-x-8 gap-y-7 sm:grid-cols-2"
    >
      <div className="field sm:col-span-2">
        <label htmlFor="work-credit" className="field-label">
          Titolo / Credito
        </label>
        <input
          id="work-credit"
          name="credit"
          required
          autoComplete="off"
          placeholder="Campagna FW26"
          className="field-input"
        />
      </div>

      <div className="field">
        <label htmlFor="work-client" className="field-label">
          Cliente
        </label>
        <input id="work-client" name="client" autoComplete="off" className="field-input" />
      </div>
      <div className="field">
        <label htmlFor="work-model" className="field-label">
          Modello
        </label>
        <input id="work-model" name="model" autoComplete="off" className="field-input" />
      </div>

      <div className="field">
        <label htmlFor="work-year" className="field-label">
          Anno
        </label>
        <input
          id="work-year"
          name="year"
          inputMode="numeric"
          autoComplete="off"
          placeholder="2026"
          className="field-input"
        />
      </div>
      <div className="field">
        <label htmlFor="work-location" className="field-label">
          Sede
        </label>
        <input
          id="work-location"
          name="location"
          autoComplete="off"
          placeholder="Milano"
          className="field-input"
        />
      </div>

      <div className="sm:col-span-2">
        <span className="field-label">Immagini</span>
        <ImagePicker key={resetSignal} />
      </div>

      {state.error ? (
        <p role="alert" className="text-[0.8rem] text-accent sm:col-span-2">
          {state.error}
        </p>
      ) : null}
      {state.ok ? (
        <p role="status" className="text-[0.8rem] text-ink-soft sm:col-span-2">
          Lavoro aggiunto all&apos;indice.
        </p>
      ) : null}

      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={pending}
          className="group inline-flex w-full items-center justify-between gap-3 bg-ink px-7 py-4 text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-paper transition-colors duration-300 hover:bg-accent disabled:opacity-60 sm:w-fit"
        >
          {pending ? "Salvataggio…" : "Aggiungi lavoro"}
          <span className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </button>
      </div>
    </form>
  );
}
