import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Brasserie Terroir & Savoirs",
  description: "Fiers de notre terroir et de notre savoir-faire, nous avons à cœur de transmettre notre expertise aux nouvelles générations, aux curieux et aux amateurs de bière.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-orange-100`}>
        <Navbar></Navbar>
        <main>{children}</main>
      </body>
    </html>
  );
}
