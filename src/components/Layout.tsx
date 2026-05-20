import { Outlet } from "react-router-dom";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";
import { TupperwareBackdrop } from "./TupperwareBackdrop";

export function Layout() {
  return (
    <div className="relative flex min-h-screen flex-col bg-gradient-to-br from-sky-100 via-amber-50 to-orange-50 font-sans text-slate-900 antialiased">
      <TupperwareBackdrop />
      <main className="relative z-10 flex-1 pt-[5.5rem] sm:pt-[5.75rem]">
        <Outlet />
      </main>
      <Footer />
      <Navbar />
    </div>
  );
}
