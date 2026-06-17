import { FormEvent, useEffect, useState } from "react";

import { createLink, listLinks } from "../services/api";
import type { ShortLink } from "../types/link";

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
    setIsLoading(true);
    setError("");
    setCreatedLink(null);

    try {
      const link = await createLink({
        original_url: originalUrl,
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
    <main className="page">
      <section className="hero">
        <p className="eyebrow">Projeto AV2</p>
        <h1>Crie links curtos com uma passagem de loading.</h1>
        <p>
          Cole uma URL, gere um slug curto e compartilhe uma rota que abre uma
          tela intermediaria antes do destino final.
        </p>
      </section>

      <section className="panel">
        <form onSubmit={handleSubmit} className="link-form">
          <label>
            URL original
            <input
              type="url"
              required
              placeholder="https://exemplo.com/minha-pagina"
              value={originalUrl}
              onChange={(event) => setOriginalUrl(event.target.value)}
            />
          </label>

          <label>
            Slug personalizado
            <input
              placeholder="minha-rota"
              minLength={3}
              maxLength={40}
              value={customSlug}
              onChange={(event) => setCustomSlug(event.target.value)}
            />
          </label>

          <button type="submit" disabled={isLoading}>
            {isLoading ? "Criando..." : "Encurtar link"}
          </button>
        </form>

        {error && <p className="feedback error">{error}</p>}
        {createdLink && (
          <p className="feedback success">
            Link criado:{" "}
            <a href={createdLink.short_url} target="_blank" rel="noreferrer">
              {createdLink.short_url}
            </a>
          </p>
        )}
      </section>

      <section className="links-list">
        <h2>Links cadastrados</h2>
        {links.length === 0 ? (
          <p>Nenhum link criado ainda.</p>
        ) : (
          links.map((link) => (
            <article key={link.id} className="link-item">
              <div>
                <strong>{link.slug}</strong>
                <p>{link.original_url}</p>
              </div>
              <div className="link-actions">
                <a href={link.short_url} target="_blank" rel="noreferrer">
                  Abrir curto
                </a>
                <span>{link.access_count} acessos</span>
              </div>
            </article>
          ))
        )}
      </section>
    </main>
  );
}
