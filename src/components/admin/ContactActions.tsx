"use client";

import {
  deleteApplicationAction,
  deleteRequestAction,
} from "@/app/riservato/contacts-actions";
import { TrashIcon } from "./icons";

/**
 * Delete control for a contact row — a compact trash icon. Native form posting
 * a Server Action; the confirm() gate is client-side convenience, the auth
 * check is server-side.
 */
export default function ContactActions({
  id,
  kind,
  label,
}: {
  id: string;
  kind: "application" | "request";
  label: string;
}) {
  const remove =
    kind === "application" ? deleteApplicationAction : deleteRequestAction;

  return (
    <form
      action={remove}
      className="flex justify-end"
      data-tour="contact-actions"
      onSubmit={(e) => {
        if (!confirm(`Eliminare il contatto di "${label}"? Non è reversibile.`)) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        aria-label={`Elimina il contatto di ${label}`}
        title="Elimina"
        className="grid place-items-center p-1 text-[1rem] text-ink-faint transition-colors duration-300 hover:text-accent"
      >
        <TrashIcon />
      </button>
    </form>
  );
}
