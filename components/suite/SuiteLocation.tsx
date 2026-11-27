import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import LocationMap from "@/components/map/LocationMap";

/** Suite-page location: colour map plus directions. */
export default function SuiteLocation({ lat, lng }: { lat: number; lng: number }) {
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

  return (
    <div className="mt-10">
      <LocationMap lat={lat} lng={lng} className="aspect-4/3 sm:aspect-16/10" />

      <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
        <a
          href={directions}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative inline-flex items-center gap-3 overflow-hidden bg-ink px-7 py-3.5 text-xs font-semibold tracking-[0.2em] text-white uppercase"
        >
          <span className="absolute inset-0 translate-y-full bg-brass-700 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0" />
          <MapPin size={14} className="relative" />
          <span className="relative">Get directions</span>
        </a>
        <Link href="/explore" className="group inline-flex items-center gap-3 text-xs font-semibold tracking-[0.2em] uppercase">
          <span className="link-line pb-1">Explore Klamath Falls</span>
          <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}
