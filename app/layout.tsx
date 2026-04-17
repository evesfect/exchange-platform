// app/layout.tsx
import type { Metadata } from "next";
import { DM_Sans, Space_Mono } from "next/font/google";
import { Navbar } from "@/components/Navbar";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "MaviPazar — Istanbul Marketplace",
  description: "Buy and sell pre-owned items across Istanbul",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${spaceMono.variable}`}>
      <body className="min-h-screen flex flex-col font-sans bg-cream text-clay-black antialiased">
        <Navbar />
        <div className="flex-grow flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}