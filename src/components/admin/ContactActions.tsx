"use client";

import {
  deleteApplicationAction,
  deleteRequestAction,
  toggleApplicationHandledAction,
  toggleRequestHandledAction,
} from "@/app/riservato/contacts-actions";

/**
 * Per-row management for a contact: toggle its handled state and delete it.
 * Native forms posting Server Actions; the confirm() gate is a client-side
 * convenience, the auth check is server-side.
 */
export default function ContactActions({
  id,
  kind,
  handled,
  label,
}: {
  id: string;
  kind: "application" | "request";
  handled: boolean;
  label: string;
}) {
  const toggle =
    kind === "application"
      ? toggleApplicationHandledAction
      : toggleRequestHandledAction;
  const remove =
    kind === "application" ? deleteApplicationAction : deleteRequestAction;

  return (
    <div className="flex items-center justify-end gap-3 whitespace-nowrap">
      <form action={toggle}>
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="handled" value={handled ? "false" : "true"} />
        <button
          type="submit"
          className="text-[0.5625rem] uppercase tracking-[0.2em] text-ink-faint transition-colors duration-300 hover:text-ink"
        >
          {handled ? "Riapri" : "Gestito"}
        </button>
      </form>
      <span aria-hidden className="text-ink-faint/30">
        ·
      </span>
      <form
        action={remove}
        onSubmit={(e) => {
          if (!confirm(`Eliminare il contatto di "${label}"? Non è reversibile.`)) {
            e.preventDefault();
          }
        }}
      >
        <input type="hidden" name="id" value={id} />
        <button
          type="submit"
          className="text-[0.5625rem] uppercase tracking-[0.2em] text-ink-faint transition-colors duration-300 hover:text-accent"
        >
          Elimina
        </button>
      </form>
    </div>
  );
}
