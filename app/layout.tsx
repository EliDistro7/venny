import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

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
    <html lang="en">
      <body className="antialiased">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}