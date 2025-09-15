import { Helmet } from "react-helmet-async";

export default function Meta({ title, description, imageUrl, url }) {
  return (
    <Helmet>
      <meta property="og:url" content="https://067a8ef264c5.ngrok-free.app" />
      <meta property="og:type" content="website" />
      <meta property="og:title" content="I-GUIDE preview test" />
      <meta property="og:description" content="map, connect, discover" />
      <meta
        property="og:image"
        content="https://platform.i-guide.io/images/iguide-word-color.png"
      />

      <meta name="twitter:card" content="summary_large_image" />
      <meta property="twitter:domain" content="067a8ef264c5.ngrok-free.app" />
      <meta
        property="twitter:url"
        content="https://067a8ef264c5.ngrok-free.app"
      />
      <meta name="twitter:title" content="I-GUIDE preview test" />
      <meta name="twitter:description" content="map, connect, discover" />
      <meta
        name="twitter:image"
        content="https://platform.i-guide.io/images/iguide-word-color.png"
      ></meta>
    </Helmet>
  );
}
