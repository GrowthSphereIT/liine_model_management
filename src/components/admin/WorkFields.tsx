"use client";

/**
 * Shared editable fields for a work — core credits plus the free-text info
 * shown on the public detail page. Rendered inside a `sm:grid-cols-2` grid by
 * both the create and edit forms. Blank values coalesce to these defaults on
 * the server, which double as the placeholders here.
 */

// Kept in sync with WORK_DEFAULTS in src/lib/admin-data.ts (server-only).
const PLACEHOLDERS = {
  intro:
    "Un progetto dall'archivio LIINE: la selezione parte dal capo e da come cade sul corpo, non dalle misure standard.",
  photography: "Da confermare",
  styling: "Da confermare",
  castingCredit: "LIINE Model Management",
};

export interface WorkFieldValues {
  credit: string;
  client: string;
  model: string;
  year: string;
  location: string;
  intro: string;
  photography: string;
  styling: string;
  castingCredit: string;
}

export default function WorkFields({
  work,
}: {
  /** Existing values to prefill (edit mode). Omit for create. */
  work?: Partial<WorkFieldValues>;
}) {
  return (
    <>
      <div className="field sm:col-span-2">
        <label htmlFor="work-credit" className="field-label">
          Titolo / Credito
        </label>
        <input
          id="work-credit"
          name="credit"
          required
          autoComplete="off"
          defaultValue={work?.credit ?? ""}
          placeholder="Campagna FW26"
          className="field-input"
        />
      </div>

      <div className="field">
        <label htmlFor="work-client" className="field-label">
          Cliente
        </label>
        <input
          id="work-client"
          name="client"
          autoComplete="off"
          defaultValue={work?.client ?? ""}
          className="field-input"
        />
      </div>
      <div className="field">
        <label htmlFor="work-model" className="field-label">
          Modello
        </label>
        <input
          id="work-model"
          name="model"
          autoComplete="off"
          defaultValue={work?.model ?? ""}
          className="field-input"
        />
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
          defaultValue={work?.year ?? ""}
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
          defaultValue={work?.location ?? ""}
          placeholder="Milano"
          className="field-input"
        />
      </div>

      <fieldset className="mt-2 border-t border-line pt-7 sm:col-span-2">
        <legend className="field-label mb-5">Scheda pubblica</legend>
        <div className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
          <div className="field sm:col-span-2">
            <label htmlFor="work-intro" className="field-label">
              Presentazione
            </label>
            <textarea
              id="work-intro"
              name="intro"
              rows={4}
              defaultValue={work?.intro ?? ""}
              placeholder={PLACEHOLDERS.intro}
              className="field-input"
            />
          </div>
          <div className="field">
            <label htmlFor="work-photography" className="field-label">
              Fotografia
            </label>
            <input
              id="work-photography"
              name="photography"
              autoComplete="off"
              defaultValue={work?.photography ?? ""}
              placeholder={PLACEHOLDERS.photography}
              className="field-input"
            />
          </div>
          <div className="field">
            <label htmlFor="work-styling" className="field-label">
              Styling
            </label>
            <input
              id="work-styling"
              name="styling"
              autoComplete="off"
              defaultValue={work?.styling ?? ""}
              placeholder={PLACEHOLDERS.styling}
              className="field-input"
            />
          </div>
          <div className="field sm:col-span-2">
            <label htmlFor="work-castingCredit" className="field-label">
              Casting
            </label>
            <input
              id="work-castingCredit"
              name="castingCredit"
              autoComplete="off"
              defaultValue={work?.castingCredit ?? ""}
              placeholder={PLACEHOLDERS.castingCredit}
              className="field-input"
            />
          </div>
        </div>
      </fieldset>
    </>
  );
}
