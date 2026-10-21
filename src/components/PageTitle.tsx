import type { ReactNode } from "react";

/**
 * En-tête de page du catalogue : petit surtitre, titre en écriture manuelle (la police
 * des titres de l'ancien site) souligné d'un trait de feutre, puis un texte d'introduction.
 */
export function PageTitle({
  surtitre,
  titre,
  children,
}: {
  surtitre: string;
  titre: string;
  children?: ReactNode;
}) {
  return (
    <header className="mx-auto max-w-3xl text-center">
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#0b7a86]">{surtitre}</p>
      <h1 className="relative mt-3 inline-block font-hand text-[clamp(2.25rem,6vw,3.75rem)] leading-[1.1] tracking-[0.02em] text-slate-950">
        {titre}
        <svg
          viewBox="0 0 300 10"
          preserveAspectRatio="none"
          className="absolute -bottom-1 left-0 h-2.5 w-full"
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
      {children ? <div className="mt-6 text-base leading-relaxed text-slate-800">{children}</div> : null}
    </header>
  );
}
