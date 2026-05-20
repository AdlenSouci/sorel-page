import { ArrowRight, Image as ImageIcon } from "lucide-react";
import { Link } from "react-router-dom";

const GAMME_PLACEHOLDER_COUNT = 4;

export function Home() {
  return (
    <div>
      <section className="relative flex min-h-[88vh] flex-col items-center justify-center overflow-hidden px-6 pt-2 pb-16 md:px-16">
        <div className="relative z-10 mx-auto w-full max-w-4xl rounded-[2rem] bg-white/98 px-8 py-10 shadow-xl backdrop-blur-sm md:px-12 md:py-12">
          <div className="text-center">
            <h1 className="mb-4 text-[clamp(2.25rem,7vw,4.25rem)] font-bold leading-[1.08] tracking-tight text-slate-950">
              SOREL PLASTIQUES
            </h1>
            <p className="mb-6 text-xl font-semibold text-orange-700 md:text-2xl">
              Notre produit, votre couleur
            </p>
            <p className="mx-auto max-w-2xl text-[17px] leading-[1.65] text-slate-800">
              Plastiques techniques, gammes Color Tonic et solutions sur mesure pour
              l’industrie, le bâtiment et l’aménagement intérieur.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/catalogue"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:from-orange-600 hover:to-amber-600"
              >
                Voir le catalogue
                <ArrowRight className="size-4" aria-hidden />
              </Link>
              <a
                href="#produits"
                className="text-sm font-semibold text-[#27E4F5] underline decoration-[#27E4F5]/60 underline-offset-4 hover:text-[#1fb3c4]"
              >
                Découvrir les gammes
              </a>
            </div>
          </div>
        </div>
      </section>

      <div
        id="produits"
        className="container mx-auto scroll-mt-24 px-6 pb-28 md:px-16"
      >
        <div className="mb-14 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-600">
            Nos références
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
            Nos gammes phares
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-slate-800">
            Color Tonic et finitions — catalogue mis à jour depuis notre base (à
            brancher).
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: GAMME_PLACEHOLDER_COUNT }, (_, index) => (
            <Link
              key={index}
              to="/catalogue"
              className="group block cursor-pointer"
            >
              <div className="mb-4 overflow-hidden rounded-2xl bg-white shadow-md transition-all group-hover:scale-105 group-hover:shadow-xl">
                <div
                  className="flex aspect-[4/3] w-full items-center justify-center bg-slate-100 text-slate-400"
                  aria-hidden
                >
                  <ImageIcon className="size-12 opacity-60" strokeWidth={1.5} />
                </div>
              </div>
              <p className="text-center font-semibold text-slate-950">
                Color Tonic
              </p>
              <p className="mt-1 text-center text-sm leading-snug text-slate-700">
                Visuel à venir — fiche au catalogue
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
