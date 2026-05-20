import type {
  CSSProperties,
  FormEvent,
  ReactElement,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Check, Mail, Sparkles } from "lucide-react";

const CONTACT_MAIL = "contact@sorel-plastiques.local";

const springSlow = {
  type: "spring" as const,
  stiffness: 260,
  damping: 38,
};

const stag = {
  hidden: { opacity: 0, y: 18 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.05 * i,
      ...springSlow,
    },
  }),
};

function Orb({
  className,
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute rounded-full blur-[72px] sm:blur-[100px] ${className ?? ""}`}
      style={style}
    />
  );
}

function GlassSurface({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={[
        "relative isolate overflow-hidden rounded-[2rem] px-px py-px",
        "shadow-[0_36px_100px_-20px_rgba(42,32,22,0.18),0_16px_40px_-16px_rgba(42,32,22,0.1)]",
        className ?? "",
      ].join(" ")}
      style={{
        background:
          "linear-gradient(155deg, rgba(255,255,255,0.35), rgba(39,228,245,0.25), rgba(255,140,66,0.15))",
      }}
    >
      <div
        className="relative overflow-hidden rounded-[calc(2rem-1px)] backdrop-blur-2xl"
        style={{
          background: "rgba(255, 255, 255, 0.45)",
          WebkitBackdropFilter: "blur(50px) saturate(200%)",
          backdropFilter: "blur(50px) saturate(200%)",
        }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/40 via-[#27E4F5]/5 to-orange-50/30"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.02] mix-blend-soft-light"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative z-10">{children}</div>
      </div>
    </div>
  );
}

function Field({
  label,
  id,
  children,
  index,
  reduced,
}: {
  label: string;
  id: string;
  children: (id: string) => ReactElement;
  index: number;
  reduced: boolean | null;
}) {
  const inner = (
    <>
      <label
        htmlFor={id}
        className="block text-[0.78rem] font-medium tracking-wide text-slate-800"
      >
        {label}
      </label>
      {children(id)}
    </>
  );

  return reduced ? (
    <div className="space-y-2">{inner}</div>
  ) : (
    <motion.div
      custom={index}
      variants={stag}
      initial="hidden"
      animate="show"
      className="space-y-2"
    >
      {inner}
    </motion.div>
  );
}

export function Contact() {
  const reduced = useReducedMotion();
  const [sent, setSent] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const body = [
      `Nom : ${name}`,
      `Entreprise : ${company || "—"}`,
      "",
      message,
    ].join("\n");
    const q = new URLSearchParams({
      subject: subject || `Message de ${name || "site Sorel"}`,
      body,
    });
    window.location.href = `mailto:${CONTACT_MAIL}?${q.toString()}`;
    setSent(true);
  };

  return (
    <div className="relative min-h-[calc(100dvh-6rem)] overflow-hidden px-4 pb-24 pt-6 sm:px-8 md:px-12 md:pt-10">
      {/* Orbes « liquides » — inspiration Apple : lumière diffuse, pas de traits durs */}
      {!reduced ? (
        <>
          <motion.div
            className="pointer-events-none absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <Orb
              className="left-[-18%] top-[-12%] h-[48vh] w-[48vh] opacity-40"
              style={{
                background:
                  "radial-gradient(circle, rgba(255,255,255,0.85) 0%, rgba(253,224,71,0.35) 45%, transparent 70%)",
              }}
            />
            <Orb
              className="right-[-15%] top-[20%] h-[42vh] w-[46vh] opacity-35"
              style={{
                background:
                  "radial-gradient(circle, rgba(186,230,253,0.75) 0%, rgba(56,189,248,0.28) 50%, transparent 68%)",
              }}
            />
            <Orb
              className="bottom-[-20%] left-[15%] h-[50vh] w-[55vh] opacity-30"
              style={{
                background:
                  "radial-gradient(circle, rgba(255,255,255,0.55) 0%, rgba(253,224,71,0.32) 40%, transparent 65%)",
              }}
            />
            <motion.div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/3 h-[min(90vw,520px)] w-[min(90vw,520px)] -translate-x-1/2 rounded-full opacity-[0.12] mix-blend-soft-light blur-3xl"
              style={{
                background:
                  "conic-gradient(from 120deg, rgba(255,255,255,0.55), rgba(56,189,248,0.18), rgba(255,255,255,0.45), rgba(253,224,71,0.14), rgba(255,255,255,0.5))",
              }}
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 48, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>
        </>
      ) : (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/20 to-transparent"
        />
      )}

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
          <motion.header
            className="lg:col-span-5"
            initial={reduced ? false : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={springSlow}
          >
            <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#27E4F5]/20 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#27E4F5]">
              <Sparkles className="size-3.5 text-orange-600" aria-hidden />
              Contact
            </p>
            <h1 className="text-[clamp(2.1rem,5vw,3.25rem)] font-bold leading-[1.08] tracking-tight text-slate-950">
              Écrivez-nous.
              <br />
              <span className="text-[#27E4F5]">Nous répondons vite.</span>
            </h1>
            <p className="mt-6 max-w-md text-[1.05rem] leading-relaxed text-slate-900">
              Devis, catalogue personnalisé ou question technique — un message
              suffit. Design sobre, focus sur l’essentiel.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <a
                href={`mailto:${CONTACT_MAIL}`}
                className="group inline-flex items-center gap-2 rounded-full border-2 border-[#27E4F5]/40 bg-gradient-to-r from-[#27E4F5]/10 to-orange-500/10 px-5 py-2.5 text-sm font-semibold text-slate-900 backdrop-blur-md transition hover:border-[#27E4F5] hover:from-[#27E4F5]/20 hover:to-orange-500/20"
              >
                <Mail className="size-4 text-[#27E4F5]" aria-hidden />
                {CONTACT_MAIL}
                <ArrowUpRight className="size-4 text-orange-600 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
              <Link
                to="/catalogue"
                className="inline-flex items-center rounded-full px-5 py-2.5 text-sm font-medium text-[#27E4F5] underline underline-offset-4 transition hover:text-[#1fb3c4]"
              >
                Voir le catalogue
              </Link>
            </div>
          </motion.header>

          <section className="lg:col-span-7">
            <GlassSurface>
              <div className="p-7 sm:p-9 md:p-10">
                <AnimatePresence mode="wait">
                  {sent ? (
                    <motion.div
                      key="ok"
                      initial={{ opacity: 0, scale: 0.96, filter: "blur(8px)" }}
                      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={springSlow}
                      className="flex flex-col items-center py-10 text-center"
                    >
                      <div className="mb-6 flex size-16 items-center justify-center rounded-full bg-[#27E4F5]/20 text-[#27E4F5]">
                        <Check className="size-8" strokeWidth={2} aria-hidden />
                      </div>
                      <h2 className="text-xl font-semibold text-stone-900">
                        Boîte mail ouverte
                      </h2>
                      <p className="mt-3 max-w-sm text-[0.95rem] text-stone-900/55">
                        Votre client mail devrait s’ouvrir avec le message
                        prérempli. Sinon, écrivez directement à{" "}
                        <span className="font-medium text-stone-900/80">
                          {CONTACT_MAIL}
                        </span>
                        .
                      </p>
                      <button
                        type="button"
                        onClick={() => setSent(false)}
                        className="mt-8 rounded-full border border-stone-900/12 bg-white/40 px-6 py-2.5 text-sm font-medium text-stone-900 backdrop-blur-md transition hover:bg-white/70"
                      >
                        Nouveau message
                      </button>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      onSubmit={submit}
                      initial={reduced ? false : { opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={springSlow}
                      className="space-y-6"
                    >
                      <div className="grid gap-6 sm:grid-cols-2">
                        <Field
                          label="Nom complet"
                          id="c-name"
                          index={0}
                          reduced={reduced}
                        >
                          {(id) => (
                            <motion.input
                              id={id}
                              required
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              whileFocus={
                                reduced ? undefined : { scale: 1.008 }
                              }
                              transition={{ type: "spring", stiffness: 500 }}
                              className="w-full rounded-2xl border-2 border-[#27E4F5]/50 bg-white px-4 py-3.5 text-[0.95rem] text-slate-900 outline-none placeholder:text-slate-600 focus:border-[#27E4F5] focus:bg-white focus:ring-2 focus:ring-[#27E4F5]/30"
                              placeholder="Jean Dupont"
                            />
                          )}
                        </Field>
                        <Field
                          label="E-mail professionnel"
                          id="c-mail"
                          index={1}
                          reduced={reduced}
                        >
                          {(id) => (
                            <motion.input
                              id={id}
                              type="email"
                              required
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              whileFocus={
                                reduced ? undefined : { scale: 1.008 }
                              }
                              className="w-full rounded-2xl border-2 border-[#27E4F5]/50 bg-white px-4 py-3.5 text-[0.95rem] text-slate-900 outline-none placeholder:text-slate-600 focus:border-[#27E4F5] focus:bg-white focus:ring-2 focus:ring-[#27E4F5]/30"
                              placeholder="vous@entreprise.com"
                            />
                          )}
                        </Field>
                      </div>

                      <Field
                        label="Entreprise (optionnel)"
                        id="c-co"
                        index={2}
                        reduced={reduced}
                      >
                        {(id) => (
                          <motion.input
                            id={id}
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                            whileFocus={
                              reduced ? undefined : { scale: 1.004 }
                            }
                            className="w-full rounded-2xl border-2 border-[#27E4F5]/50 bg-white px-4 py-3.5 text-[0.95rem] text-slate-900 outline-none placeholder:text-slate-600 focus:border-[#27E4F5] focus:bg-white focus:ring-2 focus:ring-[#27E4F5]/30"
                            placeholder="Sorel ou autre"
                          />
                        )}
                      </Field>

                      <Field
                        label="Sujet"
                        id="c-sub"
                        index={3}
                        reduced={reduced}
                      >
                        {(id) => (
                          <motion.input
                            id={id}
                            required
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            whileFocus={
                              reduced ? undefined : { scale: 1.004 }
                            }
                            className="w-full rounded-2xl border-2 border-[#27E4F5]/50 bg-white px-4 py-3.5 text-[0.95rem] text-slate-900 outline-none placeholder:text-slate-600 focus:border-[#27E4F5] focus:bg-white focus:ring-2 focus:ring-[#27E4F5]/30"
                            placeholder="Devis catalogue, disponibilité…"
                          />
                        )}
                      </Field>

                      <Field
                        label="Message"
                        id="c-msg"
                        index={4}
                        reduced={reduced}
                      >
                        {(id) => (
                          <motion.textarea
                            id={id}
                            required
                            rows={6}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            whileFocus={
                              reduced ? undefined : { scale: 1.003 }
                            }
                            className="w-full resize-y rounded-2xl border-2 border-[#27E4F5]/50 bg-white px-4 py-3.5 text-[0.95rem] leading-relaxed text-slate-900 outline-none placeholder:text-slate-600 focus:border-[#27E4F5] focus:bg-white focus:ring-2 focus:ring-[#27E4F5]/30"
                            placeholder="Décrivez votre besoin, volumes, références produits…"
                          />
                        )}
                      </Field>

                      <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-[11px] leading-snug text-stone-900/42">
                          En envoyant, vous ouvrez votre messagerie avec ce
                          message — aucune donnée n’est stockée sur nos serveurs
                          pour l’instant.
                        </p>
                        <motion.button
                          type="submit"
                          whileHover={
                            reduced ? undefined : { scale: 1.03, y: -1 }
                          }
                          whileTap={reduced ? undefined : { scale: 0.98 }}
                          className="rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-8 py-3.5 text-[0.9rem] font-semibold tracking-wide text-white shadow-lg transition hover:from-orange-600 hover:to-amber-600"
                        >
                          Envoyer
                        </motion.button>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </GlassSurface>
          </section>
        </div>
      </div>
    </div>
  );
}
