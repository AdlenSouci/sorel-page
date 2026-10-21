import { motion } from "motion/react";
import type { ReactNode } from "react";
import { ARC_HEIGHT } from "../lib/layout";

/**
 * Dessins au trait des vrais articles du catalogue : terrine rectangulaire, moule rond,
 * plateau, couvercle, boîte avec couvercle, assiette, seau. Tous dans un carré de 100 × 100.
 */
const trait = { fill: "none", stroke: "currentColor", strokeLinejoin: "round", strokeLinecap: "round" } as const;

const FORMES: Record<string, ReactNode> = {
  /** terrine rectangulaire : ouverture en parallélogramme, parois qui s'évasent */
  terrine: (
    <g {...trait} strokeWidth={3}>
      <path d="M14 42 L84 42 L92 28 L22 28 Z" />
      <path d="M14 42 L22 78 L76 78 L84 42" />
      <path d="M92 28 L86 62 L76 78" />
      <path d="M18 54 L80 54" strokeWidth={1.5} />
    </g>
  ),
  /** moule rond : ellipse d'ouverture, bord intérieur, fond arrondi */
  rond: (
    <g {...trait} strokeWidth={3}>
      <ellipse cx="50" cy="32" rx="35" ry="10" />
      <ellipse cx="50" cy="32" rx="28" ry="7" strokeWidth={1.5} />
      <path d="M15 32 L24 72 Q50 90 76 72 L85 32" />
      <path d="M21 52 Q50 62 79 52" strokeWidth={1.5} />
    </g>
  ),
  /** plateau rectangulaire : bas, avec un bord relevé */
  plateau: (
    <g {...trait} strokeWidth={3}>
      <path d="M10 54 L80 54 L92 38 L22 38 Z" />
      <path d="M19 51 L76 51 L85 41 L28 41 Z" strokeWidth={1.5} />
      <path d="M10 54 L10 63 L80 63 L80 54" />
      <path d="M80 63 L92 47 L92 38" />
    </g>
  ),
  /** couvercle plat : panneau en relief et languette de préhension */
  couvercle: (
    <g {...trait} strokeWidth={3}>
      <path d="M12 58 L78 58 L90 44 L24 44 Z" />
      <path d="M12 58 L12 65 L78 65 L78 58" />
      <path d="M78 65 L90 51 L90 44" />
      <path d="M27 55 L70 55 L79 47 L36 47 Z" strokeWidth={1.5} />
      <path d="M44 44 L48 36 L62 36 L66 44" />
    </g>
  ),
  /** boîte rectangulaire fermée : couvercle qui déborde, fermeture */
  boite: (
    <g {...trait} strokeWidth={3}>
      <path d="M16 48 L72 48 L88 34 L32 34 Z" />
      <path d="M16 48 L16 82 L72 82 L72 48" />
      <path d="M72 82 L88 68 L88 34" />
      <path d="M16 58 L72 58 L88 44" strokeWidth={1.5} />
      <path d="M38 48 L38 58 M50 48 L50 58" strokeWidth={2} />
    </g>
  ),
  /** assiette ronde : ellipse large, cuvette, bord */
  assiette: (
    <g {...trait} strokeWidth={3}>
      <ellipse cx="50" cy="48" rx="44" ry="18" />
      <ellipse cx="50" cy="48" rx="29" ry="10" strokeWidth={1.5} />
      <path d="M6 50 C 10 70 90 70 94 50" />
    </g>
  ),
  /** seau 5 L : anse, bord, fond */
  seau: (
    <g {...trait} strokeWidth={3}>
      <ellipse cx="50" cy="36" rx="27" ry="7" />
      <path d="M23 36 L30 82 Q50 91 70 82 L77 36" />
      <path d="M25 48 Q50 56 75 48" strokeWidth={1.5} />
      <path d="M23 38 C 10 8 90 8 77 38" />
    </g>
  ),
};

const ORDRE = ["terrine", "rond", "plateau", "couvercle", "boite", "assiette", "seau"] as const;

const COULEURS = ["#27E4F5", "#FF8C42", "#27E4F5", "#FFB347"];

/** Position (en % de la zone sous l'arc), taille et rythme de chaque dessin. */
const DESSINS = [
  { left: "8%", top: "10%", size: 80, duration: 18, delay: 0 },
  { left: "75%", top: "18%", size: 90, duration: 22, delay: 3 },
  { left: "20%", top: "62%", size: 75, duration: 20, delay: 5 },
  { left: "85%", top: "66%", size: 70, duration: 19, delay: 7 },
  { left: "50%", top: "8%", size: 65, duration: 21, delay: 2 },
  { left: "40%", top: "84%", size: 85, duration: 23, delay: 4 },
  { left: "65%", top: "46%", size: 95, duration: 20, delay: 1 },
  { left: "15%", top: "36%", size: 80, duration: 19, delay: 6 },
  { left: "70%", top: "80%", size: 75, duration: 22, delay: 3 },
  { left: "30%", top: "26%", size: 70, duration: 21, delay: 8 },
  { left: "55%", top: "58%", size: 78, duration: 18, delay: 5 },
  { left: "10%", top: "74%", size: 72, duration: 20, delay: 9 },
  { left: "82%", top: "42%", size: 88, duration: 22, delay: 2 },
  { left: "45%", top: "18%", size: 82, duration: 19, delay: 7 },
  { left: "90%", top: "10%", size: 68, duration: 23, delay: 4 },
  { left: "25%", top: "52%", size: 76, duration: 21, delay: 10 },
];

/**
 * Articles dessinés à la main qui flottent doucement en arrière-plan.
 * La zone commence sous l'arc photo : les dessins ne passent jamais derrière lui, ils
 * s'effacent avant d'y arriver.
 */
export function TupperwareBackdrop() {
  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 overflow-hidden opacity-[0.5] [-webkit-mask-image:linear-gradient(to_bottom,transparent,black_4rem)] [mask-image:linear-gradient(to_bottom,transparent,black_4rem)]"
      style={{ top: ARC_HEIGHT }}
      aria-hidden
    >
      {DESSINS.map((d, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: d.left,
            top: d.top,
            width: d.size,
            height: d.size,
            color: COULEURS[i % COULEURS.length],
            // Trait tremblé : les dessins gardent leur animation, avec un rendu plus brut.
            filter: "url(#sk-rough-2)",
          }}
          animate={{
            y: [0, -25, 15, -20, 0],
            x: [0, 10, -8, 12, 0],
            rotate: [0, 3, -2, 4, 0],
            scale: [1, 1.05, 0.98, 1.03, 1],
          }}
          transition={{ duration: d.duration, delay: d.delay, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg viewBox="0 0 100 100" className="h-full w-full">
            {FORMES[ORDRE[i % ORDRE.length]]}
          </svg>
        </motion.div>
      ))}
    </div>
  );
}
