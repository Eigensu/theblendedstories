import type { Metadata } from 'next';
import { Bodoni_Moda, Montserrat, Great_Vibes, Martel_Sans } from 'next/font/google';
import './globals.css';

const bodoni = Bodoni_Moda({
  subsets: ['latin'],
  weight: ['400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-bodoni',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-montserrat',
});

const greatVibes = Great_Vibes({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-great-vibes',
});

const martelSans = Martel_Sans({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-martel-sans',
});

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
    <html lang="en" className={`${bodoni.variable} ${montserrat.variable} ${greatVibes.variable} ${martelSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
