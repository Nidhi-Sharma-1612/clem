import { photos } from "@/lib/photos";
import { suites } from "@/lib/suites";

export type GalleryCategory = "building" | "area" | "suite";

export interface GalleryPhoto {
  src: string;
  alt: string;
  category: GalleryCategory;
  /** Suite number, for suite photos. */
  unit?: string;
  caption: string;
  slug?: string;
}

/** How many photos to take from each suite. Listing photos lead with interiors. */
const PER_SUITE = 5;

/**
 * Curated gallery. The listings repeat the same façade shot many times, so the
 * building and local-area photos are picked by hand instead of taken wholesale.
 */
export function galleryPhotos(): GalleryPhoto[] {
  const building: GalleryPhoto[] = [photos.street, photos.entrance].map((p) => ({
    ...p,
    category: "building",
    caption: "The George · Main Street",
  }));

  const area: GalleryPhoto[] = [
    { ...photos.parkView202, caption: "Klamath Commons Park" },
    { ...photos.sunset304, caption: "Sunset over the mountains" },
    { ...photos.clock311, caption: "Downtown Klamath Falls" },
    { ...photos.dusk202, caption: "Downtown at sunset" },
    { ...photos.mural311, caption: "Klamath Falls mural" },
    { ...photos.street216, caption: "Downtown Klamath Falls" },
    { ...photos.duskWide202, caption: "Klamath Falls at dusk" },
    { ...photos.craterLake, caption: "Crater Lake National Park" },
  ].map((p) => ({ ...p, category: "area" as const }));

  const suitePhotos: GalleryPhoto[] = suites.flatMap((s) =>
    s.images.slice(0, PER_SUITE).map((src, i) => ({
      src,
      alt: `${s.title}, Suite ${s.unit} — photo ${i + 1}`,
      category: "suite" as const,
      unit: s.unit,
      slug: s.slug,
      caption: `Suite ${s.unit} · ${s.title}`,
    })),
  );

  // Interleave so "All" opens with a mix rather than one suite after another.
  const mixed: GalleryPhoto[] = [];
  const queues = [building, suitePhotos, area];
  let k = 0;
  while (queues.some((q) => q.length)) {
    const q = queues[k % queues.length];
    const take = q === suitePhotos ? 4 : 1;
    mixed.push(...q.splice(0, take));
    k++;
  }
  return mixed;
}
