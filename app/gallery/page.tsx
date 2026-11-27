import type { Metadata } from "next";
import CtaBand from "@/components/CtaBand";
import DarkHero from "@/components/DarkHero";
import GalleryGrid from "@/components/GalleryGrid";
import { galleryPhotos } from "@/lib/gallery";
import { photos } from "@/lib/photos";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Photos of the boutique suites, the historic building and downtown Klamath Falls, Oregon.",
};

export default function GalleryPage() {
  return (
    <>
      <DarkHero
        compact
        eyebrow="Gallery"
        title="Inside *The* *George.*"
        intro="Boutique suites, a restored 1930s building, and the downtown streets and mountain views just outside."
        image={photos.living203}
        imagePosition="50% 70%"
      />
      <GalleryGrid photos={galleryPhotos()} />
      <CtaBand heading="Seen one you love? Make it *yours.*" image={photos.living316} />
    </>
  );
}
