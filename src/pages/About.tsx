import { Boxes } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import type { FormEvent } from "react";
import { useRef, useState } from "react";
import {
  proximityStyle,
  useScrollY,
  useSectionDistances,
} from "../hooks/useScrollProximity";
import { TypewriterText } from "../components/TypewriterText";
import machineImg from "../assets/machine.png";
import agroalimentaireSvg from "../assets/agroalimentaire.svg";
import industrieSvg from "../assets/industrie.svg";
import ecoConceptionSvg from "../assets/eco-conception.svg";

export function About() {
  const rootRef = useRef<HTMLDivElement>(null);
  const scrollY = useScrollY();
  const distanceAt = useSectionDistances(rootRef, scrollY);

  return (
    <div ref={rootRef}>
      <section className="relative flex min-h-[88vh] items-center justify-center overflow-hidden pb-24 pt-12 md:min-h-[90vh]">
        <div
          data-motion-section
          className="relative z-10 max-w-4xl px-8 text-center md:px-16"
        >
          {(() => {
            const hero = proximityStyle(distanceAt(0));
            return (
              <>
                <p
                  className="mx-auto mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-orange-600"
                  style={{
                    transform: `scale(${hero.scale})`,
                    opacity: hero.opacity,
                    transition:
                      "transform 0.42s cubic-bezier(0.33, 0.91, 0.35, 1), opacity 0.42s ease-out",
                  }}
                >
                  Depuis 1975
                </p>
                <h1
                  className="mb-6 text-[clamp(1.85rem,4.8vw,3.25rem)] font-bold leading-[1.15] tracking-tight text-slate-950"
                  style={{
                    transform: `scale(${hero.scale})`,
                    opacity: hero.opacity,
                    transition:
                      "transform 0.42s cubic-bezier(0.33, 0.91, 0.35, 1), opacity 0.42s ease-out",
                  }}
                >
                  Sorel spécialiste injecteur depuis 1975
                </h1>
                <p
                  className="mx-auto max-w-2xl text-[18px] font-bold leading-[1.65] text-orange-600 drop-shadow-[0_2px_4px_rgba(255,255,255,0.8)] md:text-[22px]"
                  style={{
                    transform: `scale(${hero.scale})`,
                    opacity: hero.opacity,
                    transition:
                      "transform 0.42s cubic-bezier(0.33, 0.91, 0.35, 1), opacity 0.42s ease-out",
                  }}
                >
                  <TypewriterText 
                    text="La solution réelle pour vos projets en injection plastique" 
                    delay={500}
                    speed={40}
                  />
                </p>
              </>
            );
          })()}
        </div>

        <div
          className="pointer-events-none absolute bottom-10 left-1/2 z-10 -translate-x-1/2 md:bottom-16"
          style={{ opacity: Math.max(0, 1 - scrollY / 320) }}
        >
          <div className="animate-bounce text-stone-900/45">
            <svg
              className="h-8 w-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </div>
      </section>

      <div className="relative pb-8 md:pb-12">
        <section className="relative flex min-h-0 items-center justify-center overflow-hidden py-20 md:py-28">
          <div
            data-motion-section
            className="container relative z-10 mx-auto max-w-6xl px-8 md:px-16"
          >
            {(() => {
              const s = proximityStyle(distanceAt(1));
              return (
                <div
                  className="rounded-3xl bg-white/95 p-10 shadow-sm ring-1 ring-slate-900/5 backdrop-blur-sm md:p-14"
                  style={{
                    transform: `scale(${s.scale})`,
                    opacity: s.opacity,
                    transition:
                      "transform 0.45s cubic-bezier(0.33, 0.91, 0.35, 1), opacity 0.45s ease-out",
                  }}
                >
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#27E4F5]">
                    Valeurs
                  </p>
                  <h2 className="mb-8 text-3xl font-bold tracking-tight text-slate-950 md:text-[40px]">
                    Une équipe expérimentée et des valeurs !
                  </h2>
                  <div className="space-y-6 text-[17px] leading-relaxed text-slate-800 md:text-[18px]">
                    <p>
                      Notre équipe expérimentée se distingue par ses solides valeurs
                      humaines et ses expertises techniques pointues. Nous accordons une
                      grande importance à la collaboration, à l’écoute active et au
                      respect mutuel, car nous croyons fermement que c’est en travaillant
                      ensemble que nous obtenons les meilleurs résultats.
                    </p>
                    <p>
                      Nous valorisons également la transparence et l’éthique, en mettant
                      toujours l’intérêt collectif avant tout, convaincu que la relation
                      entre un client et son fournisseur doit être établie sur des bases
                      de confiance réciproque pour la faire grandir et durer dans le
                      temps.
                    </p>
                    <p>
                      Sur le plan technique, nous sommes constamment en veille des
                      dernières avancées et nous nous engageons à maintenir nos
                      compétences à jour pour offrir des solutions de pointe à nos
                      clients.
                    </p>
                  </div>
                </div>
              );
            })()}
          </div>
        </section>

        <section className="relative flex min-h-0 items-center justify-center overflow-hidden py-20 md:py-28">
          <div
            data-motion-section
            className="container relative z-10 mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-8 md:grid-cols-2 md:gap-16 md:px-16"
          >
            {(() => {
              const s = proximityStyle(distanceAt(2));
              return (
                <>
                  <div
                    className="aspect-[5/4] overflow-hidden rounded-3xl"
                    style={{
                      transform: `scale(${s.scale})`,
                      opacity: s.opacity,
                      transition:
                        "transform 0.45s cubic-bezier(0.33, 0.91, 0.35, 1), opacity 0.45s ease-out",
                    }}
                  >
                    <img
                      src={machineImg}
                      alt="Machine d'injection plastique Sorel"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div
                    className="rounded-3xl bg-white/98 p-10 shadow-xl backdrop-blur-sm md:p-12"
                    style={{
                      transform: `scale(${s.scale})`,
                      opacity: s.opacity,
                      transition:
                        "transform 0.45s cubic-bezier(0.33, 0.91, 0.35, 1), opacity 0.45s ease-out",
                    }}
                  >
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-orange-700">
                      Agroalimentaire
                    </p>
                    <h2 className="mb-8 text-3xl font-bold tracking-tight text-slate-950 md:text-[40px]">
                      Spécialiste agroalimentaire
                    </h2>
                    <AboutSpecialisteAgroPhrases />
                  </div>
                </>
              );
            })()}
          </div>
        </section>

        <AboutThreePillarsRow />

        <section className="relative flex justify-center overflow-hidden py-14 md:py-20">
          <div
            data-motion-section
            className="container relative z-10 mx-auto max-w-6xl px-8 md:px-16"
          >
            {(() => {
              const s = proximityStyle(distanceAt(3));
              const ease =
                "transform 0.45s cubic-bezier(0.33, 0.91, 0.35, 1), opacity 0.45s ease-out";
              return (
                <div
                  className="rounded-3xl bg-white/95 p-10 shadow-sm ring-1 ring-slate-900/5 backdrop-blur-sm md:p-14"
                  style={{
                    transform: `scale(${s.scale})`,
                    opacity: s.opacity,
                    transition: ease,
                  }}
                >
                  <div className="flex flex-wrap items-start gap-6 md:gap-8">
                    <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-100 to-yellow-100 text-amber-800 shadow-md md:size-16">
                      <Boxes className="size-8 md:size-9 stroke-[1.25]" aria-hidden />
                    </div>
                    <div className="min-w-0 flex-1 space-y-5">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
                        Technique
                      </p>
                      <h2 className="text-3xl font-bold tracking-tight text-slate-950 md:text-[40px]">
                        Injecteur de pièces techniques
                      </h2>
                      <div className="space-y-6 text-[17px] leading-relaxed text-slate-900 md:text-[18px]">
                        <p>
                          Notre entreprise, spécialisée dans l’injection de pièces
                          techniques, offre des solutions sur mesure pour répondre aux
                          besoins de divers secteurs industriels. Grâce à notre expertise
                          pointue et à notre parc de machines modernes, nous sommes capables
                          de produire des pièces de haute qualité avec une précision
                          exceptionnelle.
                        </p>
                        <p>
                          Nous travaillons en étroite collaboration avec nos clients pour
                          comprendre leurs exigences spécifiques et garantir la conformité
                          aux normes les plus strictes. Notre engagement envers
                          l’innovation et la satisfaction du client nous positionne comme
                          un partenaire de confiance dans le domaine de l’injection de
                          pièces techniques.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </section>

        <AboutNewsletterBlock />
      </div>
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
    <section className="relative z-10 container mx-auto max-w-6xl px-8 pb-10 md:px-16 md:pb-14">
      <div className="relative overflow-hidden rounded-[1.85rem] bg-white/98 px-8 py-10 shadow-xl md:rounded-[2.2rem] md:px-12 md:py-12">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[radial-gradient(ellipse_90%_70%_at_20%_0%,rgba(241,245,249,0.95),transparent_55%),linear-gradient(to_bottom,rgba(255,255,255,0.55),transparent_42%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-[0.52] mix-blend-multiply [background-image:repeating-linear-gradient(315deg,rgba(60,54,42,0.044)_0,rgba(60,54,42,0.044)_1px,transparent_1px,transparent_7px)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-[0.085] mix-blend-overlay"
          style={{
            backgroundImage:
              'url(\'data:image/svg+xml;charset=utf8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160"%3E%3Cfilter id="n"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.92" numOctaves="3" stitchTiles="stitch" /%3E%3C/filter%3E%3Crect width="100%25" height="100%25" filter="url(%23n)" opacity="0.55"/%3E%3C/svg%3E\')',
            backgroundRepeat: "repeat",
          }}
        />

        <div className="relative">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#27E4F5]">
            Newsletter
          </p>
          <h2 className="mb-5 max-w-2xl text-2xl font-bold leading-snug tracking-tight text-slate-950 md:text-[1.875rem]">
            Restons en contact et inscrivez-vous à notre newsletter
          </h2>
          <p className="mb-9 max-w-2xl text-[15px] leading-relaxed text-slate-900 md:text-base">
            Inscrivez-vous à notre newsletter pour recevoir nos offres promotionnelles et
            actualités. Vous pouvez à tout moment utiliser le lien de désabonnement
            intégré dans chaque courrier. Pour en savoir plus sur la gestion de vos données
            et vos droits.
          </p>
          <form
            className="flex max-w-xl flex-col gap-3 sm:flex-row sm:items-center"
            onSubmit={onSubmit}
            noValidate
          >
            <label className="sr-only" htmlFor="about-newsletter-email">
              Adresse e-mail
            </label>
            <input
              id="about-newsletter-email"
              type="email"
              name="email"
              autoComplete="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="min-h-12 flex-1 rounded-full border-2 border-[#27E4F5]/30 bg-white px-5 text-[15px] text-slate-900 outline-none placeholder:text-slate-500 focus:border-[#27E4F5] focus:ring-2 focus:ring-[#27E4F5]/20"
              required
            />
            <button
              type="submit"
              className="inline-flex min-h-12 w-full shrink-0 cursor-pointer items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-8 text-sm font-semibold text-white shadow-lg transition hover:from-orange-600 hover:to-amber-600 sm:w-auto sm:min-w-[7.75rem]"
            >
              Écrire
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

const SPECIALISTE_AGRO_LINES = [
  "Depuis plus de 40 ans, notre entreprise, spécialiste de l’emballage alimentaire, a acquis une expérience solide et une expertise reconnue dans son domaine.",
  "Durant toutes ces années nous avons pu suivre l’évolution des besoins et des attentes de l’industrie alimentaire, ainsi que les avancées technologiques en matière d’emballage.",
  "Notre savoir-faire éprouvé nous permet de proposer des solutions innovantes, adaptées à vos exigences et spécificités.",
  "Fort de notre réputation établie, fournir des emballages de qualité et de confiance pour protéger les aliments et répondre aux normes les plus strictes, est notre raison d’être, qui renforce chaque jour le lien qui nous unit à plus de 300 clients en Europe.",
] as const;

/** Révèle les phrases une par une quand la section entre dans la vue au scroll. */
function AboutSpecialisteAgroPhrases() {
  const reduced = useReducedMotion();

  return (
    <div className="flex flex-col gap-8 text-[17px] leading-relaxed text-slate-900 md:gap-11 md:text-[18px]">
      {SPECIALISTE_AGRO_LINES.map((text, index) =>
        reduced ? (
          <p
            key={index}
            className="rounded-r-xl border-l-[3px] border-orange-400 pl-4 md:border-l-[4px] md:pl-6"
          >
            {text}
          </p>
        ) : (
          <motion.p
            key={index}
            className="rounded-r-xl border-l-[3px] border-slate-300 pl-4 md:border-l-[4px] md:pl-6"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -18% 0px" }}
            transition={{
              duration: 0.58,
              delay: index * 0.06,
              ease: [0.33, 0.91, 0.35, 1],
            }}
          >
            {text}
          </motion.p>
        ),
      )}
    </div>
  );
}

/** 3 colonnes côte à côte : titre + texte, puis image en dessous — hors animation. */
function AboutThreePillarsRow() {
  const items = [
    {
      title: "Agroalimentaire",
      body: "Sorel le partenaire de tous les grands noms de la charcuterie industrielle, avec plus de 200 modèles standards et de nombreuses exclusivités.",
      imageSrc: agroalimentaireSvg,
    },
    {
      title: "Industrie",
      body: "Sorel vous offre sa parfaite maîtrise de l’injection des thermoplastiques et vous permet de réaliser des formes plus harmonieuses, plus complexes et d’optimiser vos coûts.",
      imageSrc: industrieSvg,
    },
    {
      title: "Éco-conception",
      body: "L’écoconception des emballages vise à réduire leur impact environnemental en les concevant de manière plus durable et respectueuse de l’environnement. Cela implique d’utiliser des matériaux recyclables, d’optimiser leur taille et leur poids pour réduire la consommation de ressources, et de favoriser les emballages réutilisables ou compostables. L’écoconception des emballages contribue à la transition vers une économie circulaire et à la réduction des déchets.",
      imageSrc: ecoConceptionSvg,
    },
  ] as const;

  return (
    <section className="relative flex justify-center overflow-hidden py-14 md:py-20">
      <div className="container relative z-10 mx-auto max-w-[1200px] px-8 md:px-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-8 lg:gap-10">
          {items.map((item) => (
            <article
              key={item.title}
              className="flex min-h-0 flex-col rounded-3xl bg-white/98 p-6 shadow-xl md:p-7"
            >
              <figure className="relative mb-5 aspect-[4/3] w-full shrink-0 overflow-hidden rounded-2xl bg-white p-6">
                <img
                  src={item.imageSrc}
                  alt={item.title}
                  className="h-full w-full object-contain"
                  loading="lazy"
                  decoding="async"
                />
              </figure>
              <h2 className="mb-3 text-center text-xl font-bold tracking-tight text-slate-950 lg:text-[1.375rem]">
                {item.title}
              </h2>
              <p className="flex-1 text-center text-[15px] leading-relaxed text-slate-900 md:text-[16px]">
                {item.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
