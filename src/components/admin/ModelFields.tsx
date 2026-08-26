"use client";

/**
 * Shared editable fields for a model — name, division, and the free-text info
 * shown on the public detail page. Used by both the create and edit forms.
 * When a value is left blank the server coalesces it to these same defaults,
 * which double as the input placeholders here.
 */

const DIVISIONS = [
  { value: "lei", label: "Lei" },
  { value: "lui", label: "Lui" },
  { value: "kids", label: "Kids" },
] as const;

// Kept in sync with MODEL_DEFAULTS in src/lib/admin-data.ts (server-only).
const PLACEHOLDERS = {
  status: "In roster",
  location: "Londra",
  agency: "LIINE Model Management",
  availability: "Su richiesta",
  casting: "Aperto tutto l'anno",
  intro:
    "Rappresentanza per campagne, sfilate, editoriali e fitting couture. La selezione parte dal capo e da come cade sul corpo, non dalle misure standard.",
};

export interface ModelFieldValues {
  name: string;
  division: string;
  status: string;
  location: string;
  agency: string;
  availability: string;
  casting: string;
  intro: string;
  height: string;
  bust: string;
  waist: string;
  hips: string;
  shoes: string;
  hair: string;
  eyes: string;
}

const INFO_ROWS: { name: keyof typeof PLACEHOLDERS; label: string }[] = [
  { name: "status", label: "Stato" },
  { name: "location", label: "Sede" },
  { name: "agency", label: "Agenzia" },
  { name: "availability", label: "Disponibilità" },
  { name: "casting", label: "Casting" },
];

// Misure usate per generare i composit (non mostrate sulla scheda pubblica).
const MEASURE_ROWS: { name: keyof ModelFieldValues; label: string; ph: string }[] =
  [
    { name: "height", label: "Altezza", ph: "178" },
    { name: "bust", label: "Seno", ph: "81" },
    { name: "waist", label: "Vita", ph: "61" },
    { name: "hips", label: "Fianchi", ph: "89" },
    { name: "shoes", label: "Scarpe", ph: "36,5" },
    { name: "hair", label: "Capelli", ph: "Biondi" },
    { name: "eyes", label: "Occhi", ph: "Nocciola" },
  ];

export default function ModelFields({
  model,
}: {
  /** Existing values to prefill (edit mode). Omit for create. */
  model?: Partial<ModelFieldValues>;
}) {
  const division = model?.division ?? "lei";

  return (
    <div className="flex flex-col gap-7">
      <div className="field" data-tour="model-name">
        <label htmlFor="model-name" className="field-label">
          Nome
        </label>
        <input
          id="model-name"
          name="name"
          required
          autoComplete="off"
          defaultValue={model?.name ?? ""}
          className="field-input"
        />
      </div>

      <fieldset data-tour="model-division">
        <span className="field-label">Divisione</span>
        <div className="seg">
          {DIVISIONS.map((d) => (
            <label key={d.value}>
              <input
                type="radio"
                name="division"
                value={d.value}
                defaultChecked={division === d.value}
                className="sr-only"
              />
              <span className="seg-opt">{d.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-7 border-t border-line pt-7">
        <legend className="field-label mb-1">Scheda pubblica</legend>

        {INFO_ROWS.map((row) => (
          <div key={row.name} className="field">
            <label htmlFor={`model-${row.name}`} className="field-label">
              {row.label}
            </label>
            <input
              id={`model-${row.name}`}
              name={row.name}
              autoComplete="off"
              defaultValue={model?.[row.name] ?? ""}
              placeholder={PLACEHOLDERS[row.name]}
              className="field-input"
            />
          </div>
        ))}

        <div className="field">
          <label htmlFor="model-intro" className="field-label">
            Presentazione
          </label>
          <textarea
            id="model-intro"
            name="intro"
            rows={4}
            defaultValue={model?.intro ?? ""}
            placeholder={PLACEHOLDERS.intro}
            className="field-input"
          />
        </div>
      </fieldset>

      <fieldset className="border-t border-line pt-7" data-tour="model-misure">
        <legend className="field-label mb-1">Misure (composit)</legend>
        <p className="mb-5 max-w-sm text-[0.75rem] leading-relaxed text-ink-soft">
          Usate solo per generare il composit. Lascia vuoto ciò che non serve.
        </p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3">
          {MEASURE_ROWS.map((row) => (
            <div key={row.name} className="field">
              <label htmlFor={`model-${row.name}`} className="field-label">
                {row.label}
              </label>
              <input
                id={`model-${row.name}`}
                name={row.name}
                autoComplete="off"
                defaultValue={model?.[row.name] ?? ""}
                placeholder={row.ph}
                className="field-input"
              />
            </div>
          ))}
        </div>
      </fieldset>
    </div>
  );
}
