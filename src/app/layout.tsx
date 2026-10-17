import type { Metadata } from "next";
import { Inter, Playfair_Display, Vazirmatn } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const vazir = Vazirmatn({ subsets: ["arabic"], variable: "--font-vazir" });

export const metadata: Metadata = {
  title: "KIMOROJO | Premium Jewelry",
  description: "Elegant gold and silver accessories.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} ${vazir.variable} font-sans antialiased flex flex-col min-h-screen`}>
        <LanguageProvider>
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}