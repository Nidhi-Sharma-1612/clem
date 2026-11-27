import type { Metadata } from "next";
import { Bodoni_Moda, Manrope } from "next/font/google";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { MotionProvider } from "@/components/motion";
import { photos } from "@/lib/photos";
import { site } from "@/lib/site";
import "./globals.css";

const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin"] });
const bodoni = Bodoni_Moda({
  variable: "--font-bodoni",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Historic George Hotel | Boutique Suites in Downtown Klamath Falls, Oregon",
    template: "%s | Historic George Hotel",
  },
  description: site.description,
  openGraph: {
    title: "Historic George Hotel — Klamath Falls, Oregon",
    description: site.description,
    url: site.url,
    siteName: site.name,
    type: "website",
    images: [{ url: photos.living202.src }],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${manrope.variable} ${bodoni.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-paper font-sans text-ink">
        <MotionProvider>
          <Navbar />
          <main id="top" className="flex-1">
            {children}
          </main>
          <Footer />
        </MotionProvider>
      </body>
    </html>
  );
}
