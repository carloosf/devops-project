import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="grid min-h-[calc(100vh-72px)] place-items-center px-6 py-12">
      <section className="w-full max-w-xl rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <p className="mb-2 text-sm font-black uppercase text-blue-700">404</p>
        <h1 className="mb-5 text-3xl font-black text-slate-950">
          Pagina nao encontrada.
        </h1>
        <Link
          to="/"
          className="inline-flex rounded-md bg-blue-700 px-5 py-3 font-black text-white transition hover:bg-blue-800"
        >
          Voltar para o inicio
        </Link>
      </section>
    </main>
  );
}
