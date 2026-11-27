"use client";

import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";
import { useState } from "react";
import { ease, Reveal, SplitText } from "@/components/motion";
import { landmarks } from "@/lib/data/content";
import { photos } from "@/lib/photos";
import { site } from "@/lib/site";

/**
 * Photo shown for each landmark. Only real local shots from the listings are
 * used; landmarks without a matching photo fall back to the downtown view.
 * Captions describe the photo itself, never the landmark it stands in for.
 */
const views = [
  { ...photos.parkView202, caption: "Klamath Commons Park · from Suite 202" },
  { ...photos.dusk202, caption: "Downtown Klamath Falls at sunset" },
  { ...photos.clock311, caption: "Downtown Klamath Falls" },
  { ...photos.craterLake, caption: "Crater Lake National Park" },
];
const viewFor: Record<string, number> = {
  "Klamath Commons Park": 0,
  "Klamath Falls Amtrak Station": 1,
  "Main Street & Downtown": 2,
  "Oregon Tech (OIT)": 1,
  "Crater Lake National Park": 3,
};

export default function LocationTeaser() {
  const [active, setActive] = useState(0);
  const view = viewFor[landmarks[active].name];
  const [[shown, under], setViews] = useState<[number, number]>([0, 0]);
  if (view !== shown) setViews([view, shown]);

  return (
    <section className="mx-auto max-w-[1440px] px-5 py-24 sm:px-8 lg:py-32">
      <div className="grid gap-14 lg:grid-cols-12 lg:items-center lg:gap-16">
        {/* Photo follows the selected landmark; every image stays mounted so swaps never flash */}
        <Reveal className="lg:col-span-5">
          <div className="relative aspect-[4/5] overflow-hidden bg-ink">
            {views.map((v, i) => {
              const state = i === shown ? "on" : i === under ? "under" : "off";
              return (
                <motion.div
                  key={v.src}
                  className="absolute inset-0"
                  style={{ zIndex: state === "on" ? 3 : state === "under" ? 2 : 1 }}
                  initial={false}
                  animate={state === "off" ? { clipPath: "inset(0 0 0 100%)", scale: 1.1 } : { clipPath: "inset(0 0 0 0%)", scale: 1 }}
                  transition={state === "off" ? { duration: 0 } : { clipPath: { duration: 1, ease }, scale: { duration: 1.5, ease } }}
                >
                  <Image
                    src={v.src}
                    alt={i === shown ? v.alt : ""}
                    fill
                    sizes="(min-width: 1024px) 40vw, 100vw"
                    className="object-cover grayscale-[25%]"
                  />
                </motion.div>
              );
            })}
            <span className="absolute inset-0 z-[4] bg-linear-to-t from-ink/55 via-transparent to-transparent" />
            <span className="pointer-events-none absolute inset-4 z-[5] border border-white/30" />
            <div className="absolute inset-x-4 bottom-4 z-[5] flex items-center gap-3 border-t border-white/15 bg-ink/50 px-5 py-4 text-white backdrop-blur-md">
              <span className="h-2 w-2 shrink-0 rotate-45 bg-brass-300" />
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={shown}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3, ease }}
                  className="font-display text-lg leading-snug"
                >
                  {views[shown].caption}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>
        </Reveal>

        {/* Copy + interactive list */}
        <div className="lg:col-span-7">
          <Reveal>
            <p className="eyebrow flex items-center gap-4 text-brass-700">
              <span className="h-px w-10 bg-brass-500" />
              The neighbourhood
            </p>
          </Reveal>
          <SplitText
            text="Downtown on the doorstep. Crater Lake on the *horizon.*"
            accentClass="text-brass-500"
            className="mt-6 font-display text-4xl leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl"
          />

          <ul className="mt-12 border-t border-line">
            {landmarks.map((l, i) => {
              const on = i === active;
              return (
                <li key={l.name} className="relative border-b border-line">
                  <motion.span
                    aria-hidden="true"
                    className="absolute -bottom-px left-0 h-px bg-brass-500"
                    initial={false}
                    animate={{ width: on ? "100%" : "0%" }}
                    transition={{ duration: 0.7, ease }}
                  />
                  <button
                    type="button"
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    onClick={() => setActive(i)}
                    aria-expanded={on}
                    className="grid w-full grid-cols-[auto_1fr] items-baseline gap-x-5 gap-y-2 py-5 text-left sm:grid-cols-[auto_1fr_auto]"
                  >
                    <span className={`text-xs font-semibold tabular-nums transition-colors ${on ? "text-brass-700" : "text-ink-400"}`}>
                      0{i + 1}
                    </span>
                    <span
                      className={`font-display text-xl transition-[color,transform] duration-500 sm:text-2xl ${on ? "translate-x-1 text-ink" : "text-ink/60"}`}
                    >
                      {l.name}
                    </span>
                    <span
                      className={`eyebrow col-start-2 flex items-center gap-2 transition-colors sm:col-start-auto ${on ? "text-brass-700" : "text-ink-400"}`}
                    >
                      <span className={`h-1.5 w-1.5 rotate-45 ${on ? "bg-brass-500" : "bg-brass-500/40"}`} />
                      {l.distance}
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {on && (
                      <motion.p
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.5, ease }}
                        className="overflow-hidden"
                      >
                        <span className="block max-w-lg pb-6 pl-10 text-sm leading-relaxed text-ink-500">{l.body}</span>
                      </motion.p>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>

          <Reveal delay={0.3}>
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5">
              <Link
                href="/explore"
                className="group relative inline-flex items-center gap-3 overflow-hidden bg-ink px-8 py-4 text-xs font-semibold tracking-[0.2em] text-white uppercase"
              >
                <span className="absolute inset-0 translate-y-full bg-brass-700 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0" />
                <span className="relative">Explore Klamath Falls</span>
                <ArrowRight size={14} className="relative transition-transform duration-500 group-hover:translate-x-1" />
              </Link>
              <span className="flex items-center gap-2 text-sm text-ink-500">
                <MapPin size={15} className="text-brass-700" />
                {site.location}
              </span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
