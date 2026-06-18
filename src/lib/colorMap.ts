/** Pastille hex pour une variante catalogue (nom DB → couleur affichée) */
const EXACT: Record<string, string> = {
  BLANC: "#f8f8f8",
  NOIR: "#1c1c1c",
  BLACK: "#1c1c1c",
  NATUREL: "#e8dcc8",
  VERT: "#2d8a4e",
  GREEN: "#2d8a4e",
  "BEIGE PIG": "#d4b896",
  "BEIGE PIG FONCE": "#b8956a",
  BEIGE: "#d9c4a0",
  GRIS: "#9ca3af",
  "GRIS ANTHRACITE": "#3d4450",
  "GRIS CIMENT": "#a8a29e",
  "GRIS VIOLINE": "#6b5b6e",
  BLEU: "#2563eb",
  "BLEU CLAIR": "#7dd3fc",
  "BLEU FONCE": "#1e3a8a",
  ROUGE: "#dc2626",
  RED: "#dc2626",
  MARRON: "#78350f",
  "MARRON BRIQUE": "#a0522d",
  "MARRON FONCE": "#5c3317",
  ROSE: "#f472b6",
  JAUNE: "#facc15",
  YELLOW: "#facc15",
  ORANGE: "#f97316",
  IVOIRE: "#fffff0",
  OR: "#d4a017",
  DORE: "#c9a227",
  CRISTAL: "#e0f2fe",
  "CRISTAL NOIR": "#374151",
  TRANSPARENT: "#e5e7eb",
  OPAQUE: "#d1d5db",
  VIOLET: "#7c3aed",
  PARME: "#c4b5fd",
  FUSHIA: "#db2777",
  PRUNE: "#6b21a8",
  BORDEAUX: "#7f1d1d",
  BRIQUE: "#b45309",
  BRUN: "#92400e",
  TAUPE: "#a18a7e",
  SAUGE: "#84a98c",
  TERRACOTTA: "#c05621",
  "TERRE CUITE": "#b7410e",
  ECRU: "#f5f0e6",
  BETON: "#b0aaa0",
  CARBONE: "#2f2f2f",
  "COULEUR HUITRE": "#f3e5d8",
  "VERT CLAIR": "#86efac",
  "VERT FONCE": "#166534",
  "VERT CANARD": "#0d9488",
  "VERT PASTEL": "#a7f3d0",
  "VERT MELEZE": "#4d7c0f",
  "VERT SAPIN": "#14532d",
  "VERT BOUTEILLE": "#1b4332",
  "VERT ANIS": "#bef264",
  "VERT PP": "#22c55e",
  "VERT PS": "#16a34a",
  WHITE: "#f8f8f8",
};

const KEYWORD_RULES: [RegExp, string][] = [
  [/BLANC|WHITE|IVOIRE|ECRU|CRISTAL|TRANSPARENT|OPAQUE/i, "#f5f5f5"],
  [/NOIR|BLACK|ANTHRACITE|CARBONE/i, "#222222"],
  [/ROUGE|RED|BORDEAUX|BRIQUE/i, "#dc2626"],
  [/BLEU|BLUE/i, "#2563eb"],
  [/VERT|GREEN|SAUGE|SAPIN/i, "#16a34a"],
  [/JAUNE|YELLOW|OR|DORE/i, "#eab308"],
  [/ORANGE/i, "#f97316"],
  [/ROSE|FUSHIA|PARME|VIOLET|PRUNE/i, "#ec4899"],
  [/BEIGE|NATUREL|TAUPE|TERRE|MARRON|BRUN|HUITRE/i, "#c4a882"],
  [/GRIS|BETON|CIMENT/i, "#9ca3af"],
  [/MARRON/i, "#78350f"],
];

function hashHex(input: string): string {
  let h = 0;
  for (let i = 0; i < input.length; i++) h = (h * 31 + input.charCodeAt(i)) >>> 0;
  const hue = h % 360;
  return `hsl(${hue} 45% 52%)`;
}

export function getVarianteColor(name: string): string {
  const key = name.trim().toUpperCase();
  if (EXACT[key]) return EXACT[key];
  for (const [re, hex] of KEYWORD_RULES) {
    if (re.test(name)) return hex;
  }
  return hashHex(key);
}

/** Bordure si la pastille est claire */
export function swatchNeedsBorder(hex: string): boolean {
  const c = hex.toLowerCase();
  if (c.startsWith("hsl")) return parseInt(c.split(" ")[2] ?? "50") > 70;
  if (c === "#f8f8f8" || c === "#f5f5f5" || c === "#fffff0" || c === "#e5e7eb" || c === "#e0f2fe" || c === "#f5f0e6" || c === "#f3e5d8")
    return true;
  const n = parseInt(c.replace("#", ""), 16);
  if (Number.isNaN(n)) return false;
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return (r * 299 + g * 587 + b * 114) / 1000 > 210;
}
