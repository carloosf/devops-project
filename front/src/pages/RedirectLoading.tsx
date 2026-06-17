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
    <main className="grid min-h-[calc(100vh-72px)] place-items-center px-6 py-12">
      {error ? (
        <section className="w-full max-w-xl rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <p className="mb-2 text-sm font-black uppercase text-red-700">
            Link indisponivel
          </p>
          <h1 className="mb-5 text-3xl font-black text-slate-950">{error}</h1>
          <Link
            to="/"
            className="inline-flex rounded-md bg-blue-700 px-5 py-3 font-black text-white transition hover:bg-blue-800"
          >
            Criar outro link
          </Link>
        </section>
      ) : (
        <section className="w-full max-w-xl rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div
            className="mb-6 h-12 w-12 rounded-full border-4 border-slate-200 border-t-blue-700"
            style={{ animation: "spin 0.9s linear infinite" }}
            aria-hidden="true"
          />
          <p className="mb-2 text-sm font-black uppercase text-blue-700">
            Preparando redirecionamento
          </p>
          <h1 className="mb-3 text-3xl font-black text-slate-950">
            Estamos abrindo seu destino.
          </h1>
          <p className="text-slate-600">
            Voce sera enviado automaticamente em alguns segundos.
          </p>
        </section>
      )}
    </main>
  );
}
