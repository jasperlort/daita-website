import './globals.css';

export const metadata = {
  title: 'DAITA — The Decentralized Visual Data Network',
  description: 'Building a true digital twin of the world through crowdsourced 360-degree spatial capture and Gaussian Splatting.',
  openGraph: {
    title: 'DAITA — The Decentralized Visual Data Network',
    description: 'Uber for visual data collection. Earn money by capturing the world.',
    url: 'https://getdaita.com',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
