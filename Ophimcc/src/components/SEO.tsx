import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

const SEO = ({
  title,
  description = "Xem phim HD Online, phim hay mới cập nhật với chất lượng cao",
  keywords = "xem phim, phim hay, phim hd, phim online",
  image = "https://assets.nflxext.com/us/ffe/siteui/common/icons/nficon2023.ico",
  url = window.location.href,
  type = "website"
}: SEOProps) => {
  const siteName = "LingPhim - Xem phim HD Online";

  return (
    <Helmet>
      {/* Tiêu đề cơ bản */}
      <title>{title} | {siteName}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Canonical URL */}
      <link rel="canonical" href={url} />
    </Helmet>
  );
};

export default SEO;
