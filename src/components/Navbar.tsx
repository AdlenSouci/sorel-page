import type { IconComponent } from "@/components/icons";
import { Home, Mail, Info, Package, ClipboardList } from "@/components/icons";
import { LayoutGroup, motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { Link, NavLink, useLocation, type Location } from "react-router-dom";
import sorelLogo from "../assets/Sorel_logo_noi.svg";
import { useWishlist } from "../lib/wishlist";

const bubble = {
  type: "spring" as const,
  stiffness: 400,
  damping: 40,
  mass: 0.5,
};


function isHomeRoot(loc: Location) {
  return loc.pathname === "/" && loc.hash !== "#produits";
}

function cn(...p: Array<string | false>) {
  return p.filter(Boolean).join(" ");
}

/** Un seul conteneur pilule ; pas de deuxième cercle avec padding décoratif = pas d’illusion de double contour. */
function NavItemSlot({
  active,
  children,
  chipColor,
}: {
  active: boolean;
  children: ReactNode;
  chipColor: string;
}) {
  return (
    <div className="relative flex min-w-[3.4rem] shrink-0 justify-center px-0.5 sm:min-w-[5.5rem] sm:px-3">
      {active ? (
        <motion.div
          layoutId="nav-one-chip"
          className="pointer-events-none absolute inset-0 rounded-xl"
          style={{ backgroundColor: `${chipColor}20` }}
          transition={bubble}
        />
      ) : null}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

function linkCn(active: boolean) {
  return cn(
    "flex flex-col items-center justify-center gap-0.5 py-2 text-center text-[8.5px] font-semibold uppercase tracking-[0.01em] outline-none transition-[color,opacity] duration-200 sm:gap-1 sm:text-[0.6875rem] sm:tracking-[0.11em]",
    active
      ? "font-bold text-slate-950"
      : "font-medium text-slate-600 hover:text-slate-900",
  );
}

function NavIcon({
  Icon,
  muted,
}: {
  Icon: IconComponent;
  muted: boolean | null;
}) {
  return (
    <motion.span
      whileHover={muted ? undefined : { y: -1 }}
      whileTap={muted ? undefined : { scale: 0.95 }}
      transition={{ type: "spring", stiffness: 500, damping: 32 }}
      className="inline-flex text-inherit"
    >
      <Icon className="size-5 shrink-0" strokeWidth={1.85} aria-hidden />
    </motion.span>
  );
}

const CHIP_COLORS = {
  home: "#27E4F5",      // Cyan pour accueil
  catalogue: "#FF8C42", // Orange pour catalogue
  liste: "#10B981",     // Vert pour ma liste
  about: "#7C3AED",     // Violet pour à propos
  contact: "#EC4899",   // Rose pour contact
} as const;

function getChipColor(location: Location): string {
  if (location.pathname === "/") {
    return CHIP_COLORS.home;
  }
  if (location.pathname.startsWith("/catalogue")) {
    return CHIP_COLORS.catalogue;
  }
  if (location.pathname.startsWith("/mes-references")) {
    return CHIP_COLORS.liste;
  }
  if (location.pathname.startsWith("/a-propos")) {
    return CHIP_COLORS.about;
  }
  if (location.pathname.startsWith("/contact")) {
    return CHIP_COLORS.contact;
  }
  return CHIP_COLORS.home;
}

export function Navbar() {
  const loc = useLocation();
  const muted = useReducedMotion();
  const liquid = muted ? undefined : "url(#sorel-liquid-glass)" as const;
  const chipColor = getChipColor(loc);
  const wishlist = useWishlist();

  return (
    <nav
      className="pointer-events-none fixed inset-x-0 top-[max(0.65rem,env(safe-area-inset-top))] z-[200] flex justify-center px-3 pt-0.5"
      aria-label="Navigation principale"
    >
      <div className="pointer-events-auto flex w-[min(calc(100vw-26px),58rem)] max-w-none flex-col items-center">
        {/* Léger halo sous la pilule — pas une seconde bordure */}
        <div
          aria-hidden
          className="-mb-6 h-8 w-[min(100%,520px)] rounded-full bg-black/[0.04] blur-2xl"
        />

        <div
          className="relative h-[54px] w-full overflow-hidden rounded-full sm:h-[56px]"
          style={{
            boxShadow:
              "0 20px 50px rgba(42, 32, 24, 0.08), 0 6px 16px rgba(42, 32, 24, 0.04)",
          }}
        >
          {/* Calque verre seul */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-full"
            style={{
              background: "rgba(255, 252, 248, 0.11)",
              WebkitBackdropFilter: "blur(28px) saturate(195%)",
              backdropFilter: "blur(28px) saturate(195%)",
              filter: liquid,
              WebkitFilter: liquid,
            }}
          />

          <LayoutGroup id="dock">
            <div
              className="relative z-10 flex h-full items-center justify-between overflow-x-auto px-3 [scrollbar-width:none] sm:justify-center sm:gap-1 sm:px-6 md:px-8 [&::-webkit-scrollbar]:hidden"
            >
              {/* Logo Sorel dans la navbar */}
              <Link to="/" className="mr-2 hidden shrink-0 sm:block">
                <motion.img
                  src={sorelLogo}
                  alt="Sorel"
                  className="h-9 w-auto"
                  whileHover={{ scale: 1.08, rotate: 2 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                />
              </Link>

              <NavItemSlot active={isHomeRoot(loc)} chipColor={chipColor}>
                <Link to="/" className={linkCn(isHomeRoot(loc))}>
                  <NavIcon Icon={Home} muted={muted} />
                  <span className="nav-l whitespace-nowrap">Accueil</span>
                </Link>
              </NavItemSlot>

              <NavItemSlot active={loc.pathname.startsWith("/catalogue")} chipColor={chipColor}>
                <NavLink
                  to="/catalogue"
                  className={({ isActive }) => linkCn(isActive)}
                >
                  <NavIcon Icon={Package} muted={muted} />
                  <span className="nav-l whitespace-nowrap">Catalogue</span>
                </NavLink>
              </NavItemSlot>

              <NavItemSlot active={loc.pathname.startsWith("/mes-references")} chipColor={chipColor}>
                <NavLink
                  to="/mes-references"
                  className={({ isActive }) => linkCn(isActive)}
                >
                  <span className="relative inline-flex">
                    <NavIcon Icon={ClipboardList} muted={muted} />
                    {wishlist.length > 0 ? (
                      <span
                        className="absolute -right-2 -top-1.5 min-w-[1.05rem] rounded-full bg-orange-600 px-1 text-center text-[10px] font-bold leading-[1.05rem] text-white"
                        aria-hidden
                      >
                        {wishlist.length}
                      </span>
                    ) : null}
                  </span>
                  <span className="nav-l whitespace-nowrap">
                    Ma liste
                    <span className="sr-only">
                      {wishlist.length > 0
                        ? ` (${wishlist.length} référence${wishlist.length > 1 ? "s" : ""})`
                        : " (vide)"}
                    </span>
                  </span>
                </NavLink>
              </NavItemSlot>

              <NavItemSlot active={loc.pathname.startsWith("/a-propos")} chipColor={chipColor}>
                <NavLink
                  to="/a-propos"
                  className={({ isActive }) => linkCn(isActive)}
                >
                  <NavIcon Icon={Info} muted={muted} />
                  <span className="nav-l whitespace-nowrap">À propos</span>
                </NavLink>
              </NavItemSlot>

              <NavItemSlot active={loc.pathname.startsWith("/contact")} chipColor={chipColor}>
                <NavLink
                  to="/contact"
                  className={({ isActive }) => linkCn(isActive)}
                >
                  <NavIcon Icon={Mail} muted={muted} />
                  <span className="nav-l whitespace-nowrap">Contact</span>
                </NavLink>
              </NavItemSlot>
            </div>
          </LayoutGroup>
        </div>
      </div>
    </nav>
  );
}
