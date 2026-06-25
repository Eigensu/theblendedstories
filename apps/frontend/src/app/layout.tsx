import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'The Blended Stories',
  description:
    'The Blended Stories — Explore the stories that define your city. Covering lifestyle, fashion, beauty, culture, events, and community.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* DNS pre-connect — avoids late TLS handshake on first font request */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/*
          Bodoni Moda: full opsz axis (6–96) + italic variants so
          font-variation-settings: 'opsz' 18 resolves to the correct optical-size cut.
          Great Vibes: single weight script.
          Montserrat: 400 + 500 for body/nav.
        */}
        <link
          href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,500;1,6..96,400;1,6..96,500&family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,700;0,9..144,900;1,9..144,400&family=Great+Vibes&family=Montserrat:wght@400;500&family=Martel+Sans:wght@400&family=Poppins:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
