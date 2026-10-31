import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { CartProvider } from "@/context/CartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav"; // <-- Added Mobile Nav

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
      <body className="font-sans antialiased flex flex-col min-h-screen">
        <LanguageProvider>
          <FavoritesProvider>
            <CartProvider>
              <Header />
              <main className="flex-grow">
                {children}
              </main>
              <Footer />
              <MobileBottomNav /> {/* <-- Added here, right before closing body */}
            </CartProvider>
          </FavoritesProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}