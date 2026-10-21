import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { SketchDefs } from "../sketch/SketchDefs";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";
import { PageBackdrop } from "./PageBackdrop";
import { TupperwareBackdrop } from "./TupperwareBackdrop";

/** Remet le scroll en haut à chaque navigation (le routeur ne le fait pas). */
function useScrollReset() {
  const { pathname } = useLocation();
  useEffect(() => {
    if (!window.location.hash) window.scrollTo(0, 0);
  }, [pathname]);
}

export function Layout() {
  useScrollReset();

  return (
    <div className="relative flex min-h-screen flex-col bg-gradient-to-br from-sky-100 via-amber-50 to-orange-50 font-sans text-slate-900 antialiased">
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[300] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-slate-900 focus:shadow-lg focus:outline-2 focus:outline-orange-600"
      >
        Aller au contenu
      </a>
      <SketchDefs />
      <TupperwareBackdrop />
      <PageBackdrop />
      <main
        id="contenu"
        className="relative z-10 flex-1 pt-[5.5rem] sm:pt-[5.75rem]"
      >
        <Outlet />
      </main>
      <Footer />
      <Navbar />
    </div>
  );
}
