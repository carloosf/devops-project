import { Link, Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import RedirectLoading from "./pages/RedirectLoading";

export default function App() {
  return (
    <div className="h-screen overflow-hidden bg-black text-emerald-100">
      <header className="flex h-14 items-center justify-between border-b border-emerald-500/25 bg-zinc-950 px-4 text-emerald-300 shadow-[0_0_28px_rgba(16,185,129,0.12)]">
        <Link to="/" className="font-mono text-sm font-black uppercase">
          ./shortener
        </Link>
        <div className="hidden items-center gap-2 font-mono text-xs text-emerald-500 sm:flex">
          <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.9)]" />
          <span>api: online</span>
          <span className="text-zinc-600">|</span>
          <span>mode: terminal</span>
        </div>
      </header>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/r/:slug" element={<RedirectLoading />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}
