// app/layout.tsx
import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import ConditionalShell from "./components/ConditionalShell";
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
    "Venny Construction & Real Estate Co. Ltd. — Maisha Ni Nyumba Bora. Find your perfect home in Tanzania.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable}`}>
      <body className="antialiased font-body">
        <ConditionalShell>{children}</ConditionalShell>
      </body>
    </html>
  );
}