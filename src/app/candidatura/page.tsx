import type { Metadata } from "next";
import FormLayout from "@/components/forms/FormLayout";
import ApplicationForm from "@/components/forms/ApplicationForm";

export const metadata: Metadata = {
  title: "Candidatura · Casting aperto · LIINE",
  description:
    "Casting aperto tutto l'anno di LIINE Model Management. Inviaci nome, contatti, misure e alcuni scatti: valutiamo ogni profilo sulla vestibilità.",
};

export default function CandidaturaPage() {
  return (
    <FormLayout
      eyebrow="Casting aperto"
      titleLines={["Fatti", "notare."]}
      intro="Il nostro casting è sempre attivo. Inviaci i tuoi dati e qualche scatto: valutiamo ogni candidatura in base alla vestibilità reale, non solo ai numeri."
      backHref="/#casting"
      backLabel="Casting"
      aside={
        <div className="flex flex-col gap-6 text-[0.9rem] leading-relaxed text-ink-soft">
          <div className="border-t border-line pt-5">
            <p className="u-eyebrow mb-2">Cosa inviare</p>
            <p>
              3–5 scatti naturali: viso, figura intera e profilo, luce diurna,
              senza trucco pesante.
            </p>
          </div>
          <div className="border-t border-line pt-5">
            <p className="u-eyebrow mb-2">Misure</p>
            <p>
              Facoltative in questa fase: bastano nome, contatti e le immagini
              per iniziare la valutazione.
            </p>
          </div>
          <div className="border-t border-line pt-5">
            <p className="u-eyebrow mb-2">Divisioni</p>
            <p>Lei · Lui · Kids in arrivo.</p>
          </div>
        </div>
      }
    >
      <ApplicationForm />
    </FormLayout>
  );
}
