import { motion, useReducedMotion } from "motion/react";

/** Cubes en arrière-plan — blanc / gris très léger, sans cadres colorés. */
export function AboutCubeBackdrop({ className = "" }: { className?: string }) {
  const reduced = useReducedMotion();

  const cubes = Array.from({ length: 14 }, (_, i) => {
    const left = 10 + ((i * 67) % 78);
    const top = 8 + ((i * 53) % 76);
    const size = 18 + ((i % 5) | 0) * 11;
    const duration = reduced ? 0 : 16 + (((i % 7) | 0) / 7) * 14;
    const delay = reduced ? 0 : i * 0.52 + (left % 7) * 0.06;
    const phase = left * 0.02 + top * 0.03;

    return {
      size,
      left: `${left}%`,
      top: `${top}%`,
      duration,
      delay,
      phase,
      orb: (((i % 4) | 0) / 4) * Math.PI * 2,
    };
  });

  if (reduced) {
    return (
      <div
        className={`pointer-events-none absolute inset-0 overflow-hidden opacity-40 ${className}`}
        aria-hidden
      >
        <div className="absolute inset-0 bg-gradient-to-br from-slate-200/30 via-transparent to-slate-100/25" />
      </div>
    );
  }

  const glide = [0.22, 0.92, 0.24, 0.96] as const;

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden
    >
      <div className="absolute inset-0 opacity-[0.58] md:opacity-[0.72]">
        <div className="absolute inset-0 [perspective:1100px] [transform-style:preserve-3d]">
          {cubes.map((cube, i) => {
            const o = cube.orb + cube.phase;
            const amplitude = cube.size * 0.42;
            return (
              <motion.div
                key={i}
                className="absolute rounded-xl border border-white/50 bg-gradient-to-br from-white/90 to-slate-100/50 shadow-[0_12px_36px_rgba(15,23,42,0.06)] backdrop-blur-[2px]"
                style={{
                  width: cube.size,
                  height: cube.size,
                  left: cube.left,
                  top: cube.top,
                  marginLeft: -(cube.size / 2),
                  marginTop: -(cube.size / 2),
                  transformOrigin: "50% 55%",
                  willChange: "transform",
                }}
                animate={{
                  x: [
                    0,
                    Math.cos(o) * amplitude * 1.05,
                    Math.sin(o + 1.1) * amplitude * 0.55,
                    Math.cos(o - 0.8) * amplitude * -0.7,
                    0,
                  ],
                  y: [
                    0,
                    Math.sin(o) * amplitude * -0.95,
                    Math.cos(o + 0.6) * amplitude * 0.75,
                    Math.sin(o - 1.3) * amplitude * -0.45,
                    0,
                  ],
                  rotateZ: [0, 9 + (i % 4), -11 + ((i >> 1) % 5), 5, 0],
                  rotateY: [-12 + (i % 7), 8, -6, 10, -12 + (i % 7)],
                  scaleX: [1, 1.035, 0.96, 1.024, 1],
                  scaleY: [1, 0.97, 1.048, 0.982, 1],
                }}
                transition={{
                  duration: cube.duration,
                  delay: cube.delay,
                  repeat: Infinity,
                  repeatType: "loop",
                  times: [0, 0.22, 0.48, 0.74, 1],
                  ease: [glide, glide, glide, glide],
                }}
              />
            );
          })}
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-slate-50/85 to-slate-100/80" />
    </div>
  );
}
