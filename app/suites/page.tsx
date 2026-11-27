import type { Metadata } from "next";
import CtaBand from "@/components/CtaBand";
import DarkHero from "@/components/DarkHero";
import SearchBar from "@/components/SearchBar";
import SuiteBrowser from "@/components/SuiteBrowser";
import { photos } from "@/lib/photos";
import { suites } from "@/lib/suites";
import { parseStay, stayQuery } from "@/lib/stay";

export const metadata: Metadata = {
  title: "Suites",
  description: `Browse all ${suites.length} boutique suites at The George in downtown Klamath Falls — one- and two-bedroom suites with kitchens, fast WiFi and self check-in.`,
};

const features = [
  "Comfortable beds",
  "Private bathrooms",
  "Kitchen or kitchenette",
  "Free high-speed WiFi",
  "Air conditioning",
  "Washer & dryer in select units",
  "Spacious living areas",
];

export default async function SuitesPage({ searchParams }: PageProps<"/suites">) {
  const stay = parseStay(await searchParams);
  const { guests, checkIn, checkOut } = stay;

  return (
    <>
      <DarkHero
        compact
        eyebrow="Our rooms"
        title="Find your *suite.*"
        intro="A collection of boutique suites designed for relaxation and convenience — modern comfort and stylish décor, made for unwinding after a day exploring Klamath Falls."
        image={photos.living312}
        imagePosition="50% 75%"
        bridge={<SearchBar variant="hero" initial={{ guests, checkIn, checkOut }} />}
      />

      <div className="mt-16 border-y border-line bg-bone">
        <ul className="no-scrollbar mx-auto flex max-w-[1440px] gap-x-10 gap-y-3 overflow-x-auto px-5 py-5 lg:flex-wrap lg:justify-center lg:overflow-visible text-xs font-semibold tracking-[0.18em] whitespace-nowrap text-ink-500 uppercase sm:px-8">
          {features.map((f) => (
            <li key={f} className="flex items-center gap-3">
              <span className="h-1.5 w-1.5 rotate-45 bg-brass-500" />
              {f}
            </li>
          ))}
        </ul>
      </div>

      <SuiteBrowser suites={suites} initialGuests={guests} hasDates={!!(checkIn && checkOut)} query={stayQuery(stay)} />

      <CtaBand heading="Weekend away, work trip or a *longer* stay." image={photos.bedroom316} />
    </>
  );
}
