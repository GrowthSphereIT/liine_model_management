"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { createWorkAction, type FormState } from "@/app/riservato/actions";
import ImagePicker from "./ImagePicker";
import WorkFields from "./WorkFields";

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
      <WorkFields />

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
