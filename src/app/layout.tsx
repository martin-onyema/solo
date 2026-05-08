import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "./providers";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Solo Luxury Properties | Premium Real Estate in Enugu State",
  description:
    "Discover premium properties across Enugu State. Solo Luxury Properties offers luxury homes, land, and commercial properties tailored for investors and homeowners.",
  keywords: [
    "luxury real estate",
    "Enugu State",
    "Nsukka",
    "premium properties",
    "land investment",
    "commercial property",
    "Nigeria real estate",
  ],
  authors: [{ name: "Solo Luxury Properties" }],
  icons: {
    icon: "/images/logo.png",
  },
  openGraph: {
    title: "Solo Luxury Properties | Premium Real Estate",
    description:
      "Own the future of luxury living. Premium properties across Enugu State, tailored for investors and homeowners.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${playfair.variable} ${inter.variable} antialiased bg-background text-foreground overflow-x-hidden`}
      >
        <Providers>
          {children}
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
