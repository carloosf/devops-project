import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="grid h-[calc(100vh-3.5rem)] place-items-center overflow-hidden bg-black px-4 py-6 font-mono text-emerald-100">
      <section className="w-full max-w-xl border border-emerald-500/30 bg-zinc-950 p-6 shadow-[0_0_32px_rgba(16,185,129,0.18)]">
        <p className="mb-2 text-xs font-black uppercase tracking-[0.28em] text-emerald-500">
          404
        </p>
        <h1 className="mb-5 text-2xl font-black text-emerald-100">
          Pagina nao encontrada<span className="animate-pulse">_</span>
        </h1>
        <Link
          to="/"
          className="inline-flex border border-emerald-400 bg-emerald-400 px-5 py-3 text-sm font-black uppercase text-black transition hover:bg-emerald-300"
        >
          voltar
        </Link>
      </section>
    </main>
  );
}
