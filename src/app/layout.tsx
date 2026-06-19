import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ADSENSE_CLIENT } from "@/lib/adsense";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pinoy Daily — Ang Hula Mo Ngayon",
  description:
    "Libreng pang-araw-araw na hula para sa mga Pilipino. May lucky number at lucky color pa! Araw-araw, bagong hula.",
  openGraph: {
    title: "Pinoy Daily — Ang Hula Mo Ngayon",
    description:
      "Libreng pang-araw-araw na hula para sa mga Pilipino. May lucky number at lucky color pa! Araw-araw, bagong hula.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fil"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          async
          src={`https://pagead2.googlesyndication.com/pagead/g/pageads.js?client=${ADSENSE_CLIENT}`}
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
