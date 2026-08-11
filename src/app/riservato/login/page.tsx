import Link from "next/link";
import LoginForm from "@/components/admin/LoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const { from } = await searchParams;

  return (
    <div className="flex min-h-screen flex-col bg-ink text-paper">
      <div className="flex flex-1 items-center justify-center px-5 py-16 sm:px-8">
        <div
          className="w-full max-w-md"
          style={{ animation: "liine-reveal .7s var(--ease-out-quint) both" }}
        >
          <span className="text-[0.5625rem] uppercase tracking-[0.32em] text-paper/45">
            Area riservata
          </span>
          <h1 className="u-display mt-4 text-[clamp(2.4rem,8vw,3.6rem)] leading-[0.95]">
            Backstage
            <br />
            LIINE.
          </h1>
          <p className="mt-5 max-w-sm text-[0.9rem] leading-relaxed text-paper/60">
            Accedi per gestire il board dei modelli e l&apos;indice dei lavori.
          </p>

          <div className="mt-10 text-paper">
            <LoginForm from={from} />
          </div>

          <Link
            href="/"
            className="mt-10 inline-block text-[0.5625rem] uppercase tracking-[0.24em] text-paper/45 transition-colors hover:text-paper"
          >
            ← Torna al sito
          </Link>
        </div>
      </div>
    </div>
  );
}
