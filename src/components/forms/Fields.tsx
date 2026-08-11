import type { ReactNode, InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

/**
 * Ground-adaptive form primitives. Everything inherits color via currentColor,
 * so the same field reads on the paper sections and on the dark ink sections.
 * The visual language (underline inputs, accent focus draw-in) lives in
 * globals.css under "Forms".
 */

export function Field({
  label,
  htmlFor,
  hint,
  className = "",
  children,
}: {
  label: string;
  htmlFor?: string;
  hint?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`field ${className}`}>
      <label htmlFor={htmlFor} className="field-label">
        {label}
        {hint ? <span className="opacity-55"> · {hint}</span> : null}
      </label>
      {children}
    </div>
  );
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  const { className = "", ...rest } = props;
  return <input {...rest} className={`field-input ${className}`} />;
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const { className = "", ...rest } = props;
  return <textarea {...rest} className={`field-input ${className}`} />;
}

export function SelectInput({
  children,
  className = "",
  ...rest
}: SelectHTMLAttributes<HTMLSelectElement> & { children: ReactNode }) {
  return (
    <div className="field-select">
      <select {...rest} className={`field-input ${className}`}>
        {children}
      </select>
    </div>
  );
}

export function SubmitButton({
  children,
  tone = "dark",
}: {
  children: ReactNode;
  /** dark = ink button on paper; light = paper button on ink */
  tone?: "dark" | "light";
}) {
  const base =
    tone === "dark"
      ? "bg-ink text-paper hover:bg-accent"
      : "bg-paper text-ink hover:bg-accent hover:text-paper";
  return (
    <button
      type="submit"
      className={`group inline-flex w-full items-center justify-between gap-3 px-7 py-4 text-[0.6875rem] font-medium uppercase tracking-[0.2em] transition-colors duration-300 sm:w-fit ${base}`}
    >
      {children}
      <span className="transition-transform duration-300 group-hover:translate-x-1">
        →
      </span>
    </button>
  );
}

export function SuccessPanel({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <div
      className="flex flex-col items-start gap-4 border-t border-current/20 pt-8"
      style={{ animation: "liine-reveal .8s var(--ease-out-quint) both" }}
      role="status"
      aria-live="polite"
    >
      <span className="text-[0.5625rem] uppercase tracking-[0.28em] opacity-60">
        Inviato
      </span>
      <p className="u-display max-w-2xl text-[clamp(1.6rem,4vw,2.6rem)] leading-[0.98]">
        {title}
      </p>
      <p className="max-w-md text-[0.95rem] leading-relaxed opacity-70">{body}</p>
    </div>
  );
}

export function Consent({
  id,
  name = "consenso",
}: {
  id: string;
  name?: string;
}) {
  return (
    <label
      htmlFor={id}
      className="group flex cursor-pointer items-start gap-3 text-[0.75rem] leading-relaxed opacity-70"
    >
      <input
        id={id}
        name={name}
        type="checkbox"
        required
        className="peer sr-only"
      />
      <span
        aria-hidden
        className="mt-[0.15rem] grid h-4 w-4 shrink-0 place-items-center border border-current/40 transition-colors duration-300 after:h-1.5 after:w-1.5 after:scale-0 after:bg-paper after:transition-transform after:duration-300 after:content-[''] peer-checked:border-accent peer-checked:bg-accent peer-checked:after:scale-100 peer-focus-visible:border-current"
      />
      <span>
        Acconsento al trattamento dei dati secondo la privacy policy, ai soli
        fini della valutazione della candidatura o richiesta.
      </span>
    </label>
  );
}
