import { ArrowRight, Mail, Trash2, X } from "@/components/icons";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useSeo } from "../hooks/useSeo";
import { usePhotoArticle } from "../lib/photos";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ColorSwatch } from "../components/ColorSwatch";
import {
  buildQuoteMail,
  clearWishlist,
  mailtoQuery,
  removeFromWishlist,
  useWishlist,
  type WishlistItem,
} from "../lib/wishlist";

const PLACEHOLDER = "/product-placeholder.svg";
const CONTACT_MAIL = "contact@sorel-plastiques.local";

export function Wishlist() {
  const items = useWishlist();

  useSeo({
    title: "Ma liste de références",
    description:
      "Les références Sorel Plastiques que vous avez retenues. Envoyez-les en une fois pour recevoir un devis.",
  });

  const mailHref = `mailto:${CONTACT_MAIL}?${mailtoQuery({
    subject: `Demande de devis — ${items.length} référence${items.length > 1 ? "s" : ""}`,
    body: buildQuoteMail(items),
  })}`;

  return (
    <div className="px-6 py-14 md:px-16 md:py-20">
      <header className="mx-auto mb-10 max-w-4xl">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-orange-700">
          Devis
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
          Ma liste de références
        </h1>
        <p className="mt-3 max-w-2xl text-slate-700">
          Ajoutez les références qui vous intéressent depuis le catalogue, puis
          envoyez-nous la liste complète. Elle reste enregistrée dans votre
          navigateur — aucun compte n&apos;est nécessaire.
        </p>
      </header>

      <div className="mx-auto max-w-4xl">
        {items.length === 0 ? (
          <Card className="items-center rounded-2xl px-6 py-16 text-center text-base shadow-sm ring-slate-900/5">
            <p className="text-slate-700">
              Votre liste est vide pour le moment.
            </p>
            <Button asChild variant="brand" size="pill" className="mt-6">
              <Link to="/catalogue">
                Parcourir le catalogue
                <ArrowRight aria-hidden />
              </Link>
            </Button>
          </Card>
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-slate-600">
                {items.length} référence{items.length > 1 ? "s" : ""}
              </p>
              <ClearButton />
            </div>

            <ul className="divide-y divide-slate-100 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-900/5">
              {items.map((item) => (
                <WishlistRow key={item.id} item={item} />
              ))}
            </ul>

            <Card className="mt-8 block rounded-2xl p-6 text-base shadow-sm ring-slate-900/5">
              <h2 className="text-lg font-semibold text-slate-950">
                Demander un devis
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">
                Le bouton ci-dessous ouvre votre messagerie avec la liste des
                références déjà rédigée. Complétez les quantités et vos
                coordonnées, puis envoyez.
              </p>
              <Button asChild variant="brand" size="pill" className="mt-5">
                <a href={mailHref}>
                  <Mail aria-hidden />
                  Envoyer ma demande
                </a>
              </Button>
              <p className="mt-4 text-xs text-slate-500">
                Pas de messagerie configurée ? Écrivez à{" "}
                <span className="font-medium text-slate-700">
                  {CONTACT_MAIL}
                </span>
                .
              </p>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}

function ClearButton() {
  const [confirming, setConfirming] = useState(false);

  if (!confirming) {
    return (
      <Button
        variant="ghost"
        onClick={() => setConfirming(true)}
        className="h-auto px-0 text-sm font-normal text-slate-500 hover:bg-transparent hover:text-red-700"
      >
        <Trash2 aria-hidden />
        Tout vider
      </Button>
    );
  }

  return (
    <span className="inline-flex items-center gap-3 text-sm">
      <span className="text-slate-700">Vider la liste ?</span>
      <Button
        variant="link"
        onClick={() => {
          clearWishlist();
          setConfirming(false);
        }}
        className="h-auto px-0 font-semibold text-red-700"
      >
        Confirmer
      </Button>
      <Button
        variant="link"
        onClick={() => setConfirming(false)}
        className="h-auto px-0 font-normal text-slate-500"
      >
        Annuler
      </Button>
    </span>
  );
}

function WishlistRow({ item }: { item: WishlistItem }) {
  const photoArticle = usePhotoArticle();
  const [erreur, setErreur] = useState(false);
  const src = erreur ? PLACEHOLDER : (photoArticle(item.reference, item.photo) ?? PLACEHOLDER);

  return (
    <li className="flex items-center gap-4 p-4">
      <img
        src={src}
        alt=""
        onError={() => setErreur(true)}
        className="size-16 shrink-0 rounded-xl bg-slate-100 object-cover"
        loading="lazy"
      />
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-slate-950">
          {item.reference}
        </p>
        <p className="mt-0.5 flex items-center gap-2 text-sm text-slate-600">
          {item.couleur ? <ColorSwatch name={item.couleur} className="size-3" /> : null}
          <span className="truncate">
            {[item.gamme, item.couleur].filter(Boolean).join(" — ")}
          </span>
        </p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => removeFromWishlist(item.id)}
        aria-label={`Retirer ${item.reference} de ma liste`}
        className="shrink-0 rounded-full text-slate-400 hover:bg-slate-100 hover:text-red-700"
      >
        <X aria-hidden />
      </Button>
    </li>
  );
}
