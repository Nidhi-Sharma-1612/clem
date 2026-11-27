"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Expand, Grid2x2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Lightbox from "@/components/Lightbox";
import { ease } from "@/components/motion";
import type { Suite } from "@/lib/suites";

/** Hairline frame that appears on hover, as on the homepage photos. */
function Frame({ always = false }: { always?: boolean }) {
  return (
    <span
      className={`pointer-events-none absolute inset-3 border transition-colors duration-500 sm:inset-4 ${always ? "border-white/40 group-hover:border-brass-300/80" : "border-white/0 group-hover:border-white/50"}`}
    />
  );
}

/**
 * Desktop: one large photo and four small ones. Phones: a swipeable row.
 * "View all" opens a full-screen photo tour; any photo opens the viewer.
 */
export default function SuitePhotos({ suite }: { suite: Suite }) {
  const [open, setOpen] = useState<number | null>(null);
  const [tour, setTour] = useState(false);
  const [slide, setSlide] = useState(0);
  const track = useRef<HTMLDivElement>(null);
  const images = suite.images.map((src, i) => ({ src, alt: `${suite.title}, Suite ${suite.unit} — photo ${i + 1}` }));
  const tiles = images.slice(0, 5);
  const caption = `Suite ${suite.unit} · ${suite.title}`;

  // Lock page scroll while the tour is open; Escape closes it (unless the viewer is open on top).
  useEffect(() => {
    if (!tour) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && open === null && setTour(false);
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [tour, open]);

  const allButton = (
    <button
      type="button"
      onClick={() => setTour(true)}
      className="absolute right-4 bottom-4 z-10 flex items-center gap-2.5 border border-white/20 bg-ink/60 px-5 py-3 text-xs font-semibold tracking-[0.16em] text-white uppercase backdrop-blur-md transition-colors hover:bg-white hover:text-ink"
    >
      <Grid2x2 size={14} /> View all {images.length} photos
    </button>
  );

  return (
    <>
      {/* Desktop mosaic */}
      <div className="group/mosaic relative hidden h-[70vh] min-h-[440px] grid-cols-4 grid-rows-2 gap-2 md:grid">
        {tiles.map((img, i) => (
          <motion.button
            key={img.src}
            type="button"
            onClick={() => setOpen(i)}
            initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
            transition={{ duration: 1.1, delay: 0.15 + i * 0.08, ease }}
            className={`group relative overflow-hidden bg-bone transition-opacity duration-500 group-hover/mosaic:opacity-75 hover:!opacity-100 ${i === 0 ? "col-span-2 row-span-2" : ""}`}
            aria-label={`Open photo ${i + 1}`}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              preload={i === 0}
              sizes={i === 0 ? "50vw" : "25vw"}
              className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
            />
            <Frame always={i === 0} />
            <span className="absolute top-4 right-4 flex h-9 w-9 scale-75 items-center justify-center rounded-full bg-white/90 text-ink opacity-0 transition-all duration-500 group-hover:scale-100 group-hover:opacity-100">
              <Expand size={14} />
            </span>
          </motion.button>
        ))}
        {allButton}
      </div>

      {/* Phone carousel */}
      <div className="relative md:hidden">
        <div
          ref={track}
          onScroll={(e) => {
            const el = e.currentTarget;
            setSlide(Math.round(el.scrollLeft / el.clientWidth));
          }}
          className="no-scrollbar -mx-5 flex snap-x snap-mandatory overflow-x-auto"
        >
          {images.map((img, i) => (
            <button
              key={img.src}
              type="button"
              onClick={() => setOpen(i)}
              aria-label={`Open photo ${i + 1}`}
              className="group relative aspect-[4/3] w-screen shrink-0 snap-center bg-bone"
            >
              <Image src={img.src} alt={img.alt} fill preload={i === 0} sizes="100vw" className="object-cover" />
              <Frame always />
            </button>
          ))}
        </div>
        <span className="pointer-events-none absolute top-4 left-4 border border-white/20 bg-ink/60 px-3 py-1.5 font-display text-sm text-white tabular-nums backdrop-blur-md">
          {slide + 1} <span className="text-white/50">/ {images.length}</span>
        </span>
        <div className="mt-3 flex justify-center gap-1.5">
          {images.map((img, i) => (
            <span key={img.src} className={`h-1 rounded-full transition-all duration-300 ${i === slide ? "w-5 bg-ink" : "w-1 bg-line"}`} />
          ))}
        </div>
        <button
          type="button"
          onClick={() => setTour(true)}
          className="mt-4 flex w-full items-center justify-center gap-2.5 border border-ink py-3.5 text-xs font-semibold tracking-[0.16em] uppercase"
        >
          <Grid2x2 size={14} /> View all {images.length} photos
        </button>
      </div>

      {/* Photo tour */}
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {tour && (
              <motion.div
                role="dialog"
                aria-modal="true"
                aria-label={`All photos of ${caption}`}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 40 }}
                transition={{ duration: 0.6, ease }}
                className="fixed inset-0 z-[90] overflow-y-auto bg-paper"
              >
                <div className="sticky top-0 z-10 border-b border-line bg-paper/90 backdrop-blur-md">
                  <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-5 py-4 sm:px-8">
                    <button
                      type="button"
                      onClick={() => setTour(false)}
                      className="group flex items-center gap-3 text-xs font-semibold tracking-[0.18em] uppercase"
                    >
                      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-line transition-colors group-hover:border-ink group-hover:bg-ink group-hover:text-white">
                        <ArrowLeft size={15} />
                      </span>
                      Back to suite
                    </button>
                    <p className="hidden items-center gap-3 sm:flex">
                      <span className="h-2 w-2 rotate-45 bg-brass-500" />
                      <span className="font-display text-xl">{caption}</span>
                    </p>
                    <p className="eyebrow text-ink-500">{images.length} photos</p>
                  </div>
                </div>

                <div className="mx-auto max-w-[1200px] px-5 py-10 sm:px-8 sm:py-14">
                  <p className="eyebrow flex items-center gap-4 text-brass-700">
                    <span className="h-px w-10 bg-brass-500" />
                    Photo tour
                  </p>
                  <h2 className="mt-4 font-display text-4xl leading-tight sm:text-5xl">
                    {suite.title.split(" ").slice(0, -1).join(" ")} <em className="text-brass-500">{suite.title.split(" ").at(-1)}</em>
                  </h2>

                  {/* Editorial rhythm: one wide photo, then a pair, repeating */}
                  <div className="mt-10 grid grid-cols-2 gap-3">
                    {images.map((img, i) => (
                      <motion.button
                        key={img.src}
                        type="button"
                        onClick={() => setOpen(i)}
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-40px 0px" }}
                        transition={{ duration: 0.7, ease }}
                        className={`group relative overflow-hidden bg-bone ${i % 3 === 0 ? "col-span-2 aspect-[16/10]" : "aspect-[4/5]"}`}
                        aria-label={`Open photo ${i + 1}`}
                      >
                        <Image
                          src={img.src}
                          alt={img.alt}
                          fill
                          sizes={i % 3 === 0 ? "(min-width: 1200px) 1200px, 100vw" : "(min-width: 1200px) 600px, 50vw"}
                          className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
                        />
                        <Frame />
                        <span className="absolute bottom-3 left-3 border border-white/15 bg-ink/55 px-2.5 py-1 font-display text-sm text-white tabular-nums backdrop-blur-md sm:bottom-4 sm:left-4">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}

      <Lightbox images={images} index={open} onClose={() => setOpen(null)} onIndex={setOpen} caption={() => caption} />
    </>
  );
}
