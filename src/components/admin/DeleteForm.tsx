"use client";

import { deleteModelAction, deleteWorkAction } from "@/app/riservato/actions";
import { TrashIcon } from "./icons";

/**
 * Inline delete control. Uses a native form posting a Server Action; the
 * confirm() gate is client-side convenience, the auth check is server-side.
 */
export default function DeleteForm({
  id,
  kind,
  label,
}: {
  id: string;
  kind: "model" | "work";
  label: string;
}) {
  const action = kind === "model" ? deleteModelAction : deleteWorkAction;
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(`Eliminare "${label}"? L'operazione non è reversibile.`)) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        aria-label={`Elimina ${label}`}
        title="Elimina"
        className="grid place-items-center p-1 text-[0.95rem] text-ink-faint transition-colors duration-300 hover:text-accent"
      >
        <TrashIcon />
      </button>
    </form>
  );
}
