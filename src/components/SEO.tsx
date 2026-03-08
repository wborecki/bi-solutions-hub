import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  type?: string;
  jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>;
  noIndex?: boolean;
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    section?: string;
    tags?: string[];
  };
  keywords?: string;
}

const BASE_URL = "https://solutionsinbi.com";

function toTitleCaseSegment(segment: string) {
  return decodeURIComponent(segment)
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function SEO({ 
  title, 
  description, 
  canonical, 
  ogImage, 
  type = "website", 
  jsonLd, 
  noIndex, 
  article,
  keywords 
}: SEOProps) {
  const fullTitle = `${title} | Solutions in BI`;
  const url = canonical ? `${BASE_URL}${canonical}` : BASE_URL;
  const image = ogImage || `${BASE_URL}/og-image.png`;
  const path = canonical || "/";

  const breadcrumbJsonLd =
    path !== "/"
      ? {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: BASE_URL,
            },
            ...path
              .split("/")
              .filter(Boolean)
              .map((segment, index, segments) => {
                const isLast = index === segments.length - 1;
                const segmentPath = `/${segments.slice(0, index + 1).join("/")}`;
                return {
                  "@type": "ListItem",
                  position: index + 2,
                  name: isLast ? title : toTitleCaseSegment(segment),
                  item: `${BASE_URL}${segmentPath}`,
                };
              }),
          ],
        }
      : null;

  const jsonLdScripts = [
    ...(Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : []),
    ...(breadcrumbJsonLd ? [breadcrumbJsonLd] : []),
  ];

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      {keywords && <meta name="keywords" content={keywords} />}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="pt_BR" />
      <meta property="og:site_name" content="Solutions in BI" />

      {/* Article metadata */}
      {article?.publishedTime && <meta property="article:published_time" content={article.publishedTime} />}
      {article?.modifiedTime && <meta property="article:modified_time" content={article.modifiedTime} />}
      {article?.author && <meta property="article:author" content={article.author} />}
      {article?.section && <meta property="article:section" content={article.section} />}
      {article?.tags?.map((tag) => (
        <meta key={tag} property="article:tag" content={tag} />
      ))}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Additional SEO tags */}
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />

      {/* JSON-LD */}
      {jsonLdScripts.map((schema, index) => (
        <script key={`jsonld-${index}`} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}
