import './globals.css';

const SITE = 'https://getdaita.com';
const TITLE = 'DAITA — The DoorDash for 3D data';
const DESC =
  'DAITA is a decentralized network for real-world 3D data. Couriers, drivers and cyclists capture the world as they move; we reconstruct it into meshes, Gaussian splats, point clouds and VPS anchors for AI, robotics, simulation and digital twins.';

export const metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: TITLE,
    template: '%s · DAITA',
  },
  description: DESC,
  applicationName: 'DAITA',
  keywords: [
    'DAITA',
    'getdaita.com',
    '3D data',
    '3D Gaussian Splatting',
    'Physical AI',
    'Large Geospatial Models',
    'visual positioning system',
    'VPS',
    'photogrammetry',
    'point cloud',
    'digital twin',
    'sim-to-real',
    'robotics data',
    'autonomous vehicles',
    'HD mapping',
    'DePIN',
    'Hivemapper alternative',
    'spatial AI',
    'decentralized mapping',
  ],
  authors: [{ name: 'DAITA' }],
  creator: 'DAITA',
  publisher: 'DAITA',
  alternates: { canonical: SITE },
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
    apple: '/icon.svg',
  },
  openGraph: {
    type: 'website',
    siteName: 'DAITA',
    title: TITLE,
    description: DESC,
    url: SITE,
    locale: 'en_US',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 627,
        alt: 'DAITA — getdaita.com',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESC,
    images: ['/og-image.png'],
    creator: '@daita',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  category: 'technology',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0C1F22',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE}/#org`,
      name: 'DAITA',
      url: SITE,
      logo: `${SITE}/og-image.png`,
      sameAs: [],
      description:
        'DAITA is a DePIN for real-world 3D data: a decentralized capture network producing Gaussian splats, meshes, point clouds and VPS anchors from contributor video.',
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE}/#website`,
      url: SITE,
      name: 'DAITA',
      description: DESC,
      publisher: { '@id': `${SITE}/#org` },
      inLanguage: 'en',
    },
    {
      '@type': 'WebPage',
      '@id': `${SITE}/#webpage`,
      url: SITE,
      name: TITLE,
      isPartOf: { '@id': `${SITE}/#website` },
      about: { '@id': `${SITE}/#org` },
      description: DESC,
      primaryImageOfPage: `${SITE}/og-image.png`,
    },
    {
      '@type': 'SoftwareApplication',
      name: 'DAITA',
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'Web',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
      url: SITE,
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Instrument+Serif:ital@0;1&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
