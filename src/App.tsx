import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";

/** Seule l'accueil est dans le bundle initial ; le reste arrive à la demande. */
const About = lazy(() =>
  import("./pages/About").then((m) => ({ default: m.About })),
);
const Catalog = lazy(() =>
  import("./pages/Catalog").then((m) => ({ default: m.Catalog })),
);
const CategoryDetail = lazy(() =>
  import("./pages/CategoryDetail").then((m) => ({ default: m.CategoryDetail })),
);
const Contact = lazy(() =>
  import("./pages/Contact").then((m) => ({ default: m.Contact })),
);
const Wishlist = lazy(() =>
  import("./pages/Wishlist").then((m) => ({ default: m.Wishlist })),
);

function RouteFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center" role="status">
      <span className="sr-only">Chargement…</span>
      <div className="size-8 animate-spin rounded-full border-2 border-slate-300 border-t-orange-600" />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route
            path="a-propos"
            element={
              <Suspense fallback={<RouteFallback />}>
                <About />
              </Suspense>
            }
          />
          <Route
            path="catalogue"
            element={
              <Suspense fallback={<RouteFallback />}>
                <Catalog />
              </Suspense>
            }
          />
          <Route
            path="catalogue/:slug"
            element={
              <Suspense fallback={<RouteFallback />}>
                <CategoryDetail />
              </Suspense>
            }
          />
          <Route
            path="contact"
            element={
              <Suspense fallback={<RouteFallback />}>
                <Contact />
              </Suspense>
            }
          />
          <Route
            path="mes-references"
            element={
              <Suspense fallback={<RouteFallback />}>
                <Wishlist />
              </Suspense>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
