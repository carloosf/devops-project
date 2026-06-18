import { FormEvent, useEffect, useState } from "react";

import { createLink, listLinks, updateLink } from "../services/api";
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
  const [editingLink, setEditingLink] = useState<ShortLink | null>(null);

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
      const payload = {
        original_url: normalizedUrl,
        custom_slug: customSlug || undefined,
      };
      const link = editingLink
        ? await updateLink(editingLink.slug, payload)
        : await createLink(payload);

      setCreatedLink(link);
      setLinks((currentLinks) =>
        editingLink
          ? currentLinks.map((currentLink) =>
              currentLink.id === link.id ? link : currentLink,
            )
          : [link, ...currentLinks],
      );
      setOriginalUrl("");
      setCustomSlug("");
      setEditingLink(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleEdit(link: ShortLink) {
    setEditingLink(link);
    setCreatedLink(null);
    setError("");
    setOriginalUrl(link.original_url);
    setCustomSlug(link.slug);
  }

  function handleCancelEdit() {
    setEditingLink(null);
    setOriginalUrl("");
    setCustomSlug("");
    setError("");
  }

  return (
    <main className="h-[calc(100vh-3.5rem)] overflow-hidden p-3 sm:p-4">
      <section className="mb-3 grid gap-3 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="border border-emerald-500/30 bg-zinc-950/95 p-4 shadow-[0_0_24px_rgba(16,185,129,0.12)]">
          <p className="font-mono text-xs font-black uppercase tracking-[0.28em] text-emerald-500">
            Projeto AV2 :: link daemon
          </p>
          <h1 className="mt-2 font-mono text-2xl font-black leading-tight text-emerald-100 sm:text-3xl">
            Encurtador de links
            <span className="animate-pulse text-emerald-400">_</span>
          </h1>
          <p className="mt-2 max-w-3xl font-mono text-sm leading-6 text-zinc-400">
            Gere slugs HTTP/HTTPS e envie visitantes para uma tela intermediaria
            antes do redirecionamento final.
          </p>
        </div>

        <div className="grid grid-cols-3 border border-emerald-500/30 bg-zinc-950/95 font-mono text-xs text-zinc-400 lg:grid-cols-1">
          <div className="border-r border-emerald-500/20 p-3 lg:border-b lg:border-r-0">
            <span className="block text-emerald-400">STATUS</span>
            <strong className="text-emerald-100">READY</strong>
          </div>
          <div className="border-r border-emerald-500/20 p-3 lg:border-b lg:border-r-0">
            <span className="block text-emerald-400">PROTO</span>
            <strong className="text-emerald-100">HTTP/S</strong>
          </div>
          <div className="p-3">
            <span className="block text-emerald-400">LINKS</span>
            <strong className="text-emerald-100">{links.length}</strong>
          </div>
        </div>
      </section>

      <section className="grid h-[calc(100%-8.5rem)] min-h-0 gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(22rem,28rem)]">
        <div className="min-h-0 border border-emerald-500/30 bg-zinc-950/95 p-4 shadow-[0_0_24px_rgba(16,185,129,0.08)]">
          <div className="mb-4 flex items-center justify-between border-b border-emerald-500/20 pb-3 font-mono text-xs">
            <span className="font-black uppercase text-emerald-400">
              new-shortlink.sh
            </span>
            <span className="text-zinc-500">
              {editingLink ? `PUT /api/links/${editingLink.slug}` : "POST /api/links"}
            </span>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-4">
            <label className="grid gap-2 font-mono text-xs font-bold uppercase tracking-wide text-emerald-300">
              URL original
            <input
              className="w-full border border-emerald-500/35 bg-black px-4 py-3 font-mono text-sm text-emerald-100 outline-none transition placeholder:text-zinc-600 focus:border-emerald-300 focus:shadow-[0_0_18px_rgba(52,211,153,0.25)]"
              type="url"
              required
              pattern="https?://.*"
              placeholder="https://exemplo.com/minha-pagina"
              title="Use uma URL iniciada com http:// ou https://."
              value={originalUrl}
              onChange={(event) => setOriginalUrl(event.target.value)}
            />
            <span className="font-mono text-xs font-medium normal-case text-zinc-500">
              accepted_protocols = ["http", "https"]
            </span>
          </label>

            <label className="grid gap-2 font-mono text-xs font-bold uppercase tracking-wide text-emerald-300">
              Slug personalizado
            <input
              className="w-full border border-emerald-500/35 bg-black px-4 py-3 font-mono text-sm text-emerald-100 outline-none transition placeholder:text-zinc-600 focus:border-emerald-300 focus:shadow-[0_0_18px_rgba(52,211,153,0.25)]"
              placeholder="minha-rota"
              required={Boolean(editingLink)}
              minLength={3}
              maxLength={40}
              value={customSlug}
              onChange={(event) => setCustomSlug(event.target.value)}
            />
          </label>

            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                type="submit"
                disabled={isLoading}
              className="inline-flex w-full items-center justify-center border border-emerald-400 bg-emerald-400 px-5 py-3 font-mono text-sm font-black uppercase text-black transition hover:bg-emerald-300 disabled:cursor-wait disabled:border-zinc-700 disabled:bg-zinc-800 disabled:text-zinc-500 sm:w-fit"
              >
                {isLoading
                  ? "running..."
                  : editingLink
                    ? "./salvar"
                    : "./encurtar"}
              </button>
              {editingLink && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="inline-flex w-full items-center justify-center border border-zinc-700 bg-black px-5 py-3 font-mono text-sm font-black uppercase text-zinc-300 transition hover:border-zinc-500 hover:text-white sm:w-fit"
                >
                  ./cancelar
                </button>
              )}
            </div>
        </form>

        {error && (
            <p className="mt-4 border border-red-500/40 bg-red-950/50 px-4 py-3 font-mono text-sm text-red-200">
              error: {error}
          </p>
        )}
        {createdLink && (
            <p className="mt-4 border border-emerald-500/40 bg-emerald-950/30 px-4 py-3 font-mono text-sm text-emerald-200">
              {editingLink ? "updated" : "saved"}:{" "}
            <a
                className="font-black text-emerald-300 underline underline-offset-4"
              href={createdLink.short_url}
              target="_blank"
              rel="noreferrer"
            >
              {createdLink.short_url}
            </a>
          </p>
        )}
        </div>

        <div className="flex min-h-0 flex-col border border-emerald-500/30 bg-zinc-950/95 shadow-[0_0_24px_rgba(16,185,129,0.08)]">
          <div className="flex items-center justify-between border-b border-emerald-500/20 p-4 font-mono text-xs">
            <h2 className="font-black uppercase text-emerald-400">
              links.log
            </h2>
            <span className="text-zinc-500">tail -f</span>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto p-4">
        {links.length === 0 ? (
              <p className="font-mono text-sm text-zinc-500">
                nenhum registro encontrado
              </p>
        ) : (
          links.map((link) => (
            <article
              key={link.id}
                  className="mb-3 border border-emerald-500/20 bg-black/70 p-3 font-mono"
            >
                  <div className="mb-3 min-w-0">
                    <strong className="text-sm text-emerald-300">
                      /r/{link.slug}
                    </strong>
                    <p className="mt-1 break-words text-xs leading-5 text-zinc-500">
                  {link.original_url}
                </p>
              </div>
                  <div className="flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => handleEdit(link)}
                      className="border border-zinc-700 px-3 py-2 text-xs font-black uppercase text-zinc-300 transition hover:border-emerald-500 hover:text-emerald-300"
                    >
                      edit
                    </button>
                <a
                      className="border border-emerald-500/60 px-3 py-2 text-xs font-black uppercase text-emerald-300 transition hover:bg-emerald-400 hover:text-black"
                  href={link.short_url}
                  target="_blank"
                  rel="noreferrer"
                >
                      open
                </a>
                    <span className="text-xs text-zinc-500">
                      hits={link.access_count}
                </span>
              </div>
            </article>
          ))
        )}
          </div>
        </div>
      </section>
    </main>
  );
}
