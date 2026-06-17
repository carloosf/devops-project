import { Link, Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import RedirectLoading from "./pages/RedirectLoading";

export default function App() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <Link to="/" className="brand">
          Encurtador de Links
        </Link>
      </header>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/r/:slug" element={<RedirectLoading />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}
