import type { Metadata } from "next";
import FormLayout from "@/components/forms/FormLayout";
import ClientRequestForm from "@/components/forms/ClientRequestForm";

export const metadata: Metadata = {
  title: "Richiesta clienti: prenota i modelli",
  description:
    "Campagne, sfilate, editoriali o fitting couture: descrivi il progetto e LIINE Model Management propone una selezione mirata di modelli, di norma entro un giorno lavorativo.",
  keywords: [
    "prenotare modelli",
    "booking modelli",
    "agenzia di modelli",
    "fitting",
    "showroom",
    "campagne moda",
    "sfilate",
    "LIINE",
  ],
  alternates: { canonical: "/richiesta" },
  openGraph: {
    type: "website",
    url: "/richiesta",
    title: "Richiesta clienti · LIINE Model Management",
    description:
      "Descrivi il progetto e ricevi una selezione mirata di modelli per campagne, sfilate, editoriali e fitting couture.",
  },
};

export default async function RichiestaPage({
  searchParams,
}: {
  searchParams: Promise<{ modello?: string }>;
}) {
  const { modello } = await searchParams;
  const preselected = modello?.trim() || undefined;

  return (
    <FormLayout
      eyebrow="Richiesta clienti"
      titleLines={["Raccontaci", "il capo."]}
      intro="Campagne, sfilate, editoriali o fitting couture: descrivi il progetto e ti proponiamo una selezione mirata, di norma entro un giorno lavorativo."
      backHref="/#richiesta"
      backLabel="Richiesta"
      aside={
        <div className="flex flex-col gap-6 text-[0.9rem] leading-relaxed text-ink-soft">
          <div className="border-t border-line pt-5">
            <p className="u-eyebrow mb-2">Ingaggi</p>
            <p>Campagne · Sfilate · Editoriali · Fitting couture · E-commerce.</p>
          </div>
          <div className="border-t border-line pt-5">
            <p className="u-eyebrow mb-2">Selezione</p>
            <p>
              Partiamo dal capo e da come cade sul corpo, non dalle misure
              standard.
            </p>
          </div>
          <div className="border-t border-line pt-5">
            <p className="u-eyebrow mb-2">Sede</p>
            <p>Londra · disponibilità su richiesta, tutto l&apos;anno.</p>
          </div>
        </div>
      }
    >
      <ClientRequestForm model={preselected} />
    </FormLayout>
  );
}
