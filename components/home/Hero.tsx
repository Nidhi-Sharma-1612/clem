"use client";

import Image from "next/image";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, ArrowRight, Star } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import SearchBar from "@/components/SearchBar";
import { ease, SplitText } from "@/components/motion";
import { photos } from "@/lib/photos";
import { averageRating, suites, totalReviews } from "@/lib/suites";

/** `pos` is the CSS object-position: interiors are anchored low so wide-angle ceilings and fans crop out. */
const slides = [
  { ...photos.street, pos: "50% 45%" },
  { ...photos.living202, pos: "50% 85%" },
  { ...photos.living304, pos: "50% 80%" },
  { ...photos.living316, pos: "50% 75%" },
];


export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const [[slide, dir], setSlide] = useState([0, 1]);
  const [paused, setPaused] = useState(false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-25%"]);
  const fade = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  function go(step: number) {
    setSlide(([s]) => [(s + step + slides.length) % slides.length, step]);
  }

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setSlide(([s]) => [(s + 1) % slides.length, 1]), 7000);
    return () => clearInterval(id);
  }, [paused, slide]);

  return (
    <section className="relative">
      <div ref={ref} className="grain relative flex h-[100svh] min-h-[720px] items-end overflow-hidden bg-ink">
        {/* Slides: cross-fade with a slow push-in, wiping in from the direction of travel */}
        <motion.div className="absolute inset-0" style={{ y: imageY }}>
          <AnimatePresence initial={false} custom={dir}>
            <motion.div
              key={slide}
              custom={dir}
              className="absolute inset-0"
              initial={{ clipPath: dir > 0 ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)", scale: 1.12 }}
              animate={{ clipPath: "inset(0 0% 0 0%)", scale: 1.02 }}
              exit={{ opacity: 0.6 }}
              transition={{ clipPath: { duration: 1.4, ease }, scale: { duration: 9, ease: "linear" }, opacity: { duration: 1.4 } }}
            >
              <Image
                src={slides[slide].src}
                alt={slides[slide].alt}
                fill
                preload={slide === 0}
                sizes="100vw"
                style={{ objectPosition: slides[slide].pos }}
                className="object-cover grayscale-[30%]"
              />
            </motion.div>
          </AnimatePresence>
        </motion.div>

        <div className="absolute inset-0 bg-linear-to-t from-ink/95 via-ink/35 to-ink/50" />
        <div className="absolute inset-0 bg-linear-to-r from-ink/75 via-ink/20 to-transparent" />

        <motion.div
          style={{ y: textY, opacity: fade }}
          className="relative mx-auto w-full max-w-[1440px] px-5 pb-28 sm:px-8 sm:pb-32"
        >
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease }}
            className="eyebrow flex items-center gap-4 text-brass-300"
          >
            <span className="h-px w-10 bg-brass-300" />
            Boutique suites · Downtown Klamath Falls
          </motion.p>
          <SplitText
            as="h1"
            immediate
            delay={0.35}
            text="A 1930s landmark, *reimagined* for today."
            className="mt-6 max-w-6xl font-display text-[3rem] leading-[0.98] tracking-tight text-white sm:text-7xl lg:text-[6.6rem] xl:text-[7rem]"
          />

          <div className="mt-10 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.1, ease }}
              className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/80"
            >
              <span className="flex items-center gap-2">
                <span className="flex gap-0.5 text-brass-300">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={12} fill="currentColor" strokeWidth={0} />
                  ))}
                </span>
                <span className="font-semibold text-white">{averageRating}</span> · {totalReviews} reviews
              </span>
              <span className="h-4 w-px bg-white/25" />
              <span>{suites.length} suites in a century-old building</span>
            </motion.div>

            {/* Slide controls: counter and arrows */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.25, ease }}
              className="flex items-center gap-5 text-white"
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
            >
              <p className="font-display text-lg tabular-nums" aria-live="polite">
                0{slide + 1} <span className="text-white/40">/ 0{slides.length}</span>
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label="Previous photo"
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-white/30 transition-colors hover:border-white hover:bg-white hover:text-ink"
                >
                  <ArrowLeft size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label="Next photo"
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-white/30 transition-colors hover:border-white hover:bg-white hover:text-ink"
                >
                  <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/*
        The widget bridges both sections: its glass header tier (h-16) sits
        inside the hero photo, and the seam falls exactly where the field row
        begins on the white welcome section below.
      */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.9, ease }}
        className="relative z-20 mx-auto -mt-16 max-w-[1440px] px-5 sm:px-8"
      >
        <SearchBar variant="hero" />
      </motion.div>
    </section>
  );
}
