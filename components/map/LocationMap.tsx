"use client";

import dynamic from "next/dynamic";
import { MapPin } from "lucide-react";
import { site } from "@/lib/site";

// Leaflet touches `window`, so the map only renders in the browser.
const MapView = dynamic(() => import("@/components/map/MapView"), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-bone" />,
});

/**
 * Framed map used on suite pages and the Klamath Falls page: square edges,
 * hairline inner frame and a frosted caption, like the homepage photos.
 */
export default function LocationMap({
  lat = site.coords.lat,
  lng = site.coords.lng,
  zoom,
  className = "aspect-[16/10]",
}: {
  lat?: number;
  lng?: number;
  zoom?: number;
  className?: string;
}) {
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  return (
    <div className={`relative isolate overflow-hidden bg-bone ${className}`}>
      <MapView lat={lat} lng={lng} zoom={zoom} />
      <span className="pointer-events-none absolute inset-3 z-[400] border border-ink/15" />
      <div className="absolute inset-x-3 bottom-3 z-[400] flex items-center justify-between gap-4 border-t border-white/15 bg-ink/80 px-5 py-3.5 text-white backdrop-blur-md">
        <span className="flex min-w-0 items-center gap-3">
          <span className="h-2 w-2 shrink-0 rotate-45 bg-brass-300" />
          <span className="truncate font-display text-lg">
            The George<span className="hidden sm:inline"> · Downtown Klamath Falls</span>
          </span>
        </span>
        <a
          href={directions}
          target="_blank"
          rel="noopener noreferrer"
          className="flex shrink-0 items-center gap-2 text-[0.7rem] font-semibold tracking-[0.16em] text-brass-300 uppercase transition-colors hover:text-white"
        >
          <MapPin size={13} /> Directions
        </a>
      </div>
    </div>
  );
}
