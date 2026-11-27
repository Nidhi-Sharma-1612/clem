import data from "@/lib/data/suites.json";

/**
 * Phase 1: a static snapshot of the Hostaway listings for The George.
 * Phase 2: replace these functions with calls to the Hostaway API (the `id`
 * field is the Hostaway listing ID) and keep the same return shape.
 */
export interface Suite {
  id: number;
  slug: string;
  unit: string;
  floor: number;
  title: string;
  listingName: string;
  tagline: string;
  type: string;
  guests: number;
  bedrooms: number;
  bathrooms: number;
  beds: number;
  /** Starting nightly rate in USD, before tax. Live rates arrive with the PMS integration. */
  priceFrom: number;
  /** Out of 5. */
  rating: number;
  reviews: number;
  checkIn: number;
  checkOut: number;
  lat: number;
  lng: number;
  description: string;
  amenities: Record<string, string[]>;
  images: string[];
}

export const suites = data as unknown as Suite[];

export function getSuite(slug: string): Suite | undefined {
  return suites.find((s) => s.slug === slug);
}

/** Hand-picked for the homepage — strongest photos and most-reviewed. */
export const featuredSlugs = ["suite-316", "suite-202", "suite-203", "suite-304", "suite-312", "suite-216"];
export const featuredSuites = featuredSlugs.map((slug) => getSuite(slug)!).filter(Boolean);

export const totalReviews = suites.reduce((sum, s) => sum + s.reviews, 0);
export const averageRating =
  Math.round((suites.reduce((sum, s) => sum + s.rating * s.reviews, 0) / totalReviews) * 10) / 10;
export const lowestPrice = Math.min(...suites.map((s) => s.priceFrom));

export function amenityCount(suite: Suite) {
  return Object.values(suite.amenities).reduce((n, list) => n + list.length, 0);
}

export function formatHour(h: number) {
  return `${h % 12 || 12}:00 ${h >= 12 ? "PM" : "AM"}`;
}

/**
 * Three alternatives to show on a suite page, each with a reason:
 * the closest price with the same bedroom count, the best-rated suite, and a
 * neighbour on the same floor. Gaps are filled by closest price.
 */
export function relatedSuites(current: Suite, exclude: Suite[] = []): { suite: Suite; reason: string }[] {
  // `exclude` keeps out suites already shown nearby.
  const skip = new Set([current.slug, ...exclude.map((s) => s.slug)]);
  const pool = suites.filter((s) => !skip.has(s.slug));
  const picked: { suite: Suite; reason: string }[] = [];
  const taken = (s: Suite) => picked.some((p) => p.suite.slug === s.slug);
  const byPrice = (a: Suite, b: Suite) => Math.abs(a.priceFrom - current.priceFrom) - Math.abs(b.priceFrom - current.priceFrom);

  const similar = pool.filter((s) => s.bedrooms === current.bedrooms).sort(byPrice)[0];
  if (similar) picked.push({ suite: similar, reason: "Similar price" });

  const favourite = pool
    .filter((s) => s.reviews >= 3 && !taken(s))
    .sort((a, b) => b.rating - a.rating || b.reviews - a.reviews)[0];
  if (favourite) picked.push({ suite: favourite, reason: "Guest favourite" });

  const neighbour = pool
    .filter((s) => s.floor === current.floor && !taken(s))
    .sort((a, b) => Math.abs(Number(a.unit) - Number(current.unit)) - Math.abs(Number(b.unit) - Number(current.unit)))[0];
  if (neighbour) picked.push({ suite: neighbour, reason: `Also on floor ${current.floor}` });

  for (const s of [...pool].sort(byPrice)) {
    if (picked.length >= 3) break;
    if (!taken(s)) picked.push({ suite: s, reason: "Similar price" });
  }
  return picked.slice(0, 3);
}
