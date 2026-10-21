import { cn } from "@/lib/utils";
import { getVarianteColor, swatchNeedsBorder } from "../lib/colorMap";

/** Pastille ronde d'un coloris (filtres, fiches article, liste). */
export function ColorSwatch({
  name,
  ring = false,
  className,
}: {
  name: string;
  ring?: boolean;
  className?: string;
}) {
  const hex = getVarianteColor(name);
  return (
    <span
      className={cn(
        "inline-block size-4 shrink-0 rounded-full",
        swatchNeedsBorder(hex) && "border border-slate-300",
        ring && "ring-2 ring-[#27E4F5] ring-offset-1",
        className,
      )}
      style={{ backgroundColor: hex }}
      aria-hidden
    />
  );
}
