"use client";

import { useRef, useState } from "react";
import CompositPreview from "./CompositPreview";
import {
  downloadComposit,
  type CompositMode,
  type CompositTheme,
} from "@/lib/composit";

const MEASURE_FIELDS: { key: MeasureKey; label: string; ph: string }[] = [
  { key: "height", label: "Altezza", ph: "178" },
  { key: "bust", label: "Seno", ph: "81" },
  { key: "waist", label: "Vita", ph: "61" },
  { key: "hips", label: "Fianchi", ph: "89" },
  { key: "shoes", label: "Scarpe", ph: "36,5" },
  { key: "hair", label: "Capelli", ph: "Biondi" },
  { key: "eyes", label: "Occhi", ph: "Nocciola" },
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

export default function CompositStudio() {
  const [name, setName] = useState("");
  const [measures, setMeasures] = useState<Measures>(EMPTY);
  const [frontUrl, setFrontUrl] = useState<string>();
  const [backUrl, setBackUrl] = useState<string>();
  const [theme, setTheme] = useState<CompositTheme>("light");
  const [busy, setBusy] = useState<CompositMode | null>(null);
  const [error, setError] = useState<string>();

  function pick(setter: (u?: string) => void, current?: string) {
    return (file: File | null) => {
      if (current) URL.revokeObjectURL(current);
      setter(file ? URL.createObjectURL(file) : undefined);
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

  return (
    <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
      {/* Inputs */}
      <div className="flex flex-col gap-7 lg:col-span-5">
        <div className="field">
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

        <div className="grid grid-cols-2 gap-x-4 gap-y-6">
          <PhotoInput label="Foto fronte" url={frontUrl} onPick={pick(setFrontUrl, frontUrl)} />
          <PhotoInput label="Foto retro" url={backUrl} onPick={pick(setBackUrl, backUrl)} />
        </div>

        <fieldset className="border-t border-line pt-7">
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
          </div>
        </fieldset>

        {error ? (
          <p role="alert" className="text-[0.8rem] text-accent">
            {error}
          </p>
        ) : null}

        <div className="flex items-center gap-3">
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

        <div className="flex flex-col gap-3 sm:flex-row">
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
      <div className="lg:col-span-7">
        <p className="field-label mb-4">Anteprima</p>
        <CompositPreview
          data={{ name, ...measures, frontImage: frontUrl, backImage: backUrl }}
          theme={theme}
        />
      </div>
    </div>
  );
}
