import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="redirect-page">
      <section className="panel compact">
        <p className="eyebrow">404</p>
        <h1>Pagina nao encontrada.</h1>
        <Link to="/">Voltar para o inicio</Link>
      </section>
    </main>
  );
}
