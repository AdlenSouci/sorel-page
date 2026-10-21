import type { SVGProps } from "react";

/**
 * Icônes dessinées à la main (trait légèrement irrégulier + filtre de tremblement).
 * Remplacent la bibliothèque d'icônes générique : même forme, même main, partout.
 * Le filtre `sk-rough-sm` est défini dans SketchDefs (monté une fois dans le Layout).
 */
const PATHS = {
  arrowRight: [
    "M3.5 12.3 C8 11.8 14 12.4 20 12",
    "M14 6.3 C16 8.5 18 10.3 20.3 12 C18 13.8 16 15.6 14.2 17.8",
  ],
  arrowLeft: [
    "M20.5 12.3 C16 11.8 10 12.4 4 12",
    "M10 6.3 C8 8.5 6 10.3 3.7 12 C6 13.8 8 15.6 9.8 17.8",
  ],
  arrowUpRight: [
    "M6 18 C9 14.5 13 10.5 18 6",
    "M9.5 5.8 C12 5.6 15 5.9 18.2 5.8 C18.1 9 18.4 12 18.2 14.5",
  ],
  check: ["M4.2 12.8 C6 14.5 7.5 16.2 9.3 18 C12.8 12.8 16.5 8.5 20.3 5.5"],
  plus: ["M12 4.2 C11.8 9 12.3 15 12 19.8", "M4.3 12.2 C9 11.8 15 12.4 19.7 12"],
  x: ["M5.2 5 C9 9 14 14.5 18.8 19", "M18.9 5.2 C14.5 9.5 9.5 14.5 5 18.9"],
  search: [
    "M10.6 4.3 C14 4.2 16.9 7 16.8 10.5 C16.7 14 13.9 16.8 10.4 16.7 C6.9 16.6 4.2 13.9 4.3 10.4 C4.4 7 7.2 4.4 10.6 4.3",
    "M15.2 15.3 C17 17.2 18.8 19 20.4 20.6",
  ],
  mail: [
    "M3.6 6.2 C9 5.8 15 6.3 20.4 6 C20.6 10 20.3 14 20.5 18 C15 18.4 9 17.9 3.5 18.2 C3.8 14 3.4 10 3.6 6.2",
    "M3.8 6.8 C7 9.5 9.6 11.5 12 13 C14.6 11.4 17.4 9.4 20.2 6.8",
  ],
  trash: [
    "M4 6.5 C8 6.2 15 6.8 20 6.4",
    "M9.2 6.3 C9.3 5 9.2 4.2 9.4 3.7 C11 3.6 13 3.8 14.6 3.6 C14.8 4.3 14.7 5.2 14.8 6.4",
    "M6.2 7 C6.4 11 6.6 15 6.9 20 C10 20.3 14 19.8 17.1 20 C17.4 15 17.6 11 17.8 7",
    "M10.2 10.5 C10.3 13 10.1 15.5 10.3 17.5",
    "M13.8 10.5 C13.7 13 13.9 15.5 13.7 17.5",
  ],
  menu: [
    "M4 7 C9 6.6 15 7.2 20 6.8",
    "M4 12.2 C9 11.8 15 12.4 20 12",
    "M4 17.3 C9 16.9 15 17.5 20 17.1",
  ],
  alert: [
    "M12 3.8 C16.6 3.7 20.3 7.4 20.2 12 C20.1 16.6 16.5 20.3 11.9 20.2 C7.3 20.1 3.7 16.5 3.8 11.9 C3.9 7.4 7.5 3.9 12 3.8",
    "M12 7.8 C11.9 9.5 12.1 11.2 12 12.8",
    "M12 15.9 C12 16.1 12 16.3 12 16.5",
  ],
  home: [
    "M3.5 11.2 C6.5 8.5 9.3 5.8 12 3.6 C14.8 5.8 17.6 8.4 20.5 11.2",
    "M5.7 9.8 C5.9 12.8 5.6 16.5 5.9 20.2 C9.5 20.5 14.5 20 18.1 20.3 C18.4 16.5 18.1 12.8 18.3 9.9",
    "M10 20.2 C10.1 17.5 9.9 15.5 10.1 13.3 C11.2 13.2 12.8 13.3 13.9 13.2 C14.1 15.5 13.9 17.6 14 20.2",
  ],
  box: [
    "M12 3.5 C15.5 5.2 18.4 6.9 20.5 8.2 C20.6 11.5 20.4 14.6 20.5 16.8 C17.6 18.5 14.7 20 12 21 C9.2 19.9 6.4 18.4 3.5 16.8 C3.6 14.6 3.4 11.4 3.5 8.2 C6.5 6.6 9.3 5.2 12 3.5",
    "M3.8 8.4 C6.8 10.1 9.6 11.5 12 12.7 C14.5 11.4 17.4 9.9 20.2 8.4",
    "M12 12.8 C11.9 15.5 12.1 18.3 12 20.8",
  ],
  boxes: [
    "M3.8 12.8 C6 12.6 9 13 10.8 12.7 C11 14.5 10.7 16.5 10.9 18.8 C8.5 19 6 18.6 3.9 18.9 C4.1 16.8 3.7 14.8 3.8 12.8",
    "M13.2 12.8 C15.3 12.6 18.2 13 20.1 12.7 C20.3 14.6 19.9 16.5 20.2 18.8 C17.9 19 15.4 18.6 13.3 18.9 C13.5 16.8 13.1 14.8 13.2 12.8",
    "M8.5 5.2 C10.3 5 13.6 5.4 15.5 5.1 C15.7 7 15.3 9 15.5 11.2 C13.2 11.4 10.6 11 8.6 11.3 C8.8 9.2 8.4 7.2 8.5 5.2",
  ],
  clipboard: [
    "M6 5.3 C8.5 5 15 5.5 18 5.2 C18.3 9.5 17.8 15 18.1 20.6 C14.5 20.9 9.5 20.4 5.9 20.7 C6.2 15.5 5.7 10 6 5.3",
    "M9.2 5.2 C9.1 4.4 9.3 3.7 9.4 3.4 C11 3.3 13 3.5 14.6 3.3 C14.7 3.9 14.8 4.6 14.8 5.3",
    "M9.2 10.3 C10.5 10.1 12.5 10.4 14.8 10.2",
    "M9.2 14.2 C10.6 14 12.4 14.3 14.8 14.1",
  ],
  info: [
    "M12 3.8 C16.6 3.7 20.3 7.4 20.2 12 C20.1 16.6 16.5 20.3 11.9 20.2 C7.3 20.1 3.7 16.5 3.8 11.9 C3.9 7.4 7.5 3.9 12 3.8",
    "M12 10.8 C11.9 12.8 12.1 14.8 12 16.8",
    "M12 7.6 C12 7.8 12 8 12 8.2",
  ],
  palette: [
    "M12 3.7 C17 3.6 20.4 7.2 20.3 11.2 C20.2 14.2 17.8 15.2 15.6 15 C13.6 14.8 12.6 16 13.4 17.6 C14 19 13.2 20.4 11.7 20.3 C7 20.1 3.6 16.6 3.7 11.9 C3.8 7.3 7.5 3.8 12 3.7",
    "M7.6 11 C7.7 11.1 7.7 11.2 7.7 11.3",
    "M10.4 7.6 C10.5 7.7 10.5 7.8 10.5 7.9",
    "M14.6 7.8 C14.7 7.9 14.7 8 14.7 8.1",
  ],
  chevronDown: ["M5.5 9.3 C8 11.5 10 13.5 12 15.6 C14 13.4 16.2 11.4 18.6 9"],
  chevronUp: ["M5.5 14.8 C8 12.6 10 10.6 12 8.4 C14 10.6 16.2 12.6 18.6 15"],
} as const;

