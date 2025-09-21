import { Helmet } from "react-helmet-async";

const VITE_PUBLIC_URL = import.meta.env.VITE_PUBLIC_URL;

export default function Meta({
  type = "website",
  title = "I-GUIDE Platform",
  description = "Harnessing the Geospatial Data Revolution to Empower Convergence Science",
  imageUrl = "/images/Logo-favicon.png",
}) {
  return (
    <Helmet>
      <meta property="og:url" content={window.location.href} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />

      <meta name="twitter:card" content={imageUrl} />
      <meta property="twitter:domain" content={VITE_PUBLIC_URL} />
      <meta property="twitter:url" content={window.location.href} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl}></meta>
    </Helmet>
  );
}
