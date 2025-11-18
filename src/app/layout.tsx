import "./globals.css";
import { Toaster } from "react-hot-toast";
import type { Metadata } from "next";
import { Playfair_Display, Inter, Anton, Manrope, Great_Vibes } from "next/font/google";

const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const anton = Anton({ subsets: ["latin"], weight: ["400"], variable: "--font-anton" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });
const greatvibes = Great_Vibes({ subsets: ["latin"], weight: ["400"], variable: "--font-greatvibes" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"),
  title: {
    default: "Alma do Fado | Where Flavor Meets Passion",
    template: "%s | Alma do Fado",
  },
  description: "Traditional Portuguese restaurant — soulful food, curated wines, and live Fado music in the heart of Alfama.",
  keywords: ["Alma do Fado", "Lisbon restaurant", "Portuguese cuisine", "Fado music", "Alfama dining", "seafood", "wine"],
  authors: [{ name: "Alma do Fado" }],
  openGraph: {
    title: "Alma do Fado | Where Flavor Meets Passion",
    description: "Experience authentic Portuguese cuisine with soulful Fado performances in Alfama.",
    url: "/",
    siteName: "Alma do Fado",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Alma do Fado | Where Flavor Meets Passion",
    description: "Soulful Portuguese dining with live Fado music in Alfama.",
  },
  icons: {
    icon: "/Logo.svg",
    shortcut: "/Logo.svg",
    apple: "/Logo.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} ${anton.variable} ${manrope.variable} ${greatvibes.variable}`}
    >
      <body>
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
