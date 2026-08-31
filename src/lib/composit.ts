/**
 * Client-side composit (comp card) generator.
 *
 * Produces print-ready PDFs from a model's photos + measurements, in the two
 * formats the agency asked for:
 *   • "digital" — a single landscape page with front (left) and back (right)
 *     side by side.
 *   • "print"   — a 2-page portrait PDF split exactly in half: page 1 = front
 *     (cover), page 2 = back (card), so a front/back print lines up perfectly.
 */

// ── Layout (mm) — each face is A5 portrait; digital is two faces wide ───────
const FACE_W = 148;
const FACE_H = 210;
const MARGIN = 10;

// Both faces share one identical photo rectangle (same position + size) so the
// front and back line up, and one logo width so the mark matches on both.
const PHOTO_TOP = 30;
const PHOTO_H = 152;
const PHOTO_W = FACE_W - MARGIN * 2;
const LOGO_W = 34;

// Agency contact line reproduced on the back (from the reference composit).
export const COMPOSIT_CONTACT =
  "it +39 345 5297546 · fr +33 750681734 · info@liinemodelmanagement.com";

export type CompositMode = "digital" | "print";

export interface CompositData {
  name: string;
  height?: string;
  bust?: string;
  waist?: string;
  hips?: string;
  shoes?: string;
  hair?: string;
  eyes?: string;
  /** URL or data URL for the front (cover) photo. */
  frontImage: string;
  /** URL or data URL for the back (card) photo. */
  backImage: string;
}

type MeasureKey = "height" | "bust" | "waist" | "hips" | "shoes" | "hair" | "eyes";

const MEASURES: { key: MeasureKey; it: string; en: string }[] = [
  { key: "height", it: "Altezza", en: "Height" },
  { key: "bust", it: "Seno", en: "Bust" },
  { key: "waist", it: "Vita", en: "Waist" },
  { key: "hips", it: "Fianchi", en: "Hips" },
  { key: "shoes", it: "Scarpe", en: "Shoes" },
  { key: "hair", it: "Capelli", en: "Hair" },
  { key: "eyes", it: "Occhi", en: "Eyes" },
];

/**
 * Eye colours offered in the composit generator. Each is a stable `value`
 * (what the select stores) plus its Italian and English labels. The generator
 * stores `value`, but older model records hold a free-typed Italian label, so
 * {@link translateColor} also matches on the label text.
 */
export const EYE_COLORS: { value: string; it: string; en: string }[] = [
  { value: "marroni", it: "Marroni", en: "Brown" },
  { value: "castani", it: "Castani", en: "Brown" },
  { value: "nocciola", it: "Nocciola", en: "Hazel" },
  { value: "verdi", it: "Verdi", en: "Green" },
  { value: "azzurri", it: "Azzurri", en: "Blue" },
  { value: "celesti", it: "Celesti", en: "Blue" },
  { value: "grigi", it: "Grigi", en: "Gray" },
  { value: "ambra", it: "Ambra", en: "Amber" },
  { value: "neri", it: "Neri", en: "Black" },
];

/**
 * Hair colours offered in the composit generator — same shape as
 * {@link EYE_COLORS}: a stable `value` plus Italian and English labels. Shown
 * in a select; the generator stores `value`, and {@link translateColor} also
 * matches on the labels so older, free-typed records keep translating.
 */
export const HAIR_COLORS: { value: string; it: string; en: string }[] = [
  { value: "biondi", it: "Biondi", en: "Blonde" },
  { value: "biondo-chiaro", it: "Biondo chiaro", en: "Light blonde" },
  { value: "biondo-scuro", it: "Biondo scuro", en: "Dark blonde" },
  { value: "castano-chiaro", it: "Castano chiaro", en: "Light brown" },
  { value: "castani", it: "Castani", en: "Brown" },
  { value: "castano-scuro", it: "Castano scuro", en: "Dark brown" },
  { value: "ramati", it: "Ramati", en: "Auburn" },
  { value: "rossi", it: "Rossi", en: "Red" },
  { value: "neri", it: "Neri", en: "Black" },
  { value: "grigi", it: "Grigi", en: "Gray" },
  { value: "brizzolati", it: "Brizzolati", en: "Salt & pepper" },
  { value: "bianchi", it: "Bianchi", en: "White" },
  { value: "platino", it: "Platino", en: "Platinum" },
];

