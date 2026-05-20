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
      <body>{children}</body>
    </html>
  );
}
