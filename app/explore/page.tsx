import type { Metadata } from "next";
import { Beer, Coffee, MapPin, Martini, Pizza, Sandwich, ShoppingBasket, Soup, type LucideIcon } from "lucide-react";
import CtaBand from "@/components/CtaBand";
import DarkHero from "@/components/DarkHero";
import LocationMap from "@/components/map/LocationMap";
import { DiamondDivider } from "@/components/Ornament";
import { ParallaxImage, Reveal, SplitText } from "@/components/motion";
import { landmarks, nearby } from "@/lib/data/content";
import { photos } from "@/lib/photos";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Explore Klamath Falls",
  description:
    "Restaurants, coffee, Klamath Commons Park, the Amtrak station and Crater Lake — everything near The George in downtown Klamath Falls.",
};

/** Brass-ruled section label used across the site. */
function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="eyebrow flex items-center gap-4 text-brass-700">
      <span className="h-px w-10 bg-brass-500" />
      {children}
    </p>
  );
}

/** Landmarks with a genuine local photo get a feature card; the rest are listed below. */
const featurePhotos: Record<string, { src: string; alt: string; pos: string }> = {
  "Klamath Commons Park": { ...photos.parkView202, pos: "[&_img]:object-[50%_50%]" },
  // Anchored left so the street clock stays in the portrait crop.
  "Main Street & Downtown": { ...photos.clock311, pos: "[&_img]:object-[18%_50%]" },
  "Crater Lake National Park": { ...photos.craterLake, pos: "[&_img]:object-[50%_50%]" },
};
const featured = landmarks.filter((l) => featurePhotos[l.name]);
const others = landmarks.filter((l) => !featurePhotos[l.name]);

const scenes = [
  { ...photos.sunset304, caption: "Sunset over the mountains", offset: false },
  { ...photos.mural311, caption: "The Klamath Falls mural", offset: true },
  { ...photos.street216, caption: "Downtown streets", offset: false },
  { ...photos.duskWide202, caption: "Klamath Falls at dusk", offset: true },
];

const favouriteIcons: Record<string, LucideIcon> = {
  "Rodeo’s Pizza": Pizza,
  "Green Blade Bakery": Coffee,
  "A Leap of Taste": Sandwich,
  "Thai Orchid Café": Soup,
  "Basin Martini Bar": Martini,
  "The Pikey": Beer,
  "Holiday Market": ShoppingBasket,
};