type IconName = keyof typeof PATHS;
type IconProps = SVGProps<SVGSVGElement>;
/** Type d'une icône, pour les composants qui en reçoivent une en paramètre. */
export type IconComponent = (props: IconProps) => React.JSX.Element;

function make(name: IconName, label: string) {
  const paths = PATHS[name];
  function Icon(props: IconProps) {
    return (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.9}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
        {...props}
      >
        <g filter="url(#sk-rough-sm)">
          {paths.map((d) => (
            <path key={d} d={d} />
          ))}
        </g>
      </svg>
    );
  }
  Icon.displayName = label;
  return Icon;
}

export const ArrowRight = make("arrowRight", "ArrowRight");
export const ArrowLeft = make("arrowLeft", "ArrowLeft");
export const ArrowUpRight = make("arrowUpRight", "ArrowUpRight");
export const Check = make("check", "Check");
export const Plus = make("plus", "Plus");
export const X = make("x", "X");
export const Search = make("search", "Search");
export const Mail = make("mail", "Mail");
export const Trash2 = make("trash", "Trash");
export const Menu = make("menu", "Menu");
export const CircleAlert = make("alert", "Alert");
export const Home = make("home", "Home");
export const Package = make("box", "Package");
export const Boxes = make("boxes", "Boxes");
export const ClipboardList = make("clipboard", "ClipboardList");
export const Info = make("info", "Info");
export const Palette = make("palette", "Palette");

// Noms utilisés par les composants shadcn.
export const CheckIcon = Check;
export const XIcon = X;
export const ChevronDownIcon = make("chevronDown", "ChevronDown");
export const ChevronUpIcon = make("chevronUp", "ChevronUp");
