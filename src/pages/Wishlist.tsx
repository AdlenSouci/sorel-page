import { ArrowRight, Mail, Trash2, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useSeo } from "../hooks/useSeo";
import { resolvePhotoUrl } from "../lib/api";
import { getVarianteColor, swatchNeedsBorder } from "../lib/colorMap";
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
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#27E4F5]">
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
          <div className="rounded-2xl bg-white px-6 py-16 text-center shadow-sm ring-1 ring-slate-900/5">
            <p className="text-slate-700">
              Votre liste est vide pour le moment.
            </p>
            <Link
              to="/catalogue"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:from-orange-600 hover:to-amber-600"
            >
              Parcourir le catalogue
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
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

            <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-900/5">
              <h2 className="text-lg font-semibold text-slate-950">
                Demander un devis
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">
                Le bouton ci-dessous ouvre votre messagerie avec la liste des
                références déjà rédigée. Complétez les quantités et vos
                coordonnées, puis envoyez.
              </p>
              <a
                href={mailHref}
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:from-orange-600 hover:to-amber-600"
              >
                <Mail className="size-4" aria-hidden />
                Envoyer ma demande
              </a>
              <p className="mt-4 text-xs text-slate-500">
                Pas de messagerie configurée ? Écrivez à{" "}
                <span className="font-medium text-slate-700">
                  {CONTACT_MAIL}
                </span>
                .
              </p>
            </div>
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
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 transition hover:text-red-700"
      >
        <Trash2 className="size-4" aria-hidden />
        Tout vider
      </button>
    );
  }

  return (
    <span className="inline-flex items-center gap-3 text-sm">
      <span className="text-slate-700">Vider la liste ?</span>
      <button
        type="button"
        onClick={() => {
          clearWishlist();
          setConfirming(false);
        }}
        className="font-semibold text-red-700 hover:underline"
      >
        Confirmer
      </button>
      <button
        type="button"
        onClick={() => setConfirming(false)}
        className="text-slate-500 hover:underline"
      >
        Annuler
      </button>
    </span>
  );
}

function WishlistRow({ item }: { item: WishlistItem }) {
  const [src, setSrc] = useState(resolvePhotoUrl(item.photo) ?? PLACEHOLDER);
  const hex = item.couleur ? getVarianteColor(item.couleur) : null;

  return (
    <li className="flex items-center gap-4 p-4">
      <img
        src={src}
        alt=""
        onError={() => setSrc(PLACEHOLDER)}
        className="size-16 shrink-0 rounded-xl bg-slate-100 object-cover"
        loading="lazy"
      />
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-slate-950">
          {item.reference}
        </p>
        <p className="mt-0.5 flex items-center gap-2 text-sm text-slate-600">
          {hex ? (
            <span
              className={[
                "inline-block size-3 shrink-0 rounded-full",
                swatchNeedsBorder(hex) ? "border border-slate-300" : "",
              ].join(" ")}
              style={{ backgroundColor: hex }}
              aria-hidden
            />
          ) : null}
          <span className="truncate">
            {[item.gamme, item.couleur].filter(Boolean).join(" — ")}
          </span>
        </p>
      </div>
      <button
        type="button"
        onClick={() => removeFromWishlist(item.id)}
        aria-label={`Retirer ${item.reference} de ma liste`}
        className="shrink-0 rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-red-700"
      >
        <X className="size-4" aria-hidden />
      </button>
    </li>
  );
}
