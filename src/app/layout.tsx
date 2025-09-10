import { Bebas_Neue } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import { Metadata, Viewport } from 'next';

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

export const metadata: Metadata = {
  title: 'Post App',
  description: 'Post application with games',
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
