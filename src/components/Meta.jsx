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
  const { setMetaTags } = useHelmet();

  const [pageMeta, setPageMeta] = useState({
    type: "website",
    title: "I-GUIDE Platform",
    description:
      "Harnessing the Geospatial Data Revolution to Empower Convergence Science",
    imageUrl: "/images/Logo-favicon.png",
  });

  useEffect(() => {
    setMetaTags([
      { property: "og:title", content: pageMeta.title },
      { property: "og:description", content: pageMeta.abstract },
      { property: "og:image", content: pageMeta.imageUrl },
      { property: "og:url", content: window.location.href },
      { property: "og:type", content: pageMeta.type },

      { name: "twitter:title", content: pageMeta.title },
      { name: "twitter:description", content: pageMeta.abstract },
      { name: "twitter:image", content: thumbnailImage.original },
      { name: "twitter:card", content: pageMeta.imageUrl },
    ]);
  }, [pageMeta]);

  return (
    <MetaContext.Provider value={{ pageMeta, setPageMeta }}>
      {children}
    </MetaContext.Provider>
  );
};

export const useMeta = () => useContext(MetaContext);
