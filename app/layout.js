import './globals.css';

export const metadata = {
  metadataBase: new URL('https://quero.indevs.in'),
  title: 'Quero — Curiosity, Answered.',
  description: 'A quiet place to think, explore ideas, create, learn, and find your way through difficult questions.',
  applicationName: 'Quero',
  authors: [{ name: 'The Ace Base' }],
  creator: 'The Ace Base',
  publisher: 'The Ace Base',
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    siteName: 'Quero',
    title: 'Quero — Curiosity, Answered.',
    description: 'A quiet place to think, explore ideas, create, learn, and find your way through difficult questions.',
    url: 'https://quero.indevs.in/',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Quero — Curiosity, Answered.',
    description: 'A quiet place to think, explore ideas, create, learn, and find your way through difficult questions.',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
