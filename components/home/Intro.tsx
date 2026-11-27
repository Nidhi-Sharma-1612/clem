import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ImageReveal, Reveal, SplitText } from "@/components/motion";
import { photos } from "@/lib/photos";

/**
 * Light section that carries the hero's language: brass-ruled eyebrow,
 * italic brass accent in the headline, and a muted photo captioned the same
 * way as the hero slides.
 */
export default function Intro() {
  return (
    <section id="intro" className="relative overflow-hidden">
      <div className="relative mx-auto max-w-[1440px] px-5 py-24 sm:px-8 lg:py-40">
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <Reveal>
              <p className="eyebrow flex items-center gap-4 text-brass-700">
                <span className="h-px w-10 bg-brass-500" />
                Welcome to The George
              </p>
            </Reveal>
            <SplitText
              text="A boutique stay in the *heart* of downtown Klamath Falls."
              accentClass="text-brass-500"
              className="mt-6 font-display text-4xl leading-[1.05] tracking-tight sm:text-5xl lg:text-[4.2rem]"
            />
            <Reveal delay={0.2}>
              <p className="mt-8 max-w-md leading-relaxed text-ink-500">
                Our property blends historic architecture with modern design. Each suite is thoughtfully curated for
                comfort, convenience and style — with restaurants, shops and the Amtrak station a short walk away.
              </p>
            </Reveal>

            <Reveal delay={0.3}>
              <Link
                href="/suites"
                className="group relative mt-10 inline-flex items-center gap-4 overflow-hidden bg-ink px-8 py-4 text-xs font-semibold tracking-[0.2em] text-white uppercase"
              >
                <span className="absolute inset-0 translate-y-full bg-brass-700 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0" />
                <span className="relative">Explore the suites</span>
                <ArrowRight size={14} className="relative transition-transform duration-500 group-hover:translate-x-1" />
              </Link>
            </Reveal>
          </div>

          <div className="relative lg:col-span-6 lg:col-start-7">
            <ImageReveal
              src={photos.entrance.src}
              alt={photos.entrance.alt}
              className="aspect-[4/5] overflow-hidden rounded-t-full [&_img]:grayscale-[30%]"
              sizes="(min-width: 1024px) 45vw, 100vw"
            />
            {/* Inner arch line — a thin Art Deco double frame */}
            <Reveal delay={1} y={0} className="pointer-events-none absolute inset-3 rounded-t-full border border-white/45 sm:inset-4" />
            {/* Hero-style caption */}
            <Reveal
              delay={0.9}
              y={16}
              className="pointer-events-none absolute inset-x-0 bottom-0 bg-linear-to-t from-ink/85 via-ink/30 to-transparent px-6 pt-24 pb-6 text-white sm:px-8 sm:pb-8"
            >
              <p className="eyebrow flex items-center gap-3 text-brass-300">
                <span className="h-px w-8 bg-brass-300" />
                Est. 1930s
              </p>
              <p className="mt-3 font-display text-2xl sm:text-3xl">The George, Downtown Klamath Falls</p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
