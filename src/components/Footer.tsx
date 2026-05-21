import { Link } from "react-router-dom";
import { motion } from "motion/react";
import sorelLogo from "../assets/Sorel_logo_noi.svg";

export function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-gradient-to-b from-slate-950 via-black to-black text-zinc-200">
      <div className="absolute top-0 left-0 right-0 h-16 overflow-hidden -translate-y-full">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="h-full w-full"
          aria-hidden
        >
          <path
            d="M0,60 Q150,80 300,60 T600,60 T900,60 T1200,60 L1200,120 L0,120 Z"
            fill="#0a0a0a"
            opacity={0.92}
          />
          <path
            d="M0,70 Q200,50 400,70 T800,70 T1200,70 L1200,120 L0,120 Z"
            fill="#000000"
          />
        </svg>
      </div>

      <div className="container mx-auto px-6 py-12 md:px-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-16">
          <div>
            <Link to="/" className="mb-4 inline-block">
              <motion.img
                src={sorelLogo}
                alt="Sorel Plastiques"
                className="h-12 w-auto brightness-0 invert"
                whileHover={{ scale: 1.08, rotate: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              />
            </Link>
            <p className="mb-3 text-[18px] font-semibold text-white">
              Sorel Plastiques
            </p>
            <p className="mb-6 text-sm leading-relaxed text-zinc-400">
              Solutions plastiques durables : finitions, colorations et produits
              sur mesure pour l’industrie et la maison.
            </p>
            <div className="flex gap-4 text-zinc-300">
              <a
                href="https://facebook.com"
                className="transition-colors hover:text-white"
                aria-label="Facebook"
                target="_blank"
                rel="noreferrer"
              >
                <svg className="size-5 fill-current" viewBox="0 0 24 24" aria-hidden>
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="https://instagram.com"
                className="transition-colors hover:text-white"
                aria-label="Instagram"
                target="_blank"
                rel="noreferrer"
              >
                <svg className="size-5 fill-current" viewBox="0 0 24 24" aria-hidden>
                  <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 01-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 017.8 2m-.45 2.05A5.76 5.76 0 005.06 9.6v6.73A5.61 5.61 0 0010.6 21.9h4.73A5.78 5.78 0 0021 16.43V9.71a5.66 5.66 0 00-5.65-5.66h-8.07m8.94 2.63a1.62 1.62 0 010 3.24 1.62 1.62 0 010-3.24M16.08 11.94a6.63 6.63 0 01-6.61 6.62 6.63 6.63 0 01-6.62-6.62 6.63 6.63 0 016.61-6.63 6.63 6.63 0 016.61 6.63" />
                </svg>
              </a>
              <a
                href="https://twitter.com"
                className="transition-colors hover:text-white"
                aria-label="X"
                target="_blank"
                rel="noreferrer"
              >
                <svg
                  className="size-5 fill-current"
                  viewBox="0 0 24 24"
                  aria-hidden
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://linkedin.com"
                className="transition-colors hover:text-white"
                aria-label="LinkedIn"
                target="_blank"
                rel="noreferrer"
              >
                <svg className="size-5 fill-current" viewBox="0 0 24 24" aria-hidden>
                  <path d="M19 3a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h14zm-9.571 13.786h-2v-6.429h2v6.43zm-.999-8.036a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zM19.036 17.786h-2.143v-3.036c0-.643-.071-1.464-.893-1.464-.892 0-1.036.696-1.036 1.411v3.089h-2.143V11.357h2.049v.857h.028c.251-.478.964-.986 2.089-.986 2.214 0 2.625 1.429 2.625 3.393v4.164z" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <p className="mb-4 text-sm font-bold text-white">
              Produits
            </p>
            <div className="space-y-2.5">
              <NavButton to="/catalogue">Catalogue</NavButton>
              <NavButton to="/#produits">Nos références</NavButton>
              <NavButton to="/a-propos">Notre histoire</NavButton>
            </div>
          </div>

          <div>
            <p className="mb-4 text-sm font-bold text-white">
              Légal
            </p>
            <div className="space-y-2.5">
              <NavButton to="#">Politique de confidentialité</NavButton>
              <NavButton to="#">Mentions légales</NavButton>
              <NavButton to="#">CGV</NavButton>
            </div>
          </div>

          <div>
            <p className="mb-4 text-sm font-bold text-white">
              Contact
            </p>
            <div className="space-y-2.5">
              <NavButton to="/contact">Écrire</NavButton>
              <NavButton to="#">Carrières</NavButton>
              <NavButton to="#">Presse</NavButton>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/[0.09]">
        <div className="container mx-auto px-6 py-4 md:px-16">
          <p className="text-center text-xs text-zinc-500">
            © {new Date().getFullYear()} Sorel Plastiques — Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}

function NavButton({ to, children }: { to: string; children: string }) {
  const isMail = to.startsWith("mailto:");
  const baseClasses =
    "block text-left text-sm text-zinc-300 transition-colors hover:text-white";
  if (isMail) {
    return (
      <a href={to} className={baseClasses}>
        {children}
      </a>
    );
  }
  if (to.startsWith("/")) {
    return (
      <Link to={to} className={baseClasses}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" className={`w-full ${baseClasses}`}>
      {children}
    </button>
  );
}
