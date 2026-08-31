"use client";

import { useRef, useState, useTransition } from "react";
import CompositPreview from "./CompositPreview";
import {
  downloadComposit,
  EYE_COLORS,
  type CompositMode,
  type CompositTheme,
} from "@/lib/composit";
import type { AdminComposit } from "@/lib/composit-data";
import {
  createCompositAction,
  updateCompositAction,
  type CompositFormState,
} from "@/app/riservato/composit-actions";

// Text fields entered in metric (cm) / EU sizes; the English line on the card
// is converted automatically. Eyes are a separate select (see below).
const MEASURE_FIELDS: { key: MeasureKey; label: string; ph: string }[] = [
  { key: "height", label: "Altezza", ph: "178" },
  { key: "bust", label: "Seno", ph: "81" },
  { key: "waist", label: "Vita", ph: "61" },
  { key: "hips", label: "Fianchi", ph: "89" },
  { key: "shoes", label: "Scarpe", ph: "36,5" },
  { key: "hair", label: "Capelli", ph: "Biondi" },
];

type MeasureKey = "height" | "bust" | "waist" | "hips" | "shoes" | "hair" | "eyes";
type Measures = Record<MeasureKey, string>;

const EMPTY: Measures = {
  height: "",
  bust: "",
  waist: "",
  hips: "",
  shoes: "",
  hair: "",
  eyes: "",
};

function measuresFrom(c?: AdminComposit): Measures {
  if (!c) return EMPTY;
  return {
    height: c.height,
    bust: c.bust,
    waist: c.waist,
    hips: c.hips,
    shoes: c.shoes,
    hair: c.hair,
    eyes: c.eyes,
  };
}

