import { Bebas_Neue } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";

const bebasNeue = Bebas_Neue({ 
  weight: '400',
  subsets: ["latin"] 
});

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
