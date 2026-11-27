"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Check, Minus, Phone } from "lucide-react";
import { useRef } from "react";
import { ease, Reveal, SplitText } from "@/components/motion";
import { site } from "@/lib/site";

/** Direct vs. platform, using only claims the hotel already makes. */
const rows: { label: string; direct: string; platform: string; platformYes?: boolean }[] = [
  { label: "Nightly rate", direct: "Best rate, guaranteed", platform: "Often higher" },
  { label: "Service fee", direct: "None", platform: "Added at checkout" },
  { label: "Early check-in", direct: "Free, when available", platform: "Not included" },
  { label: "Who you talk to", direct: "Our team, directly", platform: "Platform messaging", platformYes: true },
];

export default function BookDirect() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-120px" });

  return (
    <section className="grain relative overflow-hidden bg-ink py-24 text-white lg:py-32">
      <div ref={ref} className="relative mx-auto grid max-w-[1440px] gap-14 px-5 sm:px-8 lg:grid-cols-12 lg:items-center lg:gap-16">
        {/* Message */}
        <div className="lg:col-span-5">
          <Reveal>
            <p className="eyebrow flex items-center gap-4 text-brass-300">
              <span className="h-px w-10 bg-brass-300" />
              Book direct &amp; save
            </p>
          </Reveal>
          <SplitText
            text="The best rate is *always* here."
            className="mt-6 font-display text-5xl leading-[1.02] tracking-tight sm:text-6xl"
          />
          <Reveal delay={0.2}>
            <p className="mt-6 max-w-md leading-relaxed text-white/60">
              The same suites are listed on booking platforms — but reserving with us means no platform fee, our best
              rate, and a real person on the other end.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5">
              <Link
                href="/suites"
                className="group relative inline-flex items-center gap-3 overflow-hidden bg-white px-8 py-4 text-xs font-semibold tracking-[0.2em] text-ink uppercase"
              >
                <span className="absolute inset-0 translate-y-full bg-brass-300 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0" />
                <span className="relative">Find your suite</span>
                <ArrowRight size={14} className="relative transition-transform duration-500 group-hover:translate-x-1" />
              </Link>
              <a href={site.phoneHref} className="group flex items-center gap-3 text-sm text-white/70 hover:text-white">
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 transition-colors group-hover:border-brass-300 group-hover:text-brass-300">
                  <Phone size={15} />
                </span>
                <span>
                  <span className="eyebrow block text-white/40">Or call us</span>
                  {site.phone}
                </span>
              </a>
            </div>
          </Reveal>
        </div>

        {/* Comparison */}
        <div className="lg:col-span-7">
          <div className="relative border border-white/15 bg-white/[0.03] backdrop-blur-md">
            {/* Highlighted "Book direct" column */}
            <motion.span
              aria-hidden="true"
              className="absolute inset-y-0 left-[40%] hidden w-[30%] origin-top sm:block border-x border-brass-300/40 bg-brass-300/[0.07]"
              initial={{ scaleY: 0 }}
              animate={inView ? { scaleY: 1 } : undefined}
              transition={{ duration: 1.1, delay: 0.3, ease }}
            />

            <div className="relative grid grid-cols-2 border-b border-white/15 sm:grid-cols-[40%_30%_30%] text-[0.65rem] font-semibold tracking-[0.18em] uppercase sm:text-xs">
              <span className="hidden px-4 py-5 text-white/40 sm:block sm:px-6">Compare</span>
              <span className="flex items-center gap-2 bg-brass-300/[0.07] px-4 py-5 text-brass-300 sm:bg-transparent sm:px-6">
                <span className="h-1.5 w-1.5 rotate-45 bg-brass-300" />
                Book direct
              </span>
              <span className="px-4 py-5 text-white/40 sm:px-6">Platforms</span>
            </div>

            {rows.map((row, i) => (
              <motion.div
                key={row.label}
                className="relative grid grid-cols-2 border-b border-white/10 last:border-b-0 sm:grid-cols-[40%_30%_30%]"
                initial={{ opacity: 0, y: 14 }}
                animate={inView ? { opacity: 1, y: 0 } : undefined}
                transition={{ duration: 0.8, delay: 0.6 + i * 0.12, ease }}
              >
                <span className="col-span-2 px-4 pt-5 pb-1 font-display text-xl leading-tight sm:col-span-1 sm:px-6 sm:py-6 sm:text-2xl">{row.label}</span>
                <span className="flex items-start gap-2 bg-brass-300/[0.07] px-4 py-4 text-sm text-white sm:bg-transparent sm:px-6 sm:py-6">
                  <Check size={16} className="mt-0.5 shrink-0 text-brass-300" />
                  {row.direct}
                </span>
                <span className="flex items-start gap-2 px-4 py-4 text-sm text-white/55 sm:px-6 sm:py-6">
                  {row.platformYes ? (
                    <Check size={16} className="mt-0.5 shrink-0 text-white/30" />
                  ) : (
                    <Minus size={16} className="mt-0.5 shrink-0 text-white/30" />
                  )}
                  {row.platform}
                </span>
              </motion.div>
            ))}
          </div>
          <Reveal delay={0.9}>
            <p className="mt-4 text-xs text-white/40">
              Same cancellation terms either way: full refund up to 14 days before arrival.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
