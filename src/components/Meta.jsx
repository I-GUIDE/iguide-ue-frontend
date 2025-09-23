import { Helmet } from "react-helmet-async";
const VITE_PUBLIC_URL = import.meta.env.VITE_PUBLIC_URL;

import { createContext, useContext, useEffect, useState } from "react";

const MetaContext = createContext();

export const defaultMeta = {
  type: "website",
  title: "I-GUIDE Platform",
  description:
    "Harnessing the Geospatial Data Revolution to Empower Convergence Science",
  imageUrl: "/images/Logo-favicon.png",
};

export const MetaProvider = ({ children }) => {
  const [pageMeta, setPageMeta] = useState(defaultMeta);

  const resetMeta = () => setPageMeta(defaultMeta);

  // helper to ensure absolute image URL
  const getAbsolute = (path) => {
    if (!path) return path;
    if (/^https?:\/\//i.test(path)) return path;
    if (VITE_PUBLIC_URL)
      return `${VITE_PUBLIC_URL.replace(/\/$/, "")}${
        path.startsWith("/") ? "" : "/"
      }${path}`;
    return `${window.location.origin}${path.startsWith("/") ? "" : "/"}${path}`;
  };

  return (
    <MetaContext.Provider
      value={{ pageMeta, setPageMeta, resetMeta, getAbsolute }}
    >
      <Helmet>
        <meta name="description" content={pageMeta.description} />

        {/* Open Graph */}
        <meta property="og:title" content={pageMeta.title} />
        <meta property="og:description" content={pageMeta.description} />
        <meta property="og:type" content={pageMeta.type} />
        <meta property="og:image" content={getAbsolute(pageMeta.imageUrl)} />
        <meta
          property="og:url"
          content={pageMeta.url || window.location.href}
        />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageMeta.title} />
        <meta name="twitter:description" content={pageMeta.description} />
        <meta name="twitter:image" content={getAbsolute(pageMeta.imageUrl)} />

        {/* canonical */}
        <link rel="canonical" href={pageMeta.url || window.location.href} />
      </Helmet>

      {children}
    </MetaContext.Provider>
  );
};

export const useMeta = () => useContext(MetaContext);
