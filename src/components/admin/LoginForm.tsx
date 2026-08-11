"use client";

import { useActionState } from "react";
import { loginAction, type FormState } from "@/app/riservato/actions";

export default function LoginForm({ from }: { from?: string }) {
  const [state, action, pending] = useActionState<FormState, FormData>(
    loginAction,
    {},
  );

  return (
    <form action={action} className="flex flex-col gap-7">
      {from ? <input type="hidden" name="from" value={from} /> : null}

      <div className="field">
        <label htmlFor="password" className="field-label">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          autoFocus
          required
          className="field-input"
        />
      </div>

      {state.error ? (
        <p role="alert" className="text-[0.8rem] text-accent">
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="group inline-flex w-full items-center justify-between gap-3 bg-ink px-7 py-4 text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-paper transition-colors duration-300 hover:bg-accent disabled:opacity-60"
      >
        {pending ? "Accesso…" : "Entra"}
        <span className="transition-transform duration-300 group-hover:translate-x-1">
          →
        </span>
      </button>
    </form>
  );
}