export default function ExplorePage() {
  return (
    <>
      <DarkHero
        compact
        eyebrow="Klamath Falls, Oregon"
        title="Your base for Southern *Oregon.*"
        intro="Walk to dinner, coffee and the park; catch the train from down the street; spend a day on the rim of Crater Lake."
        image={photos.dusk202}
        imagePosition="50% 60%"
      />

      {/* Around The George */}
      <section className="mx-auto max-w-[1440px] px-5 py-24 sm:px-8 lg:py-32">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <Reveal>
              <Eyebrow>Around The George</Eyebrow>
            </Reveal>
            <SplitText
              text="Stay central. Walk everywhere. Day-trip to *Crater* *Lake.*"
              accentClass="text-brass-500"
              className="mt-6 font-display text-4xl leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl"
            />
          </div>
        </div>

        <div className="mt-16 grid gap-x-8 gap-y-14 md:grid-cols-3">
          {featured.map((l, i) => {
            const n = i + 1;
            return (
              <Reveal key={l.name} delay={i * 0.12} className="group">
                <div className="relative aspect-[4/5] overflow-hidden bg-bone">
                  <ParallaxImage
                    src={featurePhotos[l.name].src}
                    alt={featurePhotos[l.name].alt}
                    className={`absolute! inset-0 [&_img]:grayscale-[25%] [&_img]:transition-[filter] [&_img]:duration-700 group-hover:[&_img]:grayscale-0 ${featurePhotos[l.name].pos}`}
                    sizes="(min-width: 768px) 33vw, 100vw"
                    strength={8}
                  />
                  <span className="pointer-events-none absolute inset-3 border border-white/30 transition-colors duration-500 group-hover:border-brass-300/80" />
                  <span className="absolute top-6 left-6 flex items-center gap-2 border border-white/15 bg-ink/55 px-3 py-1.5 text-[0.65rem] font-semibold tracking-[0.18em] text-white uppercase backdrop-blur-md">
                    <span className="h-1.5 w-1.5 rotate-45 bg-brass-300" />
                    {l.distance}
                  </span>
                </div>
                <p className="mt-6 text-xs font-semibold text-brass-700 tabular-nums">0{n}</p>
                <h3 className="mt-2 font-display text-3xl leading-tight transition-colors duration-500 group-hover:text-brass-700">
                  {l.name}
                </h3>
                <p className="mt-3 leading-relaxed text-ink-500">{l.body}</p>
              </Reveal>
            );
          })}
        </div>

        <ul className="mt-20 border-t border-line">
          {others.map((l, i) => (
            <Reveal key={l.name} delay={i * 0.06} y={16}>
              <li className="group relative grid gap-3 border-b border-line py-8 md:grid-cols-12 md:items-baseline">
                <span className="absolute -bottom-px left-0 h-px w-0 bg-brass-500 transition-[width] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:w-full" />
                <span className="text-xs font-semibold text-brass-700 tabular-nums md:col-span-1">0{featured.length + i + 1}</span>
                <h3 className="font-display text-2xl transition-transform duration-500 group-hover:translate-x-1 sm:text-3xl md:col-span-5">
                  {l.name}
                </h3>
                <span className="eyebrow flex items-center gap-2 text-ink-500 md:col-span-2">
                  <span className="h-1.5 w-1.5 rotate-45 bg-brass-500/60" />
                  {l.distance}
                </span>
                <p className="text-ink-500 md:col-span-4">{l.body}</p>
              </li>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* Scenes */}
      <section className="grain relative overflow-hidden bg-ink py-24 text-white lg:py-32">
        <div className="relative mx-auto max-w-[1440px] px-5 sm:px-8">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <Reveal>
                <p className="eyebrow flex items-center gap-4 text-brass-300">
                  <span className="h-px w-10 bg-brass-300" />
                  Just outside
                </p>
              </Reveal>
              <SplitText
                text="Scenes from *Klamath* *Falls.*"
                className="mt-6 font-display text-4xl leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl"
              />
            </div>
            <Reveal delay={0.15} className="lg:col-span-4 lg:col-start-9">
              <p className="max-w-md text-white/70">
                Mountain sunsets from the suite windows, murals and historic streets a few steps from the door.
              </p>
            </Reveal>
          </div>

          <div className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
            {scenes.map((s, i) => (
              <Reveal key={s.src} delay={i * 0.1} className={`group relative self-start ${s.offset ? "md:mt-16" : ""}`}>
                <div className="relative aspect-[4/5] overflow-hidden">
                  <ParallaxImage
                    src={s.src}
                    alt={s.alt}
                    className="absolute! inset-0 [&_img]:grayscale-[20%] [&_img]:transition-[filter] [&_img]:duration-700 group-hover:[&_img]:grayscale-0"
                    sizes="(min-width: 768px) 25vw, 50vw"
                    strength={10}
                  />
                  <span className="pointer-events-none absolute inset-3 border border-white/25 transition-colors duration-500 group-hover:border-brass-300/80" />
                </div>
                <p className="mt-4 flex items-center gap-2 text-sm text-white/75">
                  <span className="h-1.5 w-1.5 shrink-0 rotate-45 bg-brass-300" />
                  {s.caption}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Local favourites */}
      <section className="bg-bone py-24 lg:py-32">
        <div className="mx-auto grid max-w-[1440px] gap-14 px-5 sm:px-8 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Reveal>
              <Eyebrow>Steps from the door</Eyebrow>
            </Reveal>
            <SplitText
              text="Local *favourites.*"
              accentClass="text-brass-500"
              className="mt-6 font-display text-5xl leading-[1.02] tracking-tight sm:text-6xl"
            />
            <Reveal delay={0.2}>
              <p className="mt-6 max-w-sm leading-relaxed text-ink-500">
                Pizza next door, coffee and pastries for the morning, a martini bar for the evening — and a grocery store a
                couple of blocks away for anything else.
              </p>
            </Reveal>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2 lg:col-span-8">
            {nearby.map((n, i) => {
              const Icon = favouriteIcons[n.name] ?? Coffee;
              return (
                <Reveal key={n.name} delay={(i % 2) * 0.08} className="sm:last:col-span-2">
                  <li className="group flex h-full items-start gap-5 border border-line bg-paper p-6 transition-[border-color,transform,box-shadow] duration-500 hover:-translate-y-1 hover:border-brass-500/60 hover:shadow-[0_24px_50px_-30px_rgba(0,0,0,0.3)]">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-brass-500/40 text-brass-700 transition-colors duration-500 group-hover:border-ink group-hover:bg-ink group-hover:text-brass-300">
                      <Icon size={19} strokeWidth={1.3} />
                    </span>
                    <span>
                      <span className="eyebrow flex items-center gap-2 text-brass-700">
                        <span className="h-1 w-1 rotate-45 bg-brass-500" />
                        {n.kind}
                      </span>
                      <span className="mt-2 block font-display text-2xl leading-tight">{n.name}</span>
                      <span className="mt-1 block text-sm text-ink-500">{n.note}</span>
                    </span>
                  </li>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Map */}
      <section className="mx-auto max-w-[1440px] px-5 py-24 sm:px-8 lg:py-32">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Reveal>
              <Eyebrow>Find us</Eyebrow>
            </Reveal>
            <SplitText text="On the *map.*" accentClass="text-brass-500" className="mt-6 font-display text-4xl sm:text-5xl lg:text-6xl" />
          </div>
          <p className="flex items-center gap-2 text-sm text-ink-500">
            <MapPin size={16} className="text-brass-700" /> {site.location}
          </p>
        </div>
        <div className="mt-10 h-3">
          <DiamondDivider />
        </div>
        <LocationMap zoom={15} className="mt-10 aspect-[4/3] sm:aspect-[21/9]" />
      </section>

      <CtaBand heading="Explore all day. Come *home* to The George." image={photos.living322} />
    </>
  );
}
