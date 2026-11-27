import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ParallaxImage, Reveal, SplitText } from "@/components/motion";
import { photos } from "@/lib/photos";

/**
 * Closing call-to-action used across pages. Inset on a white margin so it
 * reads as its own moment rather than merging into the dark footer below.
 * Wrap a word in *asterisks* in `heading` for the italic brass accent.
 */
export default function CtaBand({
  heading = "Your suite on Main Street is *waiting.*",
  image = photos.bedroom202,
}: {
  heading?: string;
  image?: { src: string; alt: string };
}) {
  return (
    <section className="bg-paper px-3 py-3 sm:px-5 sm:py-5">
      <div className="grain relative isolate flex min-h-[78vh] items-center overflow-hidden bg-ink text-white">
        <ParallaxImage
          src={image.src}
          alt={image.alt}
          // Anchored low so wide-angle ceilings and fans crop out of frame.
          className="absolute! inset-0 -z-10 opacity-60 [&_img]:object-[50%_80%] [&_img]:grayscale-[30%]"
          strength={12}
        />
        <div className="absolute inset-0 -z-10 bg-linear-to-b from-ink/60 via-ink/45 to-ink/80" />

        {/* Hairline frame inset from the edges, as on the homepage photos */}
        <Reveal y={0} delay={0.3} className="pointer-events-none absolute inset-4 border border-white/20 sm:inset-6" />

        <div className="relative mx-auto w-full max-w-[1440px] px-8 py-28 text-center sm:px-12">
          <Reveal>
            <p className="eyebrow flex items-center justify-center gap-4 text-brass-300">
              <span className="h-px w-10 bg-brass-300" />
              Reserve your stay
              <span className="h-px w-10 bg-brass-300" />
            </p>
          </Reveal>
          <SplitText
            text={heading}
            className="mx-auto mt-7 max-w-5xl font-display text-5xl leading-[1.02] tracking-tight sm:text-6xl lg:text-[6.5rem]"
          />

          <Reveal delay={0.4}>
            <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/suites"
                className="group relative flex items-center gap-3 overflow-hidden bg-white px-10 py-5 text-xs font-semibold tracking-[0.2em] text-ink uppercase"
              >
                <span className="absolute inset-0 translate-y-full bg-brass-300 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0" />
                <span className="relative">Book direct</span>
                <ArrowRight size={14} className="relative transition-transform duration-500 group-hover:translate-x-1" />
              </Link>
              <Link
                href="/contact"
                className="group relative overflow-hidden border border-white/40 px-10 py-5 text-xs font-semibold tracking-[0.2em] uppercase transition-colors duration-500 hover:border-white hover:text-ink"
              >
                <span className="absolute inset-0 translate-y-full bg-white transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0" />
                <span className="relative">Ask a question</span>
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