function PhotoInput({
  label,
  url,
  onPick,
}: {
  label: string;
  url?: string;
  onPick: (file: File | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="field">
      <span className="field-label">{label}</span>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="relative flex aspect-[3/4] w-full items-center justify-center overflow-hidden border border-dashed border-line-strong bg-paper-2 text-[0.7rem] uppercase tracking-[0.2em] text-ink-faint transition-colors hover:border-accent hover:text-ink"
      >
        {url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt={label} className="h-full w-full object-cover object-top" />
        ) : (
          "Carica foto"
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => onPick(e.target.files?.[0] ?? null)}
      />
    </div>
  );
}

export default function CompositStudio({
  initial,
}: {
  /** When present the studio edits an existing composit instead of creating one. */
  initial?: AdminComposit;
}) {
  const isEdit = Boolean(initial);
  const [name, setName] = useState(initial?.name ?? "");
  const [measures, setMeasures] = useState<Measures>(measuresFrom(initial));
  const [frontFile, setFrontFile] = useState<File | null>(null);
  const [backFile, setBackFile] = useState<File | null>(null);
  const [frontUrl, setFrontUrl] = useState<string | undefined>(initial?.frontUrl);
  const [backUrl, setBackUrl] = useState<string | undefined>(initial?.backUrl);
  const [theme, setTheme] = useState<CompositTheme>(initial?.theme ?? "light");
  const [busy, setBusy] = useState<CompositMode | null>(null);
  const [error, setError] = useState<string>();
  const [saveState, setSaveState] = useState<CompositFormState>({});
  const [saving, startSave] = useTransition();

  function pick(
    setFile: (f: File | null) => void,
    setUrl: (u?: string) => void,
    current: string | undefined,
    fallback: string | undefined,
  ) {
    return (file: File | null) => {
      if (current?.startsWith("blob:")) URL.revokeObjectURL(current);
      setFile(file);
      setUrl(file ? URL.createObjectURL(file) : fallback);
    };
  }

  async function generate(mode: CompositMode) {
    setError(undefined);
    if (!frontUrl || !backUrl) {
      setError("Carica una foto per il fronte e una per il retro.");
      return;
    }
    setBusy(mode);
    try {
      await downloadComposit(
        { name, ...measures, frontImage: frontUrl, backImage: backUrl },
        mode,
        theme,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generazione non riuscita.");
    } finally {
      setBusy(null);
    }
  }

  function save() {
    setSaveState({});
    if (!isEdit && (!frontFile || !backFile)) {
      setSaveState({ error: "Carica due foto (fronte e retro) per salvare." });
      return;
    }
    const fd = new FormData();
    fd.set("name", name);
    fd.set("theme", theme);
    for (const [k, v] of Object.entries(measures)) fd.set(k, v);
    if (frontFile) fd.set("front", frontFile);
    if (backFile) fd.set("back", backFile);

    startSave(async () => {
      if (isEdit && initial) {
        fd.set("id", initial.id);
        // On success updateCompositAction redirects; it only returns on error.
        const res = await updateCompositAction({}, fd);
        if (res?.error) setSaveState(res);
      } else {
        const res = await createCompositAction({}, fd);
        setSaveState(res);
        if (res.ok) {
          setName("");
          setMeasures(EMPTY);
          if (frontUrl?.startsWith("blob:")) URL.revokeObjectURL(frontUrl);
          if (backUrl?.startsWith("blob:")) URL.revokeObjectURL(backUrl);
          setFrontFile(null);
          setBackFile(null);
          setFrontUrl(undefined);
          setBackUrl(undefined);
        }
      }
    });
  }

  return (
    <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
      {/* Inputs */}
      <div className="flex flex-col gap-7 lg:col-span-5">
        <div className="field" data-tour="composit-name">
          <label htmlFor="composit-name" className="field-label">
            Nome
          </label>
          <input
            id="composit-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="off"
            placeholder="Emma Maria B."
            className="field-input"
          />
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-6" data-tour="composit-photos">
          <PhotoInput
            label="Foto fronte"
            url={frontUrl}
            onPick={pick(setFrontFile, setFrontUrl, frontUrl, initial?.frontUrl)}
          />
          <PhotoInput
            label="Foto retro"
            url={backUrl}
            onPick={pick(setBackFile, setBackUrl, backUrl, initial?.backUrl)}
          />
        </div>

        <fieldset className="border-t border-line pt-7" data-tour="composit-misure">
          <legend className="field-label mb-4">Misure</legend>
          <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3">
            {MEASURE_FIELDS.map((f) => (
              <div key={f.key} className="field">
                <label htmlFor={`composit-${f.key}`} className="field-label">
                  {f.label}
                </label>
                <input
                  id={`composit-${f.key}`}
                  value={measures[f.key]}
                  onChange={(e) =>
                    setMeasures((m) => ({ ...m, [f.key]: e.target.value }))
                  }
                  autoComplete="off"
                  placeholder={f.ph}
                  className="field-input"
                />
              </div>
            ))}
            <div className="field">
              <label htmlFor="composit-eyes" className="field-label">
                Occhi
              </label>
              <select
                id="composit-eyes"
                value={measures.eyes}
                onChange={(e) =>
                  setMeasures((m) => ({ ...m, eyes: e.target.value }))
                }
                className="field-input"
              >
                <option value="">—</option>
                {EYE_COLORS.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.it}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <p className="mt-4 text-[0.72rem] leading-relaxed text-ink-soft">
            Inserisci i valori in cm ed EU. Il composit stampa entrambe le lingue:
            la riga inglese converte in automatico (pollici, taglia scarpe US,
            colori tradotti).
          </p>
        </fieldset>

        <div className="flex items-center gap-3" data-tour="composit-theme">
          <span className="field-label">Colore</span>
          <div className="seg">
            <button
              type="button"
              onClick={() => setTheme("light")}
              className={`seg-opt ${theme === "light" ? "border-accent bg-accent text-paper" : ""}`}
            >
              Chiaro
            </button>
            <button
              type="button"
              onClick={() => setTheme("dark")}
              className={`seg-opt ${theme === "dark" ? "border-ink bg-ink text-paper" : ""}`}
            >
              Scuro
            </button>
          </div>
        </div>

        {/* Save to database */}
        <div className="flex flex-col gap-2 border-t border-line pt-7">
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="group inline-flex items-center justify-between gap-3 bg-accent px-6 py-4 text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-paper transition-colors duration-300 hover:bg-ink disabled:opacity-60"
          >
            {saving
              ? "Salvataggio…"
              : isEdit
                ? "Aggiorna composit"
                : "Salva composit"}
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </button>
          {saveState.error ? (
            <p role="alert" className="text-[0.8rem] text-accent">
              {saveState.error}
            </p>
          ) : null}
          {saveState.ok ? (
            <p role="status" className="text-[0.8rem] text-ink-soft">
              Composit salvato. Lo trovi nella tabella qui sotto.
            </p>
          ) : null}
          {isEdit ? (
            <p className="text-[0.72rem] leading-relaxed text-ink-soft">
              Lascia vuota una foto per mantenere quella attuale.
            </p>
          ) : null}
        </div>

        {error ? (
          <p role="alert" className="text-[0.8rem] text-accent">
            {error}
          </p>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row" data-tour="composit-actions">
          <button
            type="button"
            onClick={() => generate("digital")}
            disabled={busy !== null}
            className="group inline-flex flex-1 items-center justify-between gap-3 bg-ink px-6 py-4 text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-paper transition-colors duration-300 hover:bg-accent disabled:opacity-60"
          >
            {busy === "digital" ? "Genero…" : "PDF digitale"}
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              ↓
            </span>
          </button>
          <button
            type="button"
            onClick={() => generate("print")}
            disabled={busy !== null}
            className="group inline-flex flex-1 items-center justify-between gap-3 border border-ink px-6 py-4 text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-ink transition-colors duration-300 hover:border-accent hover:text-accent disabled:opacity-60"
          >
            {busy === "print" ? "Genero…" : "PDF stampa"}
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              ↓
            </span>
          </button>
        </div>
        <p className="text-[0.72rem] leading-relaxed text-ink-soft">
          <strong className="font-medium text-ink">Digitale</strong>: un unico
          file orizzontale (fronte + retro affiancati).{" "}
          <strong className="font-medium text-ink">Stampa</strong>: PDF a 2
          pagine (pag. 1 = fronte, pag. 2 = retro) pronto per la stampa
          fronte/retro.
        </p>
      </div>

      {/* Preview */}
      <div className="lg:col-span-7" data-tour="composit-preview">
        <p className="field-label mb-4">Anteprima</p>
        <CompositPreview
          data={{ name, ...measures, frontImage: frontUrl, backImage: backUrl }}
          theme={theme}
        />
      </div>
    </div>
  );
}
