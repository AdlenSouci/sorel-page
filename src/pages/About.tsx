import { animate, motion, useInView, useReducedMotion } from "motion/react";
import type { FormEvent, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { Boxes } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  proximityStyle,
  useScrollY,
  useSectionDistances,
} from "../hooks/useScrollProximity";
import { useSeo } from "../hooks/useSeo";
import { TypewriterText } from "../components/TypewriterText";
import machineImg from "../assets/machine.png";
import agroalimentaireSvg from "../assets/agroalimentaire.svg";
import industrieSvg from "../assets/industrie.svg";
import ecoConceptionSvg from "../assets/eco-conception.svg";

const EASE = [0.33, 0.91, 0.35, 1] as const;
const WIDE = "mx-auto w-full max-w-7xl px-6 md:px-12";
const EYEBROW = "text-xs font-semibold uppercase tracking-[0.2em]";

/** Apparition au scroll : le bloc glisse et se révèle quand il entre dans l'écran. */
function Reveal({
  children,
  delay = 0,
  x = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  x?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x, y: x ? 0 : 36 }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -15% 0px" }}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/** Chiffre qui défile jusqu'à sa valeur quand il apparaît. */
function CountUp({ from = 0, to, suffix = "" }: { from?: number; to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const reduced = useReducedMotion();
  const [n, setN] = useState(reduced ? to : from);

  useEffect(() => {
    if (!inView || reduced) return;
    const controls = animate(from, to, {
      duration: 1.8,
      ease: EASE,
      onUpdate: (v) => setN(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, reduced, from, to]);

  return (
    <span ref={ref}>
      {n}
      {suffix}
    </span>
  );
}

const VALUES = [
  "Notre équipe expérimentée se distingue par ses solides valeurs humaines et ses expertises techniques pointues. Nous accordons une grande importance à la collaboration, à l’écoute active et au respect mutuel, car nous croyons fermement que c’est en travaillant ensemble que nous obtenons les meilleurs résultats.",
  "Nous valorisons également la transparence et l’éthique, en mettant toujours l’intérêt collectif avant tout, convaincu que la relation entre un client et son fournisseur doit être établie sur des bases de confiance réciproque pour la faire grandir et durer dans le temps.",
  "Sur le plan technique, nous sommes constamment en veille des dernières avancées et nous nous engageons à maintenir nos compétences à jour pour offrir des solutions de pointe à nos clients.",
] as const;

const SPECIALISTE_AGRO_LINES = [
  "Depuis plus de 40 ans, notre entreprise, spécialiste de l’emballage alimentaire, a acquis une expérience solide et une expertise reconnue dans son domaine.",
  "Durant toutes ces années nous avons pu suivre l’évolution des besoins et des attentes de l’industrie alimentaire, ainsi que les avancées technologiques en matière d’emballage.",
  "Notre savoir-faire éprouvé nous permet de proposer des solutions innovantes, adaptées à vos exigences et spécificités.",
  "Fort de notre réputation établie, fournir des emballages de qualité et de confiance pour protéger les aliments et répondre aux normes les plus strictes, est notre raison d’être, qui renforce chaque jour le lien qui nous unit à plus de 300 clients en Europe.",
] as const;

const STATS = [
  { from: 1900, to: 1975, suffix: "", label: "année de création" },
  { from: 0, to: 40, suffix: "+", label: "ans d’expérience dans l’emballage alimentaire" },
  { from: 0, to: 200, suffix: "+", label: "modèles standards" },
  { from: 0, to: 300, suffix: "+", label: "clients en Europe" },
] as const;

const PILLARS = [
  {
    title: "Agroalimentaire",
    body: "Sorel le partenaire de tous les grands noms de la charcuterie industrielle, avec plus de 200 modèles standards et de nombreuses exclusivités.",
    imageSrc: agroalimentaireSvg,
    tint: "bg-[#27E4F5]/20",
  },
  {
    title: "Industrie",
    body: "Sorel vous offre sa parfaite maîtrise de l’injection des thermoplastiques et vous permet de réaliser des formes plus harmonieuses, plus complexes et d’optimiser vos coûts.",
    imageSrc: industrieSvg,
    tint: "bg-orange-400/20",
  },
  {
    title: "Éco-conception",
    body: "L’écoconception des emballages vise à réduire leur impact environnemental en les concevant de manière plus durable et respectueuse de l’environnement. Cela implique d’utiliser des matériaux recyclables, d’optimiser leur taille et leur poids pour réduire la consommation de ressources, et de favoriser les emballages réutilisables ou compostables. L’écoconception des emballages contribue à la transition vers une économie circulaire et à la réduction des déchets.",
    imageSrc: ecoConceptionSvg,
    tint: "bg-amber-300/30",
  },
] as const;

export function About() {
  const rootRef = useRef<HTMLDivElement>(null);
  const scrollY = useScrollY();
  const distanceAt = useSectionDistances(rootRef, scrollY);

  // Au premier rendu les sections n'existent pas encore dans le DOM : on relance un rendu
  // juste après le montage pour que l'accroche ne reste pas grisée avant le premier scroll.
  const [, setMounted] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useSeo({
    title: "À propos — injecteur plastique depuis 1975",
    description:
      "Sorel Plastiques : spécialiste de l'injection plastique et de l'emballage alimentaire depuis 1975. Plus de 300 clients en Europe, éco-conception et pièces techniques.",
  });

  /** Zoom et fondu selon la distance au centre de l'écran (animation d'origine). */
  const prox = (index: number) => {
    const s = proximityStyle(distanceAt(index));
    return {
      transform: `scale(${s.scale})`,
      opacity: s.opacity,
      transition:
        "transform 0.45s cubic-bezier(0.33, 0.91, 0.35, 1), opacity 0.45s ease-out",
    };
  };

  return (
    // overflow-x-clip : les blocs qui glissent depuis le côté ne créent pas de scroll horizontal.
    <div ref={rootRef} className="overflow-x-clip">
      {/* 1 — Accroche */}
      <section className="relative flex min-h-[88vh] items-center justify-center overflow-hidden pb-24 pt-12 md:min-h-[90vh]">
        <div
          data-motion-section
          className="relative z-10 max-w-5xl px-8 text-center md:px-16"
        >
          <div style={prox(0)}>
            <p className={`${EYEBROW} mx-auto mb-4 text-sm text-orange-600`}>Depuis 1975</p>
            <h1 className="mb-6 text-[clamp(2.25rem,6.2vw,4.75rem)] font-bold leading-[1.08] tracking-tight text-slate-950">
              Sorel spécialiste injecteur depuis 1975
            </h1>
            <p className="mx-auto max-w-2xl text-[18px] font-bold leading-[1.65] text-orange-600 drop-shadow-[0_2px_4px_rgba(255,255,255,0.8)] md:text-[22px]">
              <TypewriterText
                text="La solution réelle pour vos projets en injection plastique"
                delay={500}
                speed={40}
              />
            </p>
          </div>
        </div>

        <div
          className="pointer-events-none absolute bottom-10 left-1/2 z-10 -translate-x-1/2 md:bottom-16"
          style={{ opacity: Math.max(0, 1 - scrollY / 320) }}
        >
          <div className="animate-bounce text-stone-900/45">
            <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </section>

      {/* 2 — Valeurs : un grand titre, trois colonnes, aucun bloc */}
      <section className="relative py-24 md:py-36">
        <div data-motion-section className={WIDE}>
          <div style={prox(1)}>
            <p className={`${EYEBROW} mb-5 text-[#27E4F5]`}>Valeurs</p>
            <h2 className="max-w-5xl text-4xl font-bold leading-[1.05] tracking-tight text-slate-950 md:text-6xl lg:text-7xl">
              Une équipe expérimentée et des <span className="text-orange-600">valeurs !</span>
            </h2>
            <div className="mt-16 grid gap-12 border-t border-slate-900/15 pt-10 md:mt-24 md:grid-cols-3 md:gap-14">
              {VALUES.map((text, i) => (
                <Reveal key={text} delay={i * 0.12}>
                  <span className="font-bold tabular-nums text-orange-600">0{i + 1}</span>
                  <p className="mt-4 text-[17px] leading-relaxed text-slate-800 md:text-[18px]">
                    {text}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3 — Agroalimentaire : l'image reste, le texte défile */}
      <section className="relative py-16 md:py-28">
        <div className={`${WIDE} grid items-start gap-12 md:grid-cols-2 md:gap-20`}>
          <Reveal x={-60} className="md:sticky md:top-28">
            <div className="aspect-[4/5] overflow-hidden rounded-[2rem] shadow-2xl shadow-slate-900/15 md:aspect-auto md:h-[calc(100vh-9rem)] md:max-h-[46rem]">
              <img
                src={machineImg}
                alt="Machine d'injection plastique dans l'atelier Sorel"
                className="h-full w-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
          </Reveal>
          <div className="md:pb-24 md:pt-16">
            <Reveal>
              <p className={`${EYEBROW} mb-4 text-[#27E4F5]`}>Agroalimentaire</p>
              <h2 className="text-4xl font-bold leading-[1.05] tracking-tight text-slate-950 md:text-6xl">
                Spécialiste agroalimentaire
              </h2>
            </Reveal>
            <div className="mt-14 flex flex-col gap-16 md:mt-24 md:gap-28">
              {SPECIALISTE_AGRO_LINES.map((text, i) => (
                <Reveal key={text}>
                  <p className="text-xl font-medium leading-snug text-slate-900 md:text-[1.65rem]">
                    <span className="mb-4 block text-sm font-bold tabular-nums text-orange-600">
                      0{i + 1}
                    </span>
                    {text}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4 — Chiffres : bandeau sombre pleine largeur */}
      <section className="relative bg-slate-950 py-24 text-white md:py-32">
        <div className={WIDE}>
          <Reveal>
            <p className={`${EYEBROW} mb-14 text-[#27E4F5]`}>Sorel en chiffres</p>
          </Reveal>
          <dl className="grid gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
            {STATS.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.1} className="border-t border-white/25 pt-6">
                <dd className="order-1 text-6xl font-bold tabular-nums tracking-tight md:text-7xl">
                  <CountUp from={s.from} to={s.to} suffix={s.suffix} />
                </dd>
                <dt className="mt-3 max-w-[16rem] text-base leading-snug text-zinc-300">
                  {s.label}
                </dt>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      {/* 5 — Trois métiers : lignes en alternance, sans cartes */}
      <section className="relative py-12 md:py-24">
        <div className={WIDE}>
          {PILLARS.map((item, i) => {
            const flip = i % 2 === 1;
            return (
              <div
                key={item.title}
                className="grid items-center gap-10 border-t border-slate-900/15 py-16 md:grid-cols-2 md:gap-24 md:py-28"
              >
                <Reveal x={flip ? 70 : -70} className={flip ? "md:order-2" : ""}>
                  <div
                    className={`mx-auto flex aspect-square w-full max-w-md items-center justify-center rounded-full ${item.tint}`}
                  >
                    <img
                      src={item.imageSrc}
                      alt={item.title}
                      className="w-1/2"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </Reveal>
                <Reveal delay={0.1} className={flip ? "md:order-1" : ""}>
                  <span className="text-7xl font-bold leading-none tabular-nums text-slate-900/10 md:text-8xl">
                    0{i + 1}
                  </span>
                  <h2 className="mt-2 text-4xl font-bold tracking-tight text-slate-950 md:text-5xl">
                    {item.title}
                  </h2>
                  <p className="mt-6 text-lg leading-relaxed text-slate-800 md:text-xl">
                    {item.body}
                  </p>
                </Reveal>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6 — Technique : bandeau teinté */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#27E4F5]/25 via-white/40 to-orange-300/35 py-24 md:py-36">
        <Boxes
          strokeWidth={0.35}
          className="pointer-events-none absolute -right-16 top-1/2 size-[34rem] -translate-y-1/2 text-slate-900/10"
        />
        <div data-motion-section className={`${WIDE} relative`}>
          <div style={prox(2)} className="grid items-start gap-12 md:grid-cols-[1fr_1.25fr] md:gap-20">
            <div>
              <p className={`${EYEBROW} mb-4 text-amber-700`}>Technique</p>
              <h2 className="text-4xl font-bold leading-[1.05] tracking-tight text-slate-950 md:text-6xl">
                Injecteur de pièces techniques
              </h2>
            </div>
            <div className="space-y-6 text-lg leading-relaxed text-slate-900 md:text-xl">
              <p>
                Notre entreprise, spécialisée dans l’injection de pièces techniques, offre des
                solutions sur mesure pour répondre aux besoins de divers secteurs industriels.
                Grâce à notre expertise pointue et à notre parc de machines modernes, nous sommes
                capables de produire des pièces de haute qualité avec une précision exceptionnelle.
              </p>
              <p>
                Nous travaillons en étroite collaboration avec nos clients pour comprendre leurs
                exigences spécifiques et garantir la conformité aux normes les plus strictes. Notre
                engagement envers l’innovation et la satisfaction du client nous positionne comme un
                partenaire de confiance dans le domaine de l’injection de pièces techniques.
              </p>
            </div>
          </div>
        </div>
      </section>

      <AboutNewsletterBlock />
    </div>
  );
}

function AboutNewsletterBlock() {
  const [email, setEmail] = useState("");

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEmail("");
  };

  return (
    <section className="relative z-10 mx-auto max-w-3xl px-6 py-24 text-center md:py-36">
      <Reveal>
        <p className={`${EYEBROW} mb-4 text-[#27E4F5]`}>Newsletter</p>
        <h2 className="mb-6 text-3xl font-bold leading-tight tracking-tight text-slate-950 md:text-5xl">
          Restons en contact et inscrivez-vous à notre newsletter
        </h2>
        <p className="mx-auto mb-10 max-w-2xl text-[15px] leading-relaxed text-slate-900 md:text-base">
          Inscrivez-vous à notre newsletter pour recevoir nos offres promotionnelles et actualités.
          Vous pouvez à tout moment utiliser le lien de désabonnement intégré dans chaque courrier.
          Pour en savoir plus sur la gestion de vos données et vos droits.
        </p>
        <form
          className="mx-auto flex max-w-xl flex-col gap-3 sm:flex-row sm:items-center"
          onSubmit={onSubmit}
          noValidate
        >
          <label className="sr-only" htmlFor="about-newsletter-email">
            Adresse e-mail
          </label>
          <Input
            id="about-newsletter-email"
            type="email"
            name="email"
            autoComplete="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-auto min-h-12 flex-1 rounded-full border-2 border-[#27E4F5]/30 bg-white px-5 text-[15px] text-slate-900 outline-none placeholder:text-slate-500 focus:border-[#27E4F5] focus:ring-2 focus:ring-[#27E4F5]/20"
            required
          />
          <Button
            type="submit"
            variant="brand"
            size="pill"
            className="min-h-12 w-full px-8 py-0 text-sm sm:w-auto sm:min-w-[7.75rem]"
          >
            Écrire
          </Button>
        </form>
      </Reveal>
    </section>
  );
}
