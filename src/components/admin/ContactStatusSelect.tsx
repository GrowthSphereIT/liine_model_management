"use client";

import { useState } from "react";
import {
  toggleApplicationHandledAction,
  toggleRequestHandledAction,
} from "@/app/riservato/contacts-actions";

/**
 * Editable status for a contact row — a dropdown that submits the toggle
 * Server Action on change. Values map to the `handled` flag ("false" = Nuovo,
 * "true" = Gestito); "Nuovo" is highlighted in the accent so pending contacts
 * stand out at a glance.
 */
export default function ContactStatusSelect({
  id,
  kind,
  handled,
}: {
  id: string;
  kind: "application" | "request";
  handled: boolean;
}) {
  const action =
    kind === "application"
      ? toggleApplicationHandledAction
      : toggleRequestHandledAction;
  const [value, setValue] = useState(handled ? "true" : "false");
  const isNew = value === "false";

  return (
    <form action={action}>
      <input type="hidden" name="id" value={id} />
      <select
        name="handled"
        value={value}
        aria-label="Stato del contatto"
        onChange={(e) => {
          setValue(e.target.value);
          e.currentTarget.form?.requestSubmit();
        }}
        className={`cursor-pointer appearance-none border bg-paper py-1 pl-2 pr-6 text-[0.6rem] uppercase tracking-[0.16em] transition-colors duration-300 focus:outline-none ${
          isNew
            ? "border-accent/50 text-accent"
            : "border-line text-ink-faint hover:border-ink"
        }`}
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 8 8'%3E%3Cpath d='M1 2.5L4 5.5L7 2.5' fill='none' stroke='%23999' stroke-width='1.2'/%3E%3C/svg%3E\")",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 0.5rem center",
        }}
      >
        <option value="false">Nuovo</option>
        <option value="true">Gestito</option>
      </select>
    </form>
  );
}
