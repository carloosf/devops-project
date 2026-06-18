import { FormEvent, useEffect, useState } from "react";

import { createLink, listLinks } from "../services/api";
import type { ShortLink } from "../types/link";

function isHttpUrl(value: string) {
  try {
    const url = new URL(value.trim());
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export default function Home() {
  const [links, setLinks] = useState<ShortLink[]>([]);
  const [originalUrl, setOriginalUrl] = useState("");
  const [customSlug, setCustomSlug] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [createdLink, setCreatedLink] = useState<ShortLink | null>(null);

  useEffect(() => {
    listLinks()
      .then(setLinks)
      .catch(() => setError("Nao foi possivel carregar os links cadastrados."));
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setCreatedLink(null);

    const normalizedUrl = originalUrl.trim();
    if (!isHttpUrl(normalizedUrl)) {
      setError("Informe uma URL valida iniciada com http:// ou https://.");
      return;
    }

    setIsLoading(true);

    try {
      const link = await createLink({
        original_url: normalizedUrl,
        custom_slug: customSlug || undefined,
      });

      setCreatedLink(link);
      setLinks((currentLinks) => [link, ...currentLinks]);
      setOriginalUrl("");
      setCustomSlug("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-6 pb-12 pt-6 sm:px-8">
      <section className="mb-8 max-w-3xl">
        <p className="mb-2 text-sm font-black uppercase text-blue-700">
          Projeto AV2
        </p>
        <h1 className="mb-4 text-4xl font-black leading-tight text-slate-950 sm:text-5xl">
          Crie links curtos com uma passagem de loading.
        </h1>
        <p className="text-lg leading-8 text-slate-600">
          Cole uma URL, gere um slug curto e compartilhe uma rota que abre uma
          tela intermediaria antes do destino final.
        </p>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <form onSubmit={handleSubmit} className="grid gap-4">
          <label className="grid gap-2 text-sm font-bold text-slate-800">
            URL original
            <input
              className="w-full rounded-md border border-slate-300 px-4 py-3 text-base outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              type="url"
              required
              pattern="https?://.*"
              placeholder="https://exemplo.com/minha-pagina"
              title="Use uma URL iniciada com http:// ou https://."
              value={originalUrl}
              onChange={(event) => setOriginalUrl(event.target.value)}
            />
            <span className="text-xs font-medium text-slate-500">
              Apenas URLs com http:// ou https:// sao aceitas.
            </span>
          </label>

          <label className="grid gap-2 text-sm font-bold text-slate-800">
            Slug personalizado
            <input
              className="w-full rounded-md border border-slate-300 px-4 py-3 text-base outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="minha-rota"
              minLength={3}
              maxLength={40}
              value={customSlug}
              onChange={(event) => setCustomSlug(event.target.value)}
            />
          </label>

          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex w-full items-center justify-center rounded-md bg-blue-700 px-5 py-3 font-black text-white shadow-sm transition hover:bg-blue-800 disabled:cursor-wait disabled:opacity-70 sm:w-fit"
          >
            {isLoading ? "Criando..." : "Encurtar link"}
          </button>
        </form>

        {error && (
          <p className="mt-4 rounded-md bg-red-50 px-4 py-3 text-red-800">
            {error}
          </p>
        )}
        {createdLink && (
          <p className="mt-4 rounded-md bg-green-50 px-4 py-3 text-green-800">
            Link criado:{" "}
            <a
              className="font-black underline underline-offset-4"
              href={createdLink.short_url}
              target="_blank"
              rel="noreferrer"
            >
              {createdLink.short_url}
            </a>
          </p>
        )}
      </section>

      <section className="mt-8">
        <h2 className="mb-3 text-2xl font-black text-slate-950">
          Links cadastrados
        </h2>
        {links.length === 0 ? (
          <p className="text-slate-600">Nenhum link criado ainda.</p>
        ) : (
          links.map((link) => (
            <article
              key={link.id}
              className="flex flex-col gap-4 border-t border-slate-200 py-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <strong className="text-lg text-slate-950">{link.slug}</strong>
                <p className="mt-1 break-words text-slate-600">
                  {link.original_url}
                </p>
              </div>
              <div className="flex shrink-0 flex-col gap-2 sm:items-end">
                <a
                  className="rounded-md bg-slate-950 px-4 py-2 text-center font-bold text-white transition hover:bg-slate-800"
                  href={link.short_url}
                  target="_blank"
                  rel="noreferrer"
                >
                  Abrir curto
                </a>
                <span className="text-sm font-bold text-slate-500">
                  {link.access_count} acessos
                </span>
              </div>
            </article>
          ))
        )}
      </section>
    </main>
  );
}