// Legacy free-typed hair labels (older records used singular masculine forms
// and "mori"). Kept for translation only — not offered in the select.
const HAIR_COLOR_ALIASES: { it: string; en: string }[] = [
  { it: "biondo", en: "Blonde" },
  { it: "castano", en: "Brown" },
  { it: "castano chiaro", en: "Light brown" },
  { it: "castano scuro", en: "Dark brown" },
  { it: "nero", en: "Black" },
  { it: "moro", en: "Dark brown" },
  { it: "mori", en: "Dark brown" },
  { it: "rosso", en: "Red" },
  { it: "rame", en: "Auburn" },
  { it: "ramato", en: "Auburn" },
];

// Full lookup for hair (select values + labels + legacy aliases).
const HAIR_LOOKUP = [...HAIR_COLORS, ...HAIR_COLOR_ALIASES];

type Locale = "it" | "en";

function parseMetric(v: string): number | null {
  // Accept Italian decimals ("36,5") and stray unit text.
  const n = parseFloat(v.replace(",", ".").replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : null;
}

// 177 cm → 5'10" (height keeps the ' and " marks).
function heightImperial(cm: number): string {
  const total = Math.round(cm / 2.54);
  return `${Math.floor(total / 12)}'${total % 12}"`;
}

// cm → inches to the nearest HALF, rendered "33" / "24½" (no inch mark, as on
// the reference composit).
function inchesHalf(cm: number): string {
  const halves = Math.round((cm / 2.54) * 2) / 2;
  const whole = Math.floor(halves);
  return `${whole}${halves - whole ? "½" : ""}`;
}

// EU women's shoe → US half size, comma decimal ("7,5"), per the agency's
// reference card (EU 39 → US 7,5). Adjust the offset here if their chart changes.
function euShoeToUs(eu: number): string {
  const us = Math.round((eu - 31.5) * 2) / 2;
  return String(us).replace(".", ",");
}

function translateColor(
  raw: string,
  locale: Locale,
  table: { it: string; en: string; value?: string }[],
): string {
  const key = raw.trim().toLowerCase();
  const hit = table.find(
    (c) => c.value === key || c.it.toLowerCase() === key || c.en.toLowerCase() === key,
  );
  if (!hit) return raw; // unknown / free text — leave as typed
  return locale === "en" ? hit.en : hit.it;
}

// English hair/eyes read "Blonde Hair" / "Blue Eyes" (colour before the noun),
// unlike the numeric rows which stay "Label value".
const COLOR_KEYS: ReadonlySet<MeasureKey> = new Set(["hair", "eyes"]);

function localizedValue(key: MeasureKey, raw: string, locale: Locale): string {
  if (locale === "it") {
    // Eyes and hair come from a select key ("celesti", "biondo-chiaro") → its
    // Italian label; the numeric measures are kept exactly as entered.
    if (key === "eyes") return translateColor(raw, "it", EYE_COLORS);
    if (key === "hair") return translateColor(raw, "it", HAIR_LOOKUP);
    return raw;
  }
  const cm = parseMetric(raw);
  switch (key) {
    case "height":
      return cm ? heightImperial(cm) : raw;
    case "bust":
    case "waist":
    case "hips":
      return cm ? inchesHalf(cm) : raw;
    case "shoes":
      return cm ? euShoeToUs(cm) : raw;
    case "eyes":
      return translateColor(raw, "en", EYE_COLORS);
    case "hair":
      return translateColor(raw, "en", HAIR_LOOKUP);
  }
}

function measureLine(data: Partial<CompositData>, locale: Locale): string {
  const parts: string[] = [];
  for (const m of MEASURES) {
    const raw = data[m.key]?.trim();
    if (!raw) continue;
    const label = locale === "en" ? m.en : m.it;
    const value = localizedValue(m.key, raw, locale);
    parts.push(
      locale === "en" && COLOR_KEYS.has(m.key)
        ? `${value} ${label}` // "Blonde Hair", "Blue Eyes"
        : `${label} ${value}`,
    );
  }
  return parts.join("  ·  ");
}

/**
 * Both measure lines for a composit — Italian (metric / EU) and English
 * (imperial, US shoe size, translated colours), formatted like the agency's
 * reference card. Shared by the PDF and the on-screen preview so they agree.
 */
export function compositMeasureLines(data: Partial<CompositData>): {
  it: string;
  en: string;
} {
  return { it: measureLine(data, "it"), en: measureLine(data, "en") };
}

function slugify(input: string): string {
  return (
    input
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "composit"
  );
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Immagine non caricata: ${src}`));
    img.src = src;
  });
}

// Crop-to-cover a photo into a JPEG data URL at print resolution, keeping the
// top of the frame (faces sit high in portrait stills).
async function coverJpeg(
  src: string,
  wMm: number,
  hMm: number,
  bg = "#e9e6e1",
): Promise<string> {
  const img = await loadImage(src);
  const dpi = 300;
  const wpx = Math.max(1, Math.round((wMm / 25.4) * dpi));
  const hpx = Math.max(1, Math.round((hMm / 25.4) * dpi));
  const canvas = document.createElement("canvas");
  canvas.width = wpx;
  canvas.height = hpx;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas non disponibile.");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, wpx, hpx);

  const imgRatio = img.width / img.height;
  const boxRatio = wpx / hpx;
  let dw: number, dh: number, dx: number, dy: number;
  if (imgRatio > boxRatio) {
    // Wider than the box — full height, centered horizontally.
    dh = hpx;
    dw = hpx * imgRatio;
    dx = (wpx - dw) / 2;
    dy = 0;
  } else {
    // Taller than the box — full width, aligned to the top.
    dw = wpx;
    dh = wpx / imgRatio;
    dx = 0;
    dy = 0;
  }
  ctx.drawImage(img, dx, dy, dw, dh);
  return canvas.toDataURL("image/jpeg", 0.92);
}

type Pdf = import("jspdf").jsPDF;
type Rgb = [number, number, number];

export type CompositTheme = "light" | "dark";

interface Palette {
  bg: Rgb;
  text: Rgb;
  textSoft: Rgb;
  textFaint: Rgb;
  line: Rgb;
  logo: string;
  photoBg: string;
}

const PALETTES: Record<CompositTheme, Palette> = {
  light: {
    bg: [255, 255, 255],
    text: [20, 18, 16],
    textSoft: [120, 115, 108],
    textFaint: [150, 145, 138],
    line: [210, 205, 198],
    logo: "/logos/logo-liine-nero.webp",
    photoBg: "#e9e6e1",
  },
  dark: {
    bg: [15, 13, 11],
    text: [244, 241, 235],
    textSoft: [178, 172, 164],
    textFaint: [120, 116, 110],
    line: [70, 66, 60],
    logo: "/logos/logo-liine-bianco.webp",
    photoBg: "#141210",
  },
};

// LIINE wordmark, cached per source (black on light, white on dark) as a PNG
// data URL so jsPDF embeds it with transparency intact.
const logoCache: Record<string, Promise<{ url: string; ratio: number }>> = {};

function getLogo(src: string): Promise<{ url: string; ratio: number }> {
  if (!logoCache[src]) {
    logoCache[src] = (async () => {
      const img = await loadImage(src);
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas non disponibile.");
      ctx.drawImage(img, 0, 0);
      return { url: canvas.toDataURL("image/png"), ratio: img.width / img.height };
    })();
  }
  return logoCache[src];
}

async function drawLogo(
  pdf: Pdf,
  cx: number,
  centerY: number,
  widthMm: number,
  pal: Palette,
) {
  const { url, ratio } = await getLogo(pal.logo);
  const w = widthMm;
  const h = widthMm / ratio;
  pdf.addImage(url, "PNG", cx - w / 2, centerY - h / 2, w, h);
}

async function drawFront(pdf: Pdf, ox: number, data: CompositData, pal: Palette) {
  const cx = ox + FACE_W / 2;
  await drawLogo(pdf, cx, 15, LOGO_W, pal);

  const px = ox + MARGIN;
  const photo = await coverJpeg(data.frontImage, PHOTO_W, PHOTO_H, pal.photoBg);
  pdf.addImage(photo, "JPEG", px, PHOTO_TOP, PHOTO_W, PHOTO_H);

  pdf.setFont("times", "normal");
  pdf.setFontSize(15);
  pdf.setTextColor(...pal.text);
  pdf.setCharSpace(0.6);
  pdf.text((data.name || "").toUpperCase(), cx, 198, {
    align: "center",
  });
  pdf.setCharSpace(0);
}

async function drawBack(pdf: Pdf, ox: number, data: CompositData, pal: Palette) {
  const cx = ox + FACE_W / 2;
  const { it, en } = compositMeasureLines(data);

  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(...pal.text);
  if (it) {
    pdf.setFontSize(7);
    pdf.text(it, cx, 13, { align: "center" });
    pdf.setFontSize(6);
    pdf.setTextColor(...pal.textSoft);
    pdf.text(en, cx, 17.4, { align: "center" });
    pdf.setTextColor(...pal.text);
  }

  const px = ox + MARGIN;
  const photo = await coverJpeg(data.backImage, PHOTO_W, PHOTO_H, pal.photoBg);
  pdf.addImage(photo, "JPEG", px, PHOTO_TOP, PHOTO_W, PHOTO_H);

  await drawLogo(pdf, cx, 191, LOGO_W, pal);

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(5.6);
  pdf.setTextColor(...pal.textSoft);
  pdf.text(COMPOSIT_CONTACT, cx, FACE_H - 8, { align: "center" });
  pdf.setTextColor(...pal.text);
}

/**
 * Builds and downloads the composit PDF for the given data, format and theme.
 * Runs entirely in the browser — no upload, no server round-trip.
 */
export async function downloadComposit(
  data: CompositData,
  mode: CompositMode,
  theme: CompositTheme = "light",
): Promise<void> {
  if (!data.frontImage || !data.backImage) {
    throw new Error("Servono due foto: una per il fronte e una per il retro.");
  }
  const pal = PALETTES[theme];
  const suffix = theme === "dark" ? "-scuro" : "";
  const { jsPDF } = await import("jspdf");

  if (mode === "digital") {
    const pdf = new jsPDF({
      unit: "mm",
      format: [FACE_W * 2, FACE_H],
      orientation: "landscape",
    });
    pdf.setFillColor(...pal.bg);
    pdf.rect(0, 0, FACE_W * 2, FACE_H, "F");
    await drawFront(pdf, 0, data, pal);
    await drawBack(pdf, FACE_W, data, pal);
    // Fold hairline between the two faces.
    pdf.setDrawColor(...pal.line);
    pdf.setLineWidth(0.1);
    pdf.line(FACE_W, 6, FACE_W, FACE_H - 6);
    pdf.save(`composit-${slugify(data.name)}-digitale${suffix}.pdf`);
    return;
  }

  const pdf = new jsPDF({
    unit: "mm",
    format: [FACE_W, FACE_H],
    orientation: "portrait",
  });
  pdf.setFillColor(...pal.bg);
  pdf.rect(0, 0, FACE_W, FACE_H, "F");
  await drawFront(pdf, 0, data, pal);
  pdf.addPage([FACE_W, FACE_H], "portrait");
  pdf.setFillColor(...pal.bg);
  pdf.rect(0, 0, FACE_W, FACE_H, "F");
  await drawBack(pdf, 0, data, pal);
  pdf.save(`composit-${slugify(data.name)}-stampa${suffix}.pdf`);
}
