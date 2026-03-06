import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  type?: string;
  jsonLd?: Record<string, unknown>;
}

const BASE_URL = "https://solutionsinbi.com";

export function SEO({ title, description, canonical, ogImage, type = "website", jsonLd }: SEOProps) {
  const fullTitle = `${title} | Solutions in BI`;
  const url = canonical ? `${BASE_URL}${canonical}` : BASE_URL;
  const image = ogImage || `${BASE_URL}/og-image.png`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={image} />

      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  );
}
