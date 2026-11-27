import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Pillars from "@/components/about/Pillars";
import CtaBand from "@/components/CtaBand";
import DarkHero from "@/components/DarkHero";
import Testimonials from "@/components/home/Testimonials";
import { DiamondDivider } from "@/components/Ornament";
import { ImageReveal, ParallaxImage, Reveal, SplitText } from "@/components/motion";
import { photos } from "@/lib/photos";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "Historic George Hotel blends historic architecture with modern design in the heart of downtown Klamath Falls, Oregon.",
};

/** Brass-ruled section label used across the site. */
function Eyebrow({ children, light = false, center = false }: { children: React.ReactNode; light?: boolean; center?: boolean }) {
  const tone = light ? "text-brass-300" : "text-brass-700";
  const rule = light ? "bg-brass-300" : "bg-brass-500";
  return (
    <p className={`eyebrow flex items-center gap-4 ${tone} ${center ? "justify-center" : ""}`}>
      <span className={`h-px w-10 ${rule}`} />
      {children}
      {center && <span className={`h-px w-10 ${rule}`} />}
    </p>
  );
}

const details = [
  { photo: photos.living203, caption: "Suite 203 · Mid-century living", className: "md:mt-24" },
  { photo: photos.tile203, caption: "Suite 203 · Hexagon tile", className: "", strength: 18 },
  { photo: photos.bedroom316, caption: "Suite 316 · Warm-lit bedroom", className: "md:mt-48" },
];

