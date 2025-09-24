import { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";

import { MetaContext } from "./MetaContext";
import { stringTruncator } from "../helpers/helper";

const FRONTEND_URL = import.meta.env.VITE_REACT_FRONTEND_URL;

export const defaultMeta = {
  type: "website",
  title: "I-GUIDE Platform",
  description:
    "Harnessing the Geospatial Data Revolution to Empower Convergence Science",
  imageUrl: "/images/Logo-favicon.png",
  url: "",
};

export function MetaProvider({ children }) {
  const [pageMeta, setPageMeta] = useState(defaultMeta);

  function resetPageMeta() {
    setPageMeta(defaultMeta);
  }

  // helper to ensure absolute image URL
  function getAbsolute(path) {
    if (!path) {
      return;
    }

    if (/^https?:\/\//i.test(path)) {
      return path;
    }

    if (FRONTEND_URL) {
      return `${FRONTEND_URL.replace(/\/$/, "")}${
        path.startsWith("/") ? "" : "/"
      }${path}`;
    }

    return `${window.location.origin}${path.startsWith("/") ? "" : "/"}${path}`;
  }

  // Memoize computed meta values for performance and SSR safety
  const memorizedMeta = useMemo(
    function () {
      const url =
        pageMeta.url ||
        (typeof window !== "undefined" ? window.location.href : "");
      const image = getAbsolute(pageMeta.imageUrl);

      return {
        ...defaultMeta,
        ...pageMeta,
        url,
        image,
      };
    },
    [pageMeta]
  );

  return (
    <MetaContext.Provider value={{ resetPageMeta, setPageMeta }}>
      <Helmet>
        <title>{memorizedMeta.title}</title>
        <meta name="description" content={memorizedMeta.description} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={stringTruncator(memorizedMeta.title, 0, 57)}
        />
        <meta
          name="twitter:description"
          content={stringTruncator(memorizedMeta.description, 0, 137)}
        />
        <meta name="twitter:image" content={memorizedMeta.image} />

        {/* Open Graph */}
        <meta
          property="og:title"
          content={stringTruncator(memorizedMeta.title, 0, 57)}
        />
        <meta
          property="og:description"
          content={stringTruncator(memorizedMeta.description, 0, 137)}
        />
        <meta property="og:type" content={memorizedMeta.type} />
        <meta property="og:image" content={memorizedMeta.image} />
        <meta property="og:url" content={memorizedMeta.url} />

        {/* canonical */}
        <link rel="canonical" href={memorizedMeta.url} />
      </Helmet>

      {children}
    </MetaContext.Provider>
  );
}
