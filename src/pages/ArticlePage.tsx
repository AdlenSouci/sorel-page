import { ArrowLeft, Check, Plus } from "@/components/icons";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ColorSwatch } from "../components/ColorSwatch";
import { ErrorMessage } from "../components/LoadState";
import { useSeo } from "../hooks/useSeo";
import { fetchArticle } from "../lib/api";
import { FORMES, OPTIONS, formatMl } from "../lib/articles";
import { formatConditionnement, formatDimensions } from "../lib/gammes";
import { usePhotoArticle } from "../lib/photos";
import { isInWishlist, toggleWishlist, useWishlist } from "../lib/wishlist";
import type { ArticleDetailDTO, ProduitAssocieDTO } from "../types/category";

const PLACEHOLDER = "/product-placeholder.svg";

function Photo({ src, alt, className }: { src: string | null; alt: string; className: string }) {
  // si la photo n'existe pas sur le disque, on retombe sur l'image « Photo à venir »
  const [erreur, setErreur] = useState<string | null>(null);
  const adresse = src && erreur !== src ? src : PLACEHOLDER;
  return (
    <img
      src={adresse}
      alt={alt}
      onError={() => setErreur(src)}
      className={className}
      loading="lazy"
    />
  );
}

function Associe({ produit, photo }: { produit: ProduitAssocieDTO; photo: string | null }) {
  const corps = (
    <>
      <Photo
        src={photo}
        alt={produit.description ?? produit.reference}
        className="aspect-[5/4] w-full bg-slate-100 object-cover text-transparent"
      />
      <div className="p-3">
        <p className="text-[13px] leading-snug font-semibold break-words text-slate-950">
          {produit.reference}
        </p>
        {produit.description ? (
          <p className="mt-1 text-xs text-slate-600">{produit.description}</p>
        ) : null}
        {produit.couleur || produit.contenance ? (
          <p className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-700">
            {produit.couleur ? <ColorSwatch name={produit.couleur} className="size-3.5" /> : null}
            {[produit.couleur, produit.contenance ? formatMl(produit.contenance) : null]
              .filter(Boolean)
              .join(" · ")}
          </p>
        ) : null}
      </div>
    </>
  );
  const carte =
    "block h-full overflow-hidden rounded-2xl py-0 shadow-sm ring-slate-900/5 transition-shadow duration-300";
  return (
    <li>
      {produit.existe ? (
        <Card className={`${carte} gap-0 hover:shadow-xl hover:shadow-slate-900/10`}>
          <Link to={`/article/${encodeURIComponent(produit.reference)}`} className="block h-full">
            {corps}
          </Link>
        </Card>
      ) : (
        <Card className={`${carte} gap-0`}>{corps}</Card>
      )}
    </li>
  );
}