export default function AboutPage() {
  return (
    <>
      <DarkHero
        compact
        eyebrow="About Historic George Hotel"
        title="Where history *checks* in."
        intro="A restored 1930s building in downtown Klamath Falls, reimagined as boutique suites for today's travellers."
        image={photos.entrance}
        imagePosition="50% 40%"
      />

      {/* A boutique stay */}
      <section className="mx-auto max-w-[1440px] px-5 py-24 sm:px-8 lg:py-36">
        <div className="grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <Eyebrow>A boutique stay</Eyebrow>
          </Reveal>
          <div className="lg:col-span-8">
            <SplitText
              text="A boutique accommodation in the *heart* of downtown Klamath Falls, Oregon."
              accentClass="text-brass-500"
              className="font-display text-4xl leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl"
            />
            <Reveal delay={0.2}>
              <div className="mt-10 grid gap-8 text-ink-500 sm:grid-cols-2">
                <p className="leading-relaxed">
                  Our property blends historic architecture with modern design, creating a unique place for travelers to
                  stay while exploring the natural beauty of Southern Oregon.
                </p>
                <p className="leading-relaxed">
                  Each suite has been thoughtfully curated to offer comfort, convenience, and style, providing guests with a
                  relaxing experience from check-in to check-out.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Our story */}
      <section className="mx-auto grid max-w-[1440px] items-center gap-12 px-5 pb-24 sm:px-8 lg:grid-cols-12 lg:gap-20 lg:pb-36">
        <div className="relative lg:col-span-6">
          <ImageReveal
            src={photos.street.src}
            alt={photos.street.alt}
            className="aspect-[4/5] [&_img]:grayscale-[30%]"
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
          <Reveal delay={0.8} y={0} className="pointer-events-none absolute inset-4 border border-white/30" />
          <Reveal
            delay={1}
            y={12}
            className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-4 border-t border-white/15 bg-ink/50 px-5 py-4 text-white backdrop-blur-md"
          >
            <span className="flex items-center gap-3">
              <span className="h-2 w-2 rotate-45 bg-brass-300" />
              <span className="font-display text-lg">The George · Main Street</span>
            </span>
            <span className="eyebrow text-white/60">Est. 1930s</span>
          </Reveal>
        </div>
        <div className="lg:col-span-6">
          <Reveal>
            <Eyebrow>Our story</Eyebrow>
          </Reveal>
          <SplitText
            text="Celebrating a historic building, with modern *hospitality.*"
            accentClass="text-brass-500"
            className="mt-6 font-display text-4xl leading-[1.08] tracking-tight sm:text-5xl"
          />
          <Reveal delay={0.15}>
            <div className="mt-8 space-y-5 leading-relaxed text-ink-500">
              <p>
                Historic George Hotel was designed to celebrate the charm of a historic building while offering the comforts of
                modern hospitality.
              </p>
              <p>Today, it serves as a welcoming destination for travelers who want more than a typical hotel stay.</p>
              <p>
                Guests enjoy spacious suites, modern amenities, and a location that makes exploring Klamath Falls easy — the
                Amtrak station, restaurants, shops and Klamath Commons Park are all a short walk away.
              </p>
            </div>
            <Link
              href="/suites"
              className="group relative mt-10 inline-flex items-center gap-3 overflow-hidden bg-ink px-8 py-4 text-xs font-semibold tracking-[0.2em] text-white uppercase"
            >
              <span className="absolute inset-0 translate-y-full bg-brass-700 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0" />
              <span className="relative">Explore the suites</span>
              <ArrowRight size={14} className="relative transition-transform duration-500 group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Mission */}
      <section className="grain relative overflow-hidden bg-ink py-24 text-white lg:py-32">
        <div className="relative mx-auto max-w-[1440px] px-5 sm:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <Reveal>
              <Eyebrow light center>
                Our mission
              </Eyebrow>
            </Reveal>
            <SplitText
              text="To provide comfortable, stylish accommodations and *exceptional* hospitality for every guest."
              className="mt-8 font-display text-4xl leading-[1.15] tracking-tight sm:text-5xl lg:text-6xl"
            />
            <Reveal delay={0.3}>
              <Link
                href="/contact"
                className="group relative mt-12 inline-flex items-center gap-3 overflow-hidden border border-white/30 px-8 py-4 text-xs font-semibold tracking-[0.2em] uppercase transition-colors duration-500 hover:border-white hover:text-ink"
              >
                <span className="absolute inset-0 translate-y-full bg-white transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0" />
                <span className="relative">Contact us</span>
                <ArrowRight size={14} className="relative transition-transform duration-500 group-hover:translate-x-1" />
              </Link>
            </Reveal>
          </div>
          <Pillars />
        </div>
      </section>

      {/* The details */}
      <section className="mx-auto max-w-[1440px] px-5 py-24 sm:px-8 lg:py-36">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Reveal>
              <Eyebrow>The details</Eyebrow>
            </Reveal>
            <SplitText
              text="Every suite, a little *different.*"
              accentClass="text-brass-500"
              className="mt-6 font-display text-4xl leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl"
            />
          </div>
          <Reveal delay={0.15} className="lg:col-span-4 lg:col-start-9">
            <p className="max-w-md text-ink-500">
              Herringbone floors, mid-century pieces, classic black-and-white tile — each suite has its own character.
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-5 md:grid-cols-3">
          {details.map((d) => (
            <div key={d.caption} className={`group relative self-start ${d.className}`}>
              <ParallaxImage
                src={d.photo.src}
                alt={d.photo.alt}
                className="aspect-[3/4] [&_img]:grayscale-[25%] [&_img]:transition-[filter] [&_img]:duration-700 group-hover:[&_img]:grayscale-0"
                sizes="(min-width: 768px) 33vw, 100vw"
                strength={d.strength}
              />
              <span className="pointer-events-none absolute inset-3 border border-white/30 transition-colors duration-500 group-hover:border-brass-300/80" />
              <span className="absolute inset-x-3 bottom-3 flex items-center gap-3 border-t border-white/15 bg-ink/55 px-4 py-3 text-white backdrop-blur-md">
                <span className="h-1.5 w-1.5 shrink-0 rotate-45 bg-brass-300" />
                <span className="truncate font-display text-base">{d.caption}</span>
              </span>
            </div>
          ))}
        </div>

        <div className="mt-24 h-3">
          <DiamondDivider />
        </div>
      </section>

      <Testimonials />
      <CtaBand />
    </>
  );
}
