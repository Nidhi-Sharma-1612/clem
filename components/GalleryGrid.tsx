"use client";

import Image from "next/image";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { useMemo, useState } from "react";
import Lightbox from "@/components/Lightbox";
import { ease } from "@/components/motion";
import type { GalleryCategory, GalleryPhoto } from "@/lib/gallery";

type Filter = "all" | GalleryCategory;

const filters: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "building", label: "The building" },
  { id: "area", label: "Klamath Falls" },
  { id: "suite", label: "The suites" },
];

/** Varied heights keep the masonry lively without random jumps between renders. */
const aspects = ["aspect-[3/4]", "aspect-[4/3]", "aspect-square", "aspect-[4/5]", "aspect-[4/3]"];

export default function GalleryGrid({ photos }: { photos: GalleryPhoto[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [unit, setUnit] = useState<string | null>(null);
  const [open, setOpen] = useState<number | null>(null);

  const units = useMemo(() => [...new Set(photos.filter((p) => p.unit).map((p) => p.unit!))].sort(), [photos]);
  const count = (f: Filter) => (f === "all" ? photos.length : photos.filter((p) => p.category === f).length);

  const list = photos.filter(
    (p) => (filter === "all" || p.category === filter) && (filter !== "suite" || !unit || p.unit === unit),
  );

  const pill = (active: boolean) =>
    `relative isolate shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold tracking-[0.12em] uppercase transition-colors ${active ? "text-white" : "text-ink-500 hover:text-ink"}`;

  return (
    <section className="mx-auto max-w-[1440px] px-5 pt-16 pb-24 sm:px-8 lg:pb-32">
      <LayoutGroup>
        <div className="flex flex-col gap-5 border-b border-line pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <p className="eyebrow mb-2.5 text-ink-500">Browse</p>
            <div className="no-scrollbar flex w-fit max-w-full overflow-x-auto rounded-full border border-line p-1">
              {filters.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  aria-pressed={filter === f.id}
                  onClick={() => {
                    setFilter(f.id);
                    setUnit(null);
                  }}
                  className={pill(filter === f.id)}
                >
                  {filter === f.id && (
                    <motion.span layoutId="gallery-filter" className="absolute inset-0 -z-10 rounded-full bg-ink" transition={{ duration: 0.5, ease }} />
                  )}
                  {f.label}
                  <span className="ml-1.5 opacity-50">{count(f.id)}</span>
                </button>
              ))}
            </div>
          </div>
          <p className="flex shrink-0 items-baseline gap-2 text-sm text-ink-500" aria-live="polite">
            <span className="font-display text-4xl leading-none text-ink">{list.length}</span> photos
          </p>
        </div>

        {/* Suite numbers appear once "The suites" is chosen */}
        <AnimatePresence initial={false}>
          {filter === "suite" && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.5, ease }}
              className="overflow-hidden"
            >
              <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pt-6 sm:mx-0 sm:flex-wrap sm:px-0">
                {[null, ...units].map((u) => (
                  <button
                    key={u ?? "all"}
                    type="button"
                    aria-pressed={unit === u}
                    onClick={() => setUnit(u)}
                    className={`shrink-0 rounded-full border px-4 py-1.5 text-xs font-semibold tracking-[0.12em] uppercase transition-colors ${unit === u ? "border-brass-500 bg-brass-500/10 text-brass-700" : "border-line text-ink-500 hover:border-ink hover:text-ink"}`}
                  >
                    {u ? `№ ${u}` : "Every suite"}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </LayoutGroup>

      <div className="mt-10 columns-1 gap-5 sm:columns-2 lg:columns-3">
        <AnimatePresence mode="popLayout">
          {list.map((p, i) => (
            <motion.button
              key={p.src}
              layout
              type="button"
              onClick={() => setOpen(i)}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              viewport={{ once: true, margin: "-40px 0px" }}
              transition={{ duration: 0.8, ease }}
              className={`group relative mb-5 block w-full break-inside-avoid overflow-hidden bg-bone ${aspects[i % aspects.length]}`}
              aria-label={`Open photo: ${p.caption}`}
            >
              <Image
                src={p.src}
                alt={p.alt}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover grayscale-[20%] transition-[transform,filter] duration-[1.2s] ease-out group-hover:scale-105 group-hover:grayscale-0"
              />
              <span className="pointer-events-none absolute inset-3 border border-white/0 transition-colors duration-500 group-hover:border-white/40" />
              <span className="absolute inset-x-3 bottom-3 flex translate-y-3 items-center gap-3 border-t border-white/15 bg-ink/60 px-4 py-3 text-left text-white opacity-0 backdrop-blur-md transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                <span className="h-1.5 w-1.5 shrink-0 rotate-45 bg-brass-300" />
                <span className="truncate font-display text-base">{p.caption}</span>
              </span>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      <Lightbox
        images={list.map((p) => ({ src: p.src, alt: p.alt }))}
        index={open}
        onIndex={setOpen}
        onClose={() => setOpen(null)}
        caption={(i) => list[i].caption}
      />
    </section>
  );
}
