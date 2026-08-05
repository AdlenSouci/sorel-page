import { useEffect } from "react";

const SITE = "Sorel Plastiques";

function setMeta(key: string, value: string, property = false) {
  const attr = property ? "property" : "name";
  let tag = document.head.querySelector<HTMLMetaElement>(
    `meta[${attr}="${key}"]`,
  );
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attr, key);
    document.head.appendChild(tag);
  }
  tag.content = value;
}

function setCanonical(path: string) {
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement("link");
    link.rel = "canonical";
    document.head.appendChild(link);
  }
  link.href = `${window.location.origin}${path}`;
}

/** Titre + description + Open Graph propres à chaque page d'une SPA. */
export function useSeo({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path?: string;
}) {
  useEffect(() => {
    const full = title === SITE ? title : `${title} | ${SITE}`;
    document.title = full;
    setMeta("description", description);
    setMeta("og:title", full, true);
    setMeta("og:description", description, true);
    setMeta("og:type", "website", true);
    setMeta("og:site_name", SITE, true);
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", full);
    setMeta("twitter:description", description);
    setCanonical(path ?? window.location.pathname);
  }, [title, description, path]);
}
