"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { createModelAction, type FormState } from "@/app/riservato/actions";
import ImagePicker from "./ImagePicker";

const DIVISIONS = [
  { value: "lei", label: "Lei" },
  { value: "lui", label: "Lui" },
  { value: "kids", label: "Kids" },
] as const;

export default function ModelForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(
    createModelAction,
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
    <form ref={formRef} action={action} className="flex flex-col gap-7">
      <div className="field">
        <label htmlFor="model-name" className="field-label">
          Nome
        </label>
        <input
          id="model-name"
          name="name"
          required
          autoComplete="off"
          className="field-input"
        />
      </div>

      <fieldset>
        <span className="field-label">Divisione</span>
        <div className="seg">
          {DIVISIONS.map((d, i) => (
            <label key={d.value}>
              <input
                type="radio"
                name="division"
                value={d.value}
                defaultChecked={i === 0}
                className="sr-only"
              />
              <span className="seg-opt">{d.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <span className="field-label">Immagini</span>
        <ImagePicker resetSignal={resetSignal} />
      </div>

      {state.error ? (
        <p role="alert" className="text-[0.8rem] text-accent">
          {state.error}
        </p>
      ) : null}
      {state.ok ? (
        <p role="status" className="text-[0.8rem] text-ink-soft">
          Modello aggiunto al board.
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="group inline-flex w-full items-center justify-between gap-3 bg-ink px-7 py-4 text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-paper transition-colors duration-300 hover:bg-accent disabled:opacity-60 sm:w-fit"
      >
        {pending ? "Salvataggio…" : "Aggiungi modello"}
        <span className="transition-transform duration-300 group-hover:translate-x-1">
          →
        </span>
      </button>
    </form>
  );
}
