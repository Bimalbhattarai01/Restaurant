import "./globals.css";
import { Toaster } from "react-hot-toast";
import { Playfair_Display, Inter, Anton, Manrope, Great_Vibes } from "next/font/google";

const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const anton = Anton({ subsets: ["latin"], weight: ["400"], variable: "--font-anton" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });
const greatvibes = Great_Vibes({ subsets: ["latin"], weight: ["400"], variable: "--font-greatvibes" });

export const metadata = {
  title: "Alma do Fado | Where Flavor Meets Passion",
  description: "Traditional Portuguese restaurant — soulful food and Fado music experience.",
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
