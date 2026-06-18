import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { resolveLink } from "../services/api";

const REDIRECT_DELAY_MS = 2000;

export default function RedirectLoading() {
  const { slug } = useParams();
  const [error, setError] = useState("");

  useEffect(() => {
    let timeoutId: number | undefined;

    async function redirect() {
      if (!slug) {
        setError("Link curto invalido.");
        return;
      }

      try {
        const link = await resolveLink(slug);
        timeoutId = window.setTimeout(() => {
          window.location.href = link.original_url;
        }, REDIRECT_DELAY_MS);
      } catch {
        setError("Nao encontramos esse link curto.");
      }
    }

    redirect();

    return () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [slug]);

  return (
    <main className="grid h-[calc(100vh-3.5rem)] place-items-center overflow-hidden bg-black px-4 py-6 font-mono text-emerald-100">
      {error ? (
        <section className="w-full max-w-xl border border-red-500/40 bg-zinc-950 p-6 shadow-[0_0_32px_rgba(239,68,68,0.18)]">
          <p className="mb-2 text-xs font-black uppercase tracking-[0.28em] text-red-400">
            redirect_error
          </p>
          <h1 className="mb-5 text-2xl font-black text-red-100">{error}</h1>
          <Link
            to="/"
            className="inline-flex border border-emerald-400 bg-emerald-400 px-5 py-3 text-sm font-black uppercase text-black transition hover:bg-emerald-300"
          >
            voltar
          </Link>
        </section>
      ) : (
        <section className="w-full max-w-xl border border-emerald-500/30 bg-zinc-950 p-6 shadow-[0_0_32px_rgba(16,185,129,0.18)]">
          <div
            className="mb-6 h-12 w-12 border-4 border-zinc-800 border-t-emerald-400"
            style={{ animation: "spin 0.9s linear infinite" }}
            aria-hidden="true"
          />
          <p className="mb-2 text-xs font-black uppercase tracking-[0.28em] text-emerald-500">
            redirect_pending
          </p>
          <h1 className="mb-3 text-2xl font-black text-emerald-100">
            Abrindo destino<span className="animate-pulse">_</span>
          </h1>
          <p className="text-sm text-zinc-500">
            aguarde enquanto resolvemos o link curto
          </p>
        </section>
      )}
    </main>
  );
}
