import { Bebas_Neue } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import { Metadata, Viewport } from 'next';
import { getRandomOgImage } from '@/lib/get-random-og-image';

const bebasNeue = Bebas_Neue({ 
  weight: '400',
  subsets: ["latin"] 
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

const ogImage = getRandomOgImage();

export const metadata: Metadata = {
  title: 'Joe P',
  description: 'Enter the world of Joe P (with games)',
  icons: {
    icon: '/game/joe-1.png',
    shortcut: '/game/joe-1.png',
    apple: '/game/joe-1.png',
  },
  openGraph: {
    title: 'Joe P',
    description: 'Enter the world of Joe P (with games)',
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: 'Joe P',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Joe P',
    description: 'Enter the world of Joe P (with games)',
    images: [ogImage],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={bebasNeue.className}>
        <Navigation />
        {children}
      </body>
    </html>
  );
}
