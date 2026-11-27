"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Bath, BedDouble, Star, Users } from "lucide-react";
import { ease } from "@/components/motion";
import type { Suite } from "@/lib/suites";

export function RatingBadge({ suite, className = "" }: { suite: Suite; className?: string }) {
  if (!suite.reviews) return <span className={`eyebrow text-brass-700 ${className}`}>New</span>;
  return (
    <span className={`flex items-center gap-1.5 text-sm ${className}`}>
      <Star size={13} fill="currentColor" strokeWidth={0} className="text-brass-500" />
      <span className="font-semibold">{suite.rating.toFixed(1)}</span>
      <span className="text-ink-500">({suite.reviews})</span>
    </span>
  );
}

/**
 * The site's suite card: an uncluttered photo (suite number + rating) with a
 * hairline inner frame, and details set below it. `dark` for ink sections.
 */
export default function SuiteCard({
  suite,
  index = 0,
  dark = false,
  sizes = "(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 80vw",
  className = "",
  preload = false,
  query = "",
}: {
  suite: Suite;
  index?: number;
  dark?: boolean;
  sizes?: string;
  className?: string;
  /** Preload the photo when the card is likely above the fold. */
  preload?: boolean;
  /** Search to carry into the suite page, e.g. `?checkIn=…&guests=2`. */
  query?: string;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px 0px" }}
      transition={{ duration: 0.9, delay: (index % 3) * 0.12, ease }}
      className={className}
    >
      <Link href={`/suites/${suite.slug}${query}`} className="group block">
        <div className={`relative aspect-[4/5] overflow-hidden ${dark ? "bg-ink-800" : "bg-bone"}`}>
          <Image
            src={suite.images[0]}
            alt={`${suite.title}, Suite ${suite.unit}`}
            fill
            preload={preload}
            sizes={sizes}
            className="object-cover grayscale-[35%] transition-[transform,filter] duration-[1.2s] ease-out group-hover:scale-105 group-hover:grayscale-0"
          />
          <div className="absolute inset-0 bg-linear-to-b from-ink/55 via-transparent to-transparent" />
          <span className="pointer-events-none absolute inset-4 border border-white/25 transition-colors duration-500 group-hover:border-brass-300/80" />

          <div className="absolute inset-x-8 top-8 flex items-start justify-between">
            <span className="font-display text-5xl leading-none text-white">{suite.unit}</span>
            {suite.reviews > 0 ? (
              <span className="flex items-center gap-1.5 text-xs text-white">
                <Star size={12} fill="currentColor" strokeWidth={0} className="text-brass-300" />
                {suite.rating.toFixed(1)} <span className="text-white/75">({suite.reviews})</span>
              </span>
            ) : (
              <span className="eyebrow text-brass-300">New</span>
            )}
          </div>

          <span className="absolute right-8 bottom-8 flex h-12 w-12 translate-y-3 items-center justify-center rounded-full bg-white text-ink opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
            <ArrowUpRight size={18} />
          </span>
        </div>

        <div className="mt-6 flex items-start justify-between gap-6">
          <div className="min-w-0">
            <p className={`eyebrow ${dark ? "text-brass-300" : "text-brass-700"}`}>Floor {suite.floor}</p>
            <h3
              className={`mt-2 font-display text-2xl leading-tight transition-colors duration-500 ${dark ? "text-white group-hover:text-brass-300" : "text-ink group-hover:text-brass-700"}`}
            >
              {suite.title}
            </h3>
          </div>
          <p className={`shrink-0 text-right text-xs ${dark ? "text-white/70" : "text-ink-500"}`}>
            from <span className={`block font-display text-2xl ${dark ? "text-white" : "text-ink"}`}>${suite.priceFrom}</span>
          </p>
        </div>
        <div
          className={`mt-4 flex items-center gap-5 border-t pt-4 text-xs ${dark ? "border-white/15 text-white/80" : "border-line text-ink-500"}`}
        >
          {[
            { icon: Users, label: `${suite.guests} guests` },
            { icon: BedDouble, label: `${suite.bedrooms} bd` },
            { icon: Bath, label: `${suite.bathrooms} ba` },
          ].map(({ icon: Icon, label }) => (
            <span key={label} className="flex items-center gap-1.5">
              <Icon size={13} className={dark ? "text-brass-300" : "text-brass-700"} /> {label}
            </span>
          ))}
        </div>
      </Link>
    </motion.article>
  );
}