/** Fiche d'un article : photo, nom commercial, atouts, caractéristiques et produits associés. */
export function ArticlePage() {
  const { reference } = useParams<{ reference: string }>();
  const [article, setArticle] = useState<ArticleDetailDTO | null>(null);
  const [erreur, setErreur] = useState<{ reference: string; message: string } | null>(null);
  const photoArticle = usePhotoArticle();
  const wishlist = useWishlist();

  useEffect(() => {
    if (!reference) return;
    let annule = false;
    fetchArticle(reference)
      .then((a) => {
        if (annule) return;
        setArticle(a);
        setErreur(null);
      })
      .catch((e: unknown) => {
        if (!annule) {
          setErreur({ reference, message: e instanceof Error ? e.message : "Erreur de chargement" });
        }
      });
    return () => {
      annule = true;
    };
  }, [reference]);

  const message = erreur && erreur.reference === reference ? erreur.message : null;
  const courant = article && article.reference === reference ? article : null;
  const chargement = !message && !courant;

  useSeo({
    title: courant ? `${courant.description ?? courant.reference} — ${courant.reference}` : "Article",
    description: courant?.valeurCial ?? courant?.description ?? "Article du catalogue Sorel Plastiques.",
  });

  const saved = courant ? isInWishlist(wishlist, courant.id) : false;
  const ajouter = () => {
    if (!courant) return;
    toggleWishlist({
      id: courant.id,
      reference: courant.reference,
      gamme: courant.gamme ?? courant.categoryNom,
      couleur: courant.couleur,
      photo: courant.photo,
    });
  };

  const caracteristiques: [string, React.ReactNode][] = courant
    ? ([
        ["Référence", courant.reference],
        [
          "Couleur",
          courant.couleur ? (
            <span className="inline-flex items-center gap-2">
              <ColorSwatch name={courant.couleur} className="size-4" />
              {courant.couleur}
            </span>
          ) : null,
        ],
        ["Contenance", courant.contenance ? formatMl(courant.contenance) : null],
        ["Forme", courant.forme ? (FORMES[courant.forme] ?? courant.forme) : null],
        [
          "Dimensions",
          courant.dimensions && formatDimensions(courant.dimensions) !== "—"
            ? formatDimensions(courant.dimensions)
            : null,
        ],
        [
          "Conditionnement",
          formatConditionnement(courant.conditionnement) !== "—"
            ? `${formatConditionnement(courant.conditionnement)} pièces par carton`
            : null,
        ],
      ] as [string, React.ReactNode][]).filter(([, v]) => v)
    : [];
  const atouts = courant ? OPTIONS.filter((o) => courant[o.cle] === true) : [];

  return (
    <div className="relative px-6 py-10 md:px-16 md:py-14">
      <div className="mx-auto max-w-6xl">
        <nav
          aria-label="Fil d'Ariane"
          className="mb-6 flex w-fit max-w-full flex-wrap items-center gap-x-2 gap-y-1 rounded-full bg-white/85 px-4 py-2 text-sm text-slate-700 ring-1 ring-slate-200 backdrop-blur"
        >
          <Link to="/catalogue" className="hover:text-orange-700 hover:underline">
            Catalogue
          </Link>
          {courant ? (
            <>
              <span aria-hidden className="text-slate-400">
                /
              </span>
              <Link
                to={`/catalogue/${encodeURIComponent(courant.categorySlug)}`}
                className="hover:text-orange-700 hover:underline"
              >
                {courant.categoryNom}
              </Link>
              <span aria-hidden className="text-slate-400">
                /
              </span>
              <span className="font-semibold text-slate-950" aria-current="page">
                {courant.reference}
              </span>
            </>
          ) : null}
        </nav>

        {message ? <ErrorMessage>{message}</ErrorMessage> : null}
        {chargement ? (
          <div className="h-96 animate-pulse rounded-3xl bg-white/70" role="status">
            <span className="sr-only">Chargement…</span>
          </div>
        ) : null}

        {courant ? (
          <>
            <div className="grid items-start gap-6 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-8">
              <div className="rounded-3xl bg-white p-2 shadow-sm ring-1 ring-slate-900/5 md:sticky md:top-28">
                <Photo
                  src={photoArticle(courant.reference, courant.photo)}
                  alt={courant.description ?? courant.reference}
                  className="aspect-[4/3] w-full rounded-2xl bg-slate-100 object-cover text-transparent"
                />
              </div>

              <Card className="gap-0 rounded-3xl bg-white/95 p-6 shadow-sm ring-slate-900/5 md:p-8">
                <Badge variant="secondary" className="h-6 self-start px-3 text-xs">
                  {courant.categoryNom}
                </Badge>
                <h1 className="mt-3 font-hand text-[clamp(2.25rem,4.5vw,3.25rem)] leading-[1.05] tracking-[0.02em] text-slate-950">
                  {courant.description ?? courant.reference}
                </h1>

                {courant.valeurCial ? (
                  <p className="mt-4 border-l-4 border-[#27E4F5] pl-4 text-lg leading-relaxed font-semibold text-slate-900">
                    {courant.valeurCial}
                  </p>
                ) : null}

                {courant.valeursAjoutees.length > 0 ? (
                  <ul className="mt-4 space-y-2">
                    {courant.valeursAjoutees.map((v) => (
                      <li key={v} className="flex items-start gap-3 text-[15px] leading-snug text-slate-800">
                        <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[#27E4F5]/25 text-[#0b7a86]">
                          <Check className="size-3" aria-hidden />
                        </span>
                        {v}
                      </li>
                    ))}
                  </ul>
                ) : null}

                {caracteristiques.length > 0 ? (
                  <>
                    <Separator className="my-6" />
                    <h2 className="mb-1 text-[11px] font-bold tracking-[0.16em] text-[#0b7a86] uppercase">
                      Fiche technique
                    </h2>
                    <dl>
                      {caracteristiques.map(([nom, valeur]) => (
                        <div
                          key={nom}
                          className="flex items-baseline justify-between gap-6 border-b border-slate-100 py-2.5 last:border-0"
                        >
                          <dt className="text-sm text-slate-600">{nom}</dt>
                          <dd className="text-right text-sm font-semibold text-slate-950">{valeur}</dd>
                        </div>
                      ))}
                    </dl>
                  </>
                ) : null}

                {atouts.length > 0 ? (
                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {atouts.map((o) => (
                      <li key={o.cle}>
                        <Badge variant="outline" className="h-6 border-slate-300 px-3 text-xs text-slate-800">
                          {o.label}
                        </Badge>
                      </li>
                    ))}
                  </ul>
                ) : null}

                <div className="mt-7 flex flex-wrap gap-3">
                  <Button
                    onClick={ajouter}
                    aria-pressed={saved}
                    variant={saved ? "secondary" : "brand"}
                    className="h-auto flex-1 py-3 text-sm sm:flex-none sm:px-8"
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
                  <Button asChild variant="outline" className="h-auto py-3 text-sm">
                    <Link to={`/catalogue/${encodeURIComponent(courant.categorySlug)}`}>
                      <ArrowLeft aria-hidden />
                      Voir la gamme
                    </Link>
                  </Button>
                </div>
              </Card>
            </div>

            {courant.associes.length > 0 ? (
              <section
                className="mt-8 rounded-3xl bg-white/85 p-6 ring-1 ring-slate-900/5 backdrop-blur md:p-8"
                aria-labelledby="associes"
              >
                <h2 id="associes" className="mb-5 font-hand text-3xl tracking-[0.02em] text-slate-950">
                  Produits associés
                </h2>
                <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  {courant.associes.map((a) => (
                    <Associe
                      key={a.reference}
                      produit={a}
                      photo={photoArticle(a.reference, a.photo)}
                    />
                  ))}
                </ul>
              </section>
            ) : null}
          </>
        ) : null}
      </div>
    </div>
  );
}
