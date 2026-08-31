import type { Metadata } from "next";
import { Syne, DM_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Navbar } from "@/lib/components/Navbar";
import { Footer } from "@/lib/components/Footer";
import "./globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  openGraph: {
    images: ["https://shiemo.dev/socials.jpg"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://shiemo.dev/og-image.jpg"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${syne.variable} ${dmMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Navbar />
        <main>{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
