import { Link, Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import RedirectLoading from "./pages/RedirectLoading";

export default function App() {
  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 sm:px-8">
        <Link
          to="/"
          className="text-lg font-black tracking-tight text-slate-950 sm:text-xl"
        >
          Encurtador de Links
        </Link>
        <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-bold uppercase text-blue-700 shadow-sm">
          FastAPI + React
        </span>
      </header>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/r/:slug" element={<RedirectLoading />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}
