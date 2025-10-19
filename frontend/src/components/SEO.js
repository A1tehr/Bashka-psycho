import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ 
  title, 
  description, 
  keywords,
  ogImage,
  ogType = 'website',
  canonical,
  schemaMarkup
}) => {
  const siteUrl = process.env.REACT_APP_BACKEND_URL || 'https://psycenter.ru';
  const defaultTitle = 'Психологический центр развития - Программы для детей и взрослых';
  const defaultDescription = 'Профессиональный психологический центр развития в Москве. Программы всестороннего развития для детей и взрослых. Консультации опытных психологов.';
  const defaultImage = `${siteUrl}/images/og-default.jpg`;

  const pageTitle = title ? `${title} | Психологический центр развития` : defaultTitle;
  const pageDescription = description || defaultDescription;
  const pageImage = ogImage || defaultImage;
  const pageUrl = canonical || siteUrl;

  return (
    <Helmet>
      {/* Основные мета-теги */}
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={pageUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={pageImage} />
      <meta property="og:locale" content="ru_RU" />
      <meta property="og:site_name" content="Психологический центр развития" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={pageUrl} />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={pageImage} />

      {/* Дополнительные мета-теги */}
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      <meta name="author" content="Психологический центр развития" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      {/* Structured Data (Schema.org) */}
      {schemaMarkup && (
        <script type="application/ld+json">
          {JSON.stringify(schemaMarkup)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
