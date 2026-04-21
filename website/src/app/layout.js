import './globals.css';

export const metadata = {
  title: 'DAITA — The DoorDash for 3D data',
  description:
    'A decentralized network turning everyday real-world movement into spatial data for AI, simulation, robotics and digital twins.',
  metadataBase: new URL('https://getdaita.com'),
  icons: { icon: '/icon.svg' },
  openGraph: {
    title: 'DAITA — The DoorDash for 3D data',
    description:
      'A decentralized capture network. Contributors record the world as they move; we reconstruct it into meshes, splats and point clouds.',
    url: 'https://getdaita.com',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DAITA — The DoorDash for 3D data',
    description:
      'Motion becomes 3D data. Crowd-scale capture, weekly-fresh geometry, global by design.',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0C1F22',
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
      </head>
      <body>{children}</body>
    </html>
  );
}
