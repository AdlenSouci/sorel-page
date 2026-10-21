import { ArrowRight } from "@/components/icons";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { Link } from "react-router-dom";
import { formatVolume, groupeDe, photoGamme } from "../lib/gammes";
import type { CategoryDTO } from "../types/catalog";
import { ColorSwatch } from "./ColorSwatch";

const MAX_DOTS = 5;
const RESSORT = { stiffness: 180, damping: 18, mass: 0.6 };

/** Une teinte par rayon (palette du site) : moules = cyan, plats = orange, boîtes = ambre. */
const TEINTES: Record<string, { fond: string; trait: string; barre: string }> = {
  moules: {
    fond: "from-cyan-100 via-cyan-200 to-cyan-400",
    trait: "border-cyan-50/70",
    barre: "bg-cyan-400",
  },
  plats: {
    fond: "from-orange-100 via-orange-200 to-orange-400",
    trait: "border-orange-50/70",
    barre: "bg-orange-400",
  },
  boites: {
    fond: "from-amber-100 via-amber-200 to-amber-400",
    trait: "border-amber-50/70",
    barre: "bg-amber-400",
  },
};

/**
 * Carte d'une gamme : à gauche le nom, la description, le nombre d'articles, la
 * contenance et les coloris ; à droite un panneau coloré (la teinte de son rayon) où le
 * produit est détouré de son fond blanc et posé sur la couleur.
 * Au survol : la carte s'incline légèrement vers le pointeur (3D), se soulève, et le
 * produit grossit à peine.
 */
export function GammeCard({
  category,
  index = 0,
  compact = false,
}: {
  category: CategoryDTO;
  index?: number;
  /** version réduite (accueil) : sans description ni coloris */
  compact?: boolean;
}) {
  const n = category.articleCount;
  const volume = formatVolume(category.volumeMin, category.volumeMax);
  const couleurs = category.couleurs ?? [];
  const photo = photoGamme(category.slug);
  const teinte = TEINTES[groupeDe(category.slug).id] ?? TEINTES.moules;

  const reduit = useReducedMotion();
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [5, -5]), RESSORT);
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-5, 5]), RESSORT);

  const incline = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduit || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  };
  const aplat = () => {
    px.set(0);
    py.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45, delay: Math.min(index, 8) * 0.04, ease: "easeOut" }}
      className="h-full"
    >
      <motion.div
        onPointerMove={incline}
        onPointerLeave={aplat}
        style={{ rotateX, rotateY, transformPerspective: 900 }}
        className="h-full"
      >
      <Link
        to={`/catalogue/${encodeURIComponent(category.slug)}`}
        preventScrollReset
        className={`group relative flex h-full ${compact ? "min-h-[9rem]" : "min-h-[10.5rem]"} overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-900/10 focus-visible:outline-2 focus-visible:outline-orange-600`}
      >
        {/* panneau coloré + produit détouré (sans photo : le panneau seul, aux couleurs du rayon) */}
        {(
          <div
            aria-hidden
            className={`absolute inset-y-0 right-0 w-[46%] bg-gradient-to-br ${teinte.fond}`}
          >
            <span className={`absolute -top-10 -right-10 size-40 rounded-full border-[18px] ${teinte.trait}`} />
            <span className={`absolute -bottom-12 left-2 size-28 rounded-full border-[14px] ${teinte.trait}`} />
            {photo ? (
              <img
                src={photo}
                alt=""
                loading="lazy"
                draggable={false}
                className="absolute inset-0 m-auto h-[74%] w-[84%] object-contain [filter:drop-shadow(0_12px_12px_rgba(15,23,42,0.25))] transition-transform duration-500 ease-out group-hover:scale-105"
              />
            ) : null}
          </div>
        )}

        <div
          className={`relative flex flex-1 flex-col p-4 w-[54%] max-w-[54%] pr-3`}
        >
          <h3
            className={`text-base font-semibold leading-tight tracking-tight text-slate-950`}
          >
            {category.nom}
          </h3>

          {category.description && !compact ? (
            <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-slate-700">
              {category.description}
            </p>
          ) : null}

          <div className={`mt-auto pt-3`}>
            <p className={`text-xl font-bold leading-none tracking-tight text-slate-950`}>
              {n}
              <span className="ml-1.5 text-xs font-medium text-slate-600">
                article{n > 1 ? "s" : ""}
              </span>
            </p>
            {volume ? <p className="mt-1.5 text-xs text-slate-600">Contenance {volume}</p> : null}
            {couleurs.length > 0 && !compact ? (
              <div className="mt-2 flex items-center" aria-label={`${couleurs.length} coloris`}>
                {couleurs.slice(0, MAX_DOTS).map((c) => (
                  <ColorSwatch
                    key={c}
                    name={c}
                    className="-ml-1.5 size-4 ring-2 ring-white first:ml-0"
                  />
                ))}
                {couleurs.length > MAX_DOTS ? (
                  <span className="ml-1.5 text-xs font-medium text-slate-600">
                    +{couleurs.length - MAX_DOTS}
                  </span>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>

        <span
          aria-hidden
          className={`absolute z-20 flex items-center ${compact ? "top-3 right-3 size-7" : "top-4 right-4 size-9"} justify-center justify-center rounded-full bg-white/90 text-slate-800 shadow-sm backdrop-blur transition-colors duration-300 group-hover:bg-slate-950 group-hover:text-white`}
        >
          <ArrowRight className={compact ? "size-3.5" : "size-4"} aria-hidden />
        </span>
        <span className={`absolute right-0 bottom-0 h-1 w-[46%] ${teinte.barre}`} aria-hidden />
      </Link>
      </motion.div>
    </motion.div>
  );
}
