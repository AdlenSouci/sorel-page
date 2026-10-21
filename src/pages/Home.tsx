import { ArrowRight } from "@/components/icons";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import sorelLogo from "../assets/Sorel_logo_noi.svg";
import { Button } from "@/components/ui/button";
import { GammeCard } from "../components/GammeCard";
import { CardsSkeleton, ErrorMessage } from "../components/LoadState";
import { useSeo } from "../hooks/useSeo";
import { fetchCategories } from "../lib/api";
import { GROUPES, groupeDe } from "../lib/gammes";
import type { CategoryDTO } from "../types/catalog";

/** Nombre de cartes fantômes pendant le chargement. */
const SKELETONS = 9;

export function Home() {
  const [gammes, setGammes] = useState<CategoryDTO[] | null>(null);
  const [gammesError, setGammesError] = useState(false);

  useSeo({
    title: "Sorel Plastiques",
    description:
      "Injecteur de pièces techniques et spécialiste de l'emballage alimentaire depuis 1975. Plus de 200 modèles standards, coloration sur mesure, éco-conception.",
  });

  useEffect(() => {
    void fetchCategories()
      // même ordre que la page Catalogue : par rayon (moules, plats, boîtes), puis les plus fournies d'abord
      .then((rows) =>
        setGammes(
          [...rows].sort(
            (a, b) =>
              GROUPES.findIndex((g) => g.id === groupeDe(a.slug).id) -
                GROUPES.findIndex((g) => g.id === groupeDe(b.slug).id) ||
              b.articleCount - a.articleCount,
          ),
        ),
      )
      .catch(() => setGammesError(true));
  }, []);

  return (
    <div>
      {/* Accroche posée directement sur la page : plus de bloc blanc, plus d'animation. */}
      <section className="relative flex min-h-[88vh] flex-col items-center justify-center overflow-hidden px-6 pt-2 pb-16 md:px-16">
        <div className="relative z-10 mx-auto w-full max-w-4xl text-center">
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
          <h1 className="relative mx-auto mb-6 inline-block font-hand text-[clamp(2.5rem,8vw,5rem)] leading-[1.1] tracking-[0.03em] text-slate-950">
            SOREL PLASTIQUES
            <svg
              viewBox="0 0 300 10"
              preserveAspectRatio="none"
              className="absolute -bottom-1 left-0 h-3 w-full"
              aria-hidden
            >
              <path
                d="M2 6 C60 4, 120 7, 180 5 S260 4, 298 6"
                fill="none"
                stroke="#1fb3c4"
                strokeWidth="2.5"
                strokeLinecap="round"
                filter="url(#sk-rough)"
              />
            </svg>
          </h1>
          <p className="mb-6 text-xl font-semibold text-orange-700 md:text-2xl">
            Notre produit, votre couleur
          </p>
          <p className="mx-auto max-w-2xl text-[17px] leading-[1.65] text-slate-800">
            Plastiques techniques, gammes Color Tonic et solutions sur mesure pour
            l&apos;industrie, le bâtiment et l&apos;aménagement intérieur.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
            <Button asChild variant="brand" size="pill">
              <Link to="/catalogue">
                Voir le catalogue
                <ArrowRight aria-hidden />
              </Link>
            </Button>
            <Button asChild variant="cyan" className="h-auto px-0">
              <a href="#produits">Découvrir les gammes</a>
            </Button>
          </div>
        </div>
      </section>

      <div id="produits" className="container mx-auto scroll-mt-24 px-6 pb-28 md:px-16">
        <div className="mb-14 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-600">
            Nos références
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
            Nos gammes
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-slate-800">
            {gammes?.length ? `${gammes.length} gammes.` : "Chargement des gammes…"}
          </p>
        </div>

        {gammesError ? <ErrorMessage>Catalogue momentanément indisponible.</ErrorMessage> : null}

        {!gammes && !gammesError ? (
          <CardsSkeleton
            count={SKELETONS}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          />
        ) : null}

        {gammes && gammes.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {gammes.map((gamme, i) => (
              <GammeCard key={gamme.id} category={gamme} index={i} compact />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
