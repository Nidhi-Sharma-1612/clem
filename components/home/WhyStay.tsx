"use client";

import { motion, useInView } from "framer-motion";
import { KeyRound, MapPin, Sofa, Wifi } from "lucide-react";
import { useRef, useState } from "react";
import { DiamondDivider, DrawIcon } from "@/components/Ornament";
import { ease, Reveal, SplitText } from "@/components/motion";

const reasons = [
  {
    icon: MapPin,
    title: "Prime downtown location",
    body: "Steps from restaurants, coffee shops, Klamath Commons Park and the Amtrak station.",
  },
  {
    icon: Sofa,
    title: "Boutique-style suites",
    body: "Historic architecture meets modern interior design — every suite styled a little differently.",
  },
  {
    icon: Wifi,
    title: "Modern amenities",
    body: "High-speed WiFi, air conditioning, smart TVs and a kitchen or kitchenette in every suite.",
  },
  {
    icon: KeyRound,
    title: "Effortless arrival",
    body: "24-hour self check-in, on-site laundry and Greystone bath amenities, ready when you are.",
  },
];

export default function WhyStay() {
  const list = useRef<HTMLUListElement>(null);
  const inView = useInView(list, { once: true, margin: "-120px" });
  const [spot, setSpot] = useState({ x: 0, y: 0, on: false });

  return (
    <section className="overflow-x-clip bg-bone py-24 lg:py-32">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="eyebrow flex items-center gap-4 text-brass-700">
                <span className="h-px w-10 bg-brass-500" />
                Why stay at The George
              </p>
            </Reveal>
            <SplitText
              text="More than a hotel room. A place to *land.*"
              accentClass="text-brass-500"
              className="mt-6 font-display text-4xl leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl"
            />
          </div>
          <Reveal delay={0.15} className="lg:col-span-4 lg:col-start-9">
            <p className="max-w-md text-ink-500">
              The character of a 1930s landmark with the ease of a modern apartment — and the whole of downtown on your
              doorstep.
            </p>
          </Reveal>
        </div>

        <ul
          ref={list}
          onMouseMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            setSpot({ x: e.clientX - r.left, y: e.clientY - r.top, on: true });
          }}
          onMouseLeave={() => setSpot((s) => ({ ...s, on: false }))}
          className="relative mt-14 grid lg:mt-20 lg:grid-cols-4"
        >
          {/* Cursor spotlight */}
          <span
            aria-hidden="true"
            // Extends past the list so the glow fades out before reaching any edge.
            className="pointer-events-none absolute -inset-24 hidden transition-opacity duration-500 lg:block"
            style={{
              opacity: spot.on ? 1 : 0,
              background: `radial-gradient(320px circle at ${spot.x + 96}px ${spot.y + 96}px, rgba(255,255,255,0.85), transparent 70%)`,
            }}
          />

          {reasons.map(({ icon, title, body }, i) => (
            <li key={title} className={`group relative py-12 lg:py-10 ${i > 0 ? "lg:pl-12" : ""} ${i < 3 ? "lg:pr-12" : ""}`}>
              {/* Ornament divider: fading brass line with a diamond at its centre —
                  upright between columns on desktop, lying flat between stacked items below. */}
              {i > 0 && (
                <motion.span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 flex lg:inset-x-auto lg:inset-y-6 lg:left-0 lg:w-0"
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={inView ? { opacity: 1, scale: 1 } : undefined}
                  transition={{ duration: 1.1, delay: 0.4 + i * 0.15, ease }}
                >
                  <DiamondDivider responsive />
                </motion.span>
              )}

              {/* Oversized numeral */}
              <motion.span
                aria-hidden="true"
                className="pointer-events-none absolute top-8 right-0 font-display text-7xl leading-none text-ink/[0.1] transition-colors duration-700 group-hover:text-brass-500/40 sm:right-8 lg:top-10 lg:text-8xl"
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : undefined}
                transition={{ duration: 1.2, delay: 0.3 + i * 0.12, ease }}
              >
                0{i + 1}
              </motion.span>

              <div className="relative">
                <span className="flex h-14 w-14 items-center justify-center rounded-full border border-brass-500/40 text-brass-700 transition-all duration-500 group-hover:border-ink group-hover:bg-ink group-hover:text-brass-300">
                  <DrawIcon icon={icon} drawn={inView} delay={0.6 + i * 0.15} />
                </span>
                <motion.h3
                  className="mt-10 font-display text-2xl leading-tight transition-transform duration-500 group-hover:translate-x-1"
                  initial={{ opacity: 0, y: 16 }}
                  animate={inView ? { opacity: 1, y: 0 } : undefined}
                  transition={{ duration: 0.9, delay: 0.7 + i * 0.12, ease }}
                >
                  {title}
                </motion.h3>
                <motion.p
                  className="mt-3 max-w-xs text-sm leading-relaxed text-ink-500"
                  initial={{ opacity: 0, y: 16 }}
                  animate={inView ? { opacity: 1, y: 0 } : undefined}
                  transition={{ duration: 0.9, delay: 0.8 + i * 0.12, ease }}
                >
                  {body}
                </motion.p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
