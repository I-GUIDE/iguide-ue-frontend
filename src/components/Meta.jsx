import { useHelmet } from "react-helmet-async";
const VITE_PUBLIC_URL = import.meta.env.VITE_PUBLIC_URL;

import { createContext, useContext, useEffect, useState } from "react";

const MetaContext = createContext();

const defaultMeta = {
  type: "website",
  title: "I-GUIDE Platform",
  description:
    "Harnessing the Geospatial Data Revolution to Empower Convergence Science",
  imageUrl: "/images/Logo-favicon.png",
};

export const MetaProvider = ({ children }) => {
  const [pageMeta, setPageMeta] = useState({
    type: "website",
    title: "I-GUIDE Platform",
    description:
      "Harnessing the Geospatial Data Revolution to Empower Convergence Science",
    imageUrl: "/images/Logo-favicon.png",
  });

  function updateMetaTag(attr, attrValue, content) {
    let element = document.head.querySelector(`meta[${attr}="${attrValue}"]`);
    if (!element) {
      element = document.createElement("meta");
      element.setAttribute(attr, attrValue);
      document.head.appendChild(element);
    }
    element.setAttribute("content", content);
  }

  useEffect(() => {
    updateMetaTag("property", "og:title", pageMeta.title);
    updateMetaTag("property", "og:description", pageMeta.description);
    updateMetaTag("property", "og:image", pageMeta.imageUrl);
    updateMetaTag("property", "og:url", window.location.href);
    updateMetaTag("property", "og:type", pageMeta.type);

    updateMetaTag("name", "twitter:title", pageMeta.title);
    updateMetaTag("name", "twitter:description", pageMeta.description);
    updateMetaTag("name", "twitter:image", pageMeta.imageUrl);
    updateMetaTag("name", "twitter:card", "summary_large_image");
  }, [pageMeta]);

  return (
    <MetaContext.Provider value={{ pageMeta, setPageMeta }}>
      {children}
    </MetaContext.Provider>
  );
};

export const useMeta = () => useContext(MetaContext);
