"use client";

import { useState } from "react";
import {
  Field,
  TextInput,
  TextArea,
  Consent,
  SubmitButton,
  SuccessPanel,
} from "./Fields";

/**
 * Client / booking request — the "scheda madre" request form from the real
 * site, rebuilt for the dark #richiesta section. Presentation build: submit
 * resolves to an on-page confirmation, no backend. */
export default function ClientRequestForm() {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <SuccessPanel
        title="Ricevuto. Ti proponiamo una selezione mirata."
        body="Leggiamo ogni richiesta e rispondiamo con i profili giusti per il capo, la campagna o la sfilata, di norma entro un giorno lavorativo."
      />
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
      className="grid gap-x-8 gap-y-7 sm:grid-cols-2"
    >
      <Field label="Nome" htmlFor="cr-nome">
        <TextInput id="cr-nome" name="nome" autoComplete="given-name" required />
      </Field>
      <Field label="Cognome" htmlFor="cr-cognome">
        <TextInput
          id="cr-cognome"
          name="cognome"
          autoComplete="family-name"
          required
        />
      </Field>

      <Field label="Azienda" htmlFor="cr-azienda">
        <TextInput
          id="cr-azienda"
          name="azienda"
          autoComplete="organization"
          required
        />
      </Field>
      <Field label="Città" htmlFor="cr-citta">
        <TextInput id="cr-citta" name="citta" required />
      </Field>

      <Field label="Email" htmlFor="cr-email">
        <TextInput
          id="cr-email"
          name="email"
          type="email"
          autoComplete="email"
          required
        />
      </Field>
      <Field label="Telefono" htmlFor="cr-tel">
        <TextInput id="cr-tel" name="telefono" type="tel" autoComplete="tel" />
      </Field>

      <Field label="La tua richiesta" htmlFor="cr-msg" className="sm:col-span-2">
        <TextArea
          id="cr-msg"
          name="richiesta"
          rows={4}
          placeholder="Descrivi il progetto: capo, tipo di ingaggio, date, sede."
          required
        />
      </Field>

      <div className="sm:col-span-2">
        <Consent id="cr-consenso" />
      </div>

      <div className="pt-2 sm:col-span-2">
        <SubmitButton tone="dark">Invia la richiesta</SubmitButton>
      </div>
    </form>
  );
}
