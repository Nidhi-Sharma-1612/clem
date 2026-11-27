"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SuiteCard from "@/components/SuiteCard";
import { Reveal, SplitText } from "@/components/motion";
import { featuredSuites, suites } from "@/lib/suites";

export default function FeaturedSuites() {
  return (
    <section id="featured" className="grain relative overflow-hidden bg-ink py-24 text-white lg:py-32">
      <div className="relative mx-auto max-w-[1440px] px-5 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="eyebrow flex items-center gap-4 text-brass-300">
                <span className="h-px w-10 bg-brass-300" />
                The Collection
              </p>
            </Reveal>
            <SplitText
              text="Sixteen suites, *no* *two* alike."
              className="mt-6 font-display text-5xl leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl"
            />
          </div>
          <Reveal delay={0.15} className="lg:col-span-4 lg:col-start-9">
            <p className="max-w-md text-white/70">
              From Art Deco one-bedrooms to the two-bedroom Governor&rsquo;s Suite — every suite has a kitchen, fast
              WiFi and self check-in.
            </p>
          </Reveal>
        </div>

        {/* Phones: swipeable row. Tablet and up: grid. */}
        <div className="no-scrollbar -mx-5 mt-14 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-px-5 px-5 pb-2 sm:mx-0 sm:mt-16 sm:grid sm:grid-cols-2 sm:gap-x-8 sm:gap-y-16 sm:overflow-visible sm:px-0 lg:mt-20 lg:grid-cols-3">
          {featuredSuites.map((suite, i) => (
            <SuiteCard
              key={suite.slug}
              suite={suite}
              index={i}
              dark
              className="w-[80vw] max-w-sm shrink-0 snap-start sm:w-auto sm:max-w-none"
            />
          ))}
        </div>

        <Reveal className="mt-14 flex flex-col items-center gap-5 text-center lg:mt-20">
          <p className="text-sm text-white/65">Showing 6 of {suites.length} suites</p>
          <Link
            href="/suites"
            className="group relative inline-flex items-center gap-4 overflow-hidden border border-white/30 px-10 py-5 text-xs font-semibold tracking-[0.2em] uppercase transition-colors duration-500 hover:border-white hover:text-ink"
          >
            <span className="absolute inset-0 translate-y-full bg-white transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0" />
            <span className="relative">View all {suites.length} suites</span>
            <ArrowRight size={14} className="relative transition-transform duration-500 group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
