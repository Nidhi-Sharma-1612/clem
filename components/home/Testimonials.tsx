"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { ease, Reveal, SplitText } from "@/components/motion";
import { testimonials } from "@/lib/data/content";
import { averageRating, suites, totalReviews } from "@/lib/suites";

const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((p) => p[0])
    .join("")
    .replace(/\W/g, "");

const [featured, ...rest] = testimonials;

function Avatar({ name, dark = false }: { name: string; dark?: boolean }) {
  return (
    <span
      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-display text-base ${dark ? "bg-brass-300 text-ink" : "bg-ink text-brass-300"}`}
    >
      {initials(name)}
    </span>
  );
}

export default function Testimonials() {
  return (
    <section className="bg-bone py-24 lg:py-32">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8">
        {/* Header */}
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="eyebrow flex items-center gap-4 text-brass-700">
                <span className="h-px w-10 bg-brass-500" />
                Guest notes
              </p>
            </Reveal>
            <SplitText
              text="In our *guests'* own words."
              accentClass="text-brass-500"
              className="mt-6 font-display text-5xl leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl"
            />
          </div>
          <Reveal delay={0.15} className="lg:col-span-4 lg:col-start-9">
            <p className="max-w-md text-ink-500">
              Reviews from travellers who have stayed across our {suites.length} suites — from weekend getaways to
              extended stays.
            </p>
          </Reveal>
        </div>

        {/* Bento: dark feature card + four reviews */}
        <div className="mt-14 grid gap-5 lg:mt-20 lg:grid-cols-3 lg:grid-rows-2">
          <motion.figure
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px 0px" }}
            transition={{ duration: 0.9, ease }}
            className="grain relative flex flex-col justify-between overflow-hidden bg-ink p-8 text-white sm:p-10 lg:row-span-2"
          >
            <div className="relative">
              <div className="flex items-end gap-4">
                <span className="font-display text-7xl leading-none">{averageRating}</span>
                <span className="pb-1.5">
                  <span className="flex gap-0.5 text-brass-300">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={14} fill="currentColor" strokeWidth={0} />
                    ))}
                  </span>
                  <span className="mt-1 block text-sm text-white/60">across {totalReviews} reviews</span>
                </span>
              </div>
              <span className="mt-10 block h-px w-full bg-linear-to-r from-brass-300/50 to-transparent" />
            </div>

            <div className="relative mt-10">
              <span aria-hidden="true" className="block font-display text-7xl leading-[0.6] text-brass-300">
                &ldquo;
              </span>
              <p className="eyebrow mt-4 text-brass-300">{featured.title}</p>
              <blockquote className="mt-4 font-display text-2xl leading-snug lg:text-[1.55rem]">{featured.quote}</blockquote>
              <figcaption className="mt-8 flex items-center gap-4">
                <Avatar name={featured.name} dark />
                <span>
                  <span className="block text-sm font-semibold tracking-[0.16em] uppercase">{featured.name}</span>
                  <span className="mt-0.5 block text-sm text-white/50">Guest at The George</span>
                </span>
              </figcaption>
            </div>
          </motion.figure>

          <div className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5 px-5 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 lg:col-span-2 lg:row-span-2">
            {rest.map((t, i) => (
              <motion.figure
                key={t.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px 0px" }}
                transition={{ duration: 0.9, delay: 0.1 + i * 0.1, ease }}
                className="group flex w-[82vw] shrink-0 snap-start flex-col justify-between border border-line bg-paper p-8 sm:w-auto transition-[border-color,transform,box-shadow] duration-500 hover:-translate-y-1 hover:border-brass-500/60 hover:shadow-[0_24px_50px_-30px_rgba(0,0,0,0.3)]"
              >
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <p className="eyebrow flex items-center gap-3 text-brass-700">
                      <span className="h-1.5 w-1.5 rotate-45 bg-brass-500" />
                      {t.title}
                    </p>
                    <span aria-hidden="true" className="font-display text-5xl leading-[0.6] text-brass-500/40 transition-colors duration-500 group-hover:text-brass-500">
                      &rdquo;
                    </span>
                  </div>
                  <blockquote className="mt-5 leading-relaxed text-ink-500">{t.quote}</blockquote>
                </div>
                <figcaption className="mt-8 flex items-center gap-3 border-t border-line pt-5">
                  <Avatar name={t.name} />
                  <span>
                    <span className="block text-xs font-semibold tracking-[0.16em] uppercase">{t.name}</span>
                    <span className="mt-0.5 block text-xs text-ink-500">Guest at The George</span>
                  </span>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
