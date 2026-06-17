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
    <main className="redirect-page">
      {error ? (
        <section className="panel compact">
          <p className="eyebrow">Link indisponivel</p>
          <h1>{error}</h1>
          <Link to="/">Criar outro link</Link>
        </section>
      ) : (
        <section className="panel compact">
          <div className="loader" aria-hidden="true" />
          <p className="eyebrow">Preparando redirecionamento</p>
          <h1>Estamos abrindo seu destino.</h1>
          <p>Voce sera enviado automaticamente em alguns segundos.</p>
        </section>
      )}
    </main>
  );
}
