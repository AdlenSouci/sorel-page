/**
 * Filtres et motifs partagés par tous les dessins du site.
 * Monté une seule fois dans le Layout ; les <Sketch> et <Icon> y font référence par id.
 *
 * - sk-rough   : fait trembler le trait (main levée)
 * - sk-rough-2 : un second tremblement, décalé, pour le « repassage » au crayon
 * - sk-rough-sm: même chose à l'échelle des icônes (viewBox 24)
 * - sk-wash    : bords irréguliers de l'aplat de couleur (feutre / sérigraphie)
 * - sk-hatch   : hachures d'ombre
 */
export function SketchDefs() {
  return (
    <svg width="0" height="0" aria-hidden className="absolute overflow-hidden">
      <defs>
        <filter id="sk-rough" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="3" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="3.2" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="sk-rough-2" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" seed="17" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="4.5" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="sk-rough-sm" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.16" numOctaves="1" seed="5" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="1.1" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="sk-wash"x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.022" numOctaves="3" seed="8" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="9" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <pattern
          id="sk-hatch"
          patternUnits="userSpaceOnUse"
          width="5"
          height="5"
          patternTransform="rotate(-38)"
        >
          <path d="M0 0 V5" stroke="#1e1e1c" strokeWidth="0.75" />
        </pattern>
      </defs>
    </svg>
  );
}
