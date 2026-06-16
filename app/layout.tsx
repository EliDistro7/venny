import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Venny Construction & Real Estate Co. Ltd. | Maisha Ni Nyumba Bora",
  description:
    "Venny Construction & Real Estate Co. Ltd. — Maisha Ni Nyumba Bora. Find your perfect home in Tanzania. Browse apartments, villas, land, and commercial properties for sale and rent in Dar es Salaam, Zanzibar, Arusha, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable}`}>
      <body className="antialiased font-body">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}