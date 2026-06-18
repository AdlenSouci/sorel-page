import { ArrowRight, Image as ImageIcon, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import sorelLogo from "../assets/Sorel_logo_noi.svg";
import { fetchCategories } from "../lib/catalog";
import type { CategoryDTO } from "../types/catalog";

const FEATURED_GAMMES = 5;

export function Home() {
  const [gammes, setGammes] = useState<CategoryDTO[] | null>(null);
  const [gammesError, setGammesError] = useState(false);

  useEffect(() => {
    void fetchCategories({ limit: FEATURED_GAMMES, featured: true })
      .then(setGammes)
      .catch(() => setGammesError(true));
  }, []);

  return (
    <div>
      <section className="relative flex min-h-[88vh] flex-col items-center justify-center overflow-hidden px-6 pt-2 pb-16 md:px-16">
        <div className="relative z-10 mx-auto w-full max-w-4xl rounded-[2rem] bg-white/98 px-8 py-10 shadow-xl backdrop-blur-sm md:px-12 md:py-12">
          <div className="text-center">
            <motion.div
              className="mb-6 flex justify-center"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.img
                src={sorelLogo}
                alt="Sorel Plastiques"
                className="h-16 w-auto md:h-20"
                whileHover={{ scale: 1.1, rotate: 3 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              />
            </motion.div>
            <h1 className="mb-4 text-[clamp(2.25rem,7vw,4.25rem)] font-bold leading-[1.08] tracking-tight text-slate-950">
              SOREL PLASTIQUES
            </h1>
            <p className="mb-6 text-xl font-semibold text-orange-700 md:text-2xl">
              Notre produit, votre couleur
            </p>
            <p className="mx-auto max-w-2xl text-[17px] leading-[1.65] text-slate-800">
              Plastiques techniques, gammes Color Tonic et solutions sur mesure pour
              l&apos;industrie, le bâtiment et l&apos;aménagement intérieur.
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
            {gammes?.length
              ? `${gammes.length} gammes phares.`
              : "Chargement des gammes…"}
          </p>
        </div>

        {gammesError ? (
          <p className="mb-8 text-center text-sm text-red-700">
            Catalogue momentanément indisponible.
          </p>
        ) : null}

        {!gammes && !gammesError ? (
          <div className="flex justify-center py-12 text-slate-600">
            <Loader2 className="size-8 animate-spin" aria-hidden />
          </div>
        ) : null}

        {gammes && gammes.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5">
            {gammes.map((gamme) => (
              <Link
                key={gamme.id}
                to={`/catalogue/${encodeURIComponent(gamme.slug)}`}
                className="group block"
              >
                <div className="mb-4 overflow-hidden rounded-2xl bg-white shadow-md transition-all group-hover:scale-[1.03] group-hover:shadow-xl">
                  <div className="flex aspect-[4/3] items-center justify-center bg-slate-100 text-slate-400">
                    <ImageIcon className="size-10 opacity-55" strokeWidth={1.5} />
                  </div>
                </div>
                <p className="text-center font-semibold text-slate-950">{gamme.nom}</p>
                <p className="mt-1 text-center text-sm text-slate-600">
                  {gamme.articleCount} article{gamme.articleCount > 1 ? "s" : ""}
                </p>
              </Link>
            ))}
          </div>
        ) : null}

        {gammes && gammes.length > 0 ? (
          <div className="mt-12 text-center">
            <Link
              to="/catalogue"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#27E4F5] underline-offset-4 hover:underline"
            >
              Voir toutes les catégories
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  );
}
