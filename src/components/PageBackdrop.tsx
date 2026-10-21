import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ARC_HEIGHT } from "../lib/layout";

/**
 * Fond d'ambiance présent sur TOUTES les pages (monté une seule fois dans le
 * Layout) : les vrais visuels de l'ancien site Sorel, affichés en entier et
 * OPAQUES. Ils recouvrent le fond d'origine (dégradé + dessins flottants), qui reste
 * visible partout ailleurs, y compris dans les coins découpés de l'arc.
 *
 * - L'arc photo est fixé en haut de la fenêtre : il ne disparaît jamais. Une seule
 *   image est affichée à la fois (changement net, sans fondu) pour ne jamais mélanger
 *   le fond d'une page avec celui d'une autre.
 * - Par-dessus, des plats détournés de l'ancien site flottent doucement et dérivent
 *   plus vite que la page quand on défile (effet de profondeur). Ils font partie de la page.
 */
type Floater = {
  src: string;
  side: "left" | "right";
  /** distance depuis le haut de la page, en rem */
  top: number;
  /** largeur en px */
  width: number;
  /** décalage par rapport au bord, en % de la largeur */
  edge: number;
  rotate: number;
  /** vitesse de dérive au défilement (plus grand = plus rapide) */
  speed: number;
};

type Variant = {
  src: string;
  ratio: number;
  flip: boolean;
  floaters: Floater[];
};

const VARIANTS: Record<string, Variant> = {
  /** baies sur fond rose : en-tête de la page Catalogue de l'ancien site */
  baies: {
    src: "/backgrounds/baies.webp",
    ratio: 1919 / 637,
    flip: false,
    floaters: [
      { src: "/backgrounds/terrine.webp", side: "left", top: 4.5, width: 215, edge: 4, rotate: -6, speed: 0.12 },
      { src: "/backgrounds/plat-legumes.webp", side: "right", top: 4, width: 190, edge: 4, rotate: 7, speed: 0.2 },
    ],
  },
  /** lentilles sur fond jaune : grille produits de l'ancien site */
  citron: {
    src: "/backgrounds/citron.webp",
    ratio: 1920 / 1011,
    flip: true,
    floaters: [
      { src: "/backgrounds/plat-noir.webp", side: "right", top: 5, width: 200, edge: 5, rotate: 8, speed: 0.15 },
    ],
  },
  /** légumes sur turquoise : en-tête d'accueil de l'ancien site */
  cyan: { src: "/backgrounds/cyan.webp", ratio: 1920 / 997, flip: false, floaters: [] },
  /** fruits sur rose vif, retournés : les prunes passent derrière le formulaire et le texte reste lisible */
  prunes: { src: "/backgrounds/prunes.webp", ratio: 1920 / 1009, flip: true, floaters: [] },
  /** atelier sur bleu pâle : fond de la page La société de l'ancien site */
  societe: { src: "/backgrounds/societe.webp", ratio: 1920 / 977, flip: false, floaters: [] },
};

/** Quelle image pour quelle page. */
function variantFor(pathname: string): string {
  if (pathname === "/") return "cyan";
  if (pathname.startsWith("/a-propos")) return "societe";
  if (pathname.startsWith("/contact")) return "prunes";
  if (pathname.startsWith("/mes-references")) return "citron";
  if (pathname.startsWith("/catalogue")) return "baies";
  return "baies";
}

function FloatingDish({
  f,
  scrollY,
  reduce,
}: {
  f: Floater;
  scrollY: MotionValue<number>;
  reduce: boolean | null;
}) {
  const y = useTransform(scrollY, [0, 900], [0, reduce ? 0 : -900 * f.speed]);
  return (
    <motion.div
      style={{
        y,
        top: `${f.top}rem`,
        width: f.width,
        [f.side]: `${f.edge}%`,
        rotate: f.rotate,
      }}
      className="absolute hidden lg:block"
    >
      <motion.img
        src={f.src}
        alt=""
        draggable={false}
        animate={reduce ? undefined : { y: [0, -8, 0] }}
        transition={{ duration: 7 + f.speed * 10, repeat: Infinity, ease: "easeInOut" }}
        className="h-auto w-full [filter:drop-shadow(0_14px_18px_rgba(15,23,42,0.16))]"
      />
    </motion.div>
  );
}

export function PageBackdrop() {
  const reduce = useReducedMotion();
  const { pathname } = useLocation();
  const v = VARIANTS[variantFor(pathname)];
  const { scrollY } = useScroll();

  // précharge toutes les images : le changement de page ne montre jamais un fond à moitié chargé
  useEffect(() => {
    for (const variant of Object.values(VARIANTS)) {
      new Image().src = variant.src;
      for (const f of variant.floaters) new Image().src = f.src;
    }
  }, []);

  // bandeau bas : on garde le bas de l'image (la courbe de l'arc) et on rogne le haut
  const height = ARC_HEIGHT;

  return (
    <>
      {/* arc photo : fixe, toujours présent, une seule image à la fois */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 z-0"
        style={{ height }}
      >
        <img
          src={v.src}
          alt=""
          draggable={false}
          className={`h-full w-full object-cover object-bottom ${v.flip ? "scale-x-[-1]" : ""} [filter:saturate(0.8)_drop-shadow(0_20px_30px_rgba(15,23,42,0.06))]`}
        />
      </div>
      {/* plats détournés : portés par la page, avec dérive au défilement */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-0 h-0">
        {v.floaters.map((f) => (
          <FloatingDish key={f.src} f={f} scrollY={scrollY} reduce={reduce} />
        ))}
      </div>
    </>
  );
}
