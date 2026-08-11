"use client";

import { deleteModelAction, deleteWorkAction } from "@/app/riservato/actions";

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
        className="text-[0.5625rem] uppercase tracking-[0.24em] text-ink-faint transition-colors duration-300 hover:text-accent"
      >
        Elimina
      </button>
    </form>
  );
}
