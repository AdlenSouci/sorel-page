import { Check, Plus } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRef, useState, type PointerEvent } from "react";
import { Link } from "react-router-dom";
import { itemTitle } from "../lib/api";
import { usePhotoArticle } from "../lib/photos";
import { isInWishlist, toggleWishlist, useWishlist } from "../lib/wishlist";
import type { CatalogueItemDTO } from "../types/category";
import { ColorSwatch } from "./ColorSwatch";

const PLACEHOLDER = "/product-placeholder.svg";
/** inclinaison maximale au survol, en degrés (discrète) */
const TILT = 4;

/** Carte d'un article : photo, référence, coloris et bouton « Ajouter à ma liste ». */
export function ArticleCard({ item }: { item: CatalogueItemDTO }) {
  const photoArticle = usePhotoArticle();
  const [erreur, setErreur] = useState(false);
  const src = erreur ? PLACEHOLDER : (photoArticle(item.codeArticle, item.photo) ?? PLACEHOLDER);
  const fiche = item.codeArticle ? `/article/${encodeURIComponent(item.codeArticle)}` : null;
  const image = (
    <img
      src={src}
      alt={itemTitle(item)}
      onError={() => setErreur(true)}
      className="aspect-[5/4] w-full bg-slate-100 object-cover text-transparent"
      loading="lazy"
    />
  );
  const wishlist = useWishlist();
  const saved = isInWishlist(wishlist, item.id);
  const ref = useRef<HTMLDivElement>(null);

  const onToggle = () =>
    toggleWishlist({
      id: item.id,
      reference: item.codeArticle ?? item.libelle,
      gamme: item.gamme ?? item.categoryNom,
      couleur: item.variante,
      photo: item.photo,
    });

  // légère inclinaison 3D vers le pointeur (sans état React : on écrit le style directement)
  function onMove(e: PointerEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `rotateX(${(-y * TILT).toFixed(2)}deg) rotateY(${(x * TILT).toFixed(2)}deg) translateZ(0)`;
  }
  function onLeave() {
    if (ref.current) ref.current.style.transform = "";
  }

  return (
    <li className="[perspective:900px]">
      <div
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        className="h-full transition-transform duration-300 ease-out will-change-transform"
      >
        <Card className="h-full gap-0 overflow-hidden rounded-2xl py-0 shadow-sm ring-slate-900/5 transition-shadow duration-300 hover:shadow-xl hover:shadow-slate-900/10">
          {fiche ? (
            <Link to={fiche} aria-label={itemTitle(item)} className="block">
              {image}
            </Link>
          ) : (
            image
          )}
          <div className="flex flex-1 flex-col p-3">
            <div className="flex items-start gap-1.5">
              {item.variante ? <ColorSwatch name={item.variante} className="mt-0.5 size-3.5" /> : null}
              <h3 className="text-[13px] font-semibold leading-snug break-words text-slate-950">
                {fiche ? (
                  <Link to={fiche} className="hover:text-orange-700 hover:underline">
                    {itemTitle(item)}
                  </Link>
                ) : (
                  itemTitle(item)
                )}
              </h3>
            </div>
            {item.description ? (
              <p className="mt-1 text-xs text-slate-600">{item.description}</p>
            ) : null}

            <Button
              onClick={onToggle}
              aria-pressed={saved}
              variant={saved ? "secondary" : "brand"}
              className="mt-3 h-auto w-full py-1.5 text-xs"
            >
              {saved ? (
                <>
                  <Check aria-hidden />
                  Dans ma liste
                </>
              ) : (
                <>
                  <Plus aria-hidden />
                  Ajouter à ma liste
                </>
              )}
            </Button>
          </div>
        </Card>
      </div>
    </li>
  );
}
