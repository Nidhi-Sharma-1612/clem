"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { ease, SplitText } from "@/components/motion";

/**
 * Dark photo hero for inner pages. Wrap a word in *asterisks* in `title` for
 * the italic brass accent. `bridge` content (e.g. the search widget) is pulled
 * up over the hero's bottom edge, the same way the homepage widget sits.
 */
export default function DarkHero({
  eyebrow,
  title,
  image,
  intro,
  imagePosition = "50% 50%",
  compact = false,
  bridge,
}: {
  eyebrow: string;
  title: string;
  image: { src: string; alt: string };
  intro?: string;
  imagePosition?: string;
  compact?: boolean;
  bridge?: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  return (
    <section className="relative">
      <div
        ref={ref}
        className={`grain relative flex items-end overflow-hidden bg-ink ${compact ? "h-[72svh] min-h-[560px]" : "h-[85svh] min-h-[560px]"}`}
      >
        <motion.div className="absolute inset-0" style={{ y, scale }}>
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 2.2, ease }}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              preload
              sizes="100vw"
              style={{ objectPosition: imagePosition }}
              className="object-cover grayscale-[40%]"
            />
          </motion.div>
        </motion.div>
        <div className="absolute inset-0 bg-linear-to-t from-ink via-ink/45 to-ink/40" />
        <div className="absolute inset-0 bg-linear-to-r from-ink/60 via-transparent to-transparent" />

        <div className={`relative mx-auto w-full max-w-[1440px] px-5 sm:px-8 ${bridge ? "pb-28 sm:pb-32" : "pb-20 lg:pb-28"}`}>
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2, ease }}
                className="eyebrow flex items-center gap-4 text-brass-300"
              >
                <span className="h-px w-10 bg-brass-300" />
                {eyebrow}
              </motion.p>
              <SplitText
                as="h1"
                immediate
                delay={0.3}
                text={title}
                className="mt-6 max-w-5xl font-display text-5xl leading-[1] tracking-tight text-white sm:text-7xl lg:text-[7rem]"
              />
            </div>
            {intro && (
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.8, ease }}
                className="max-w-md leading-relaxed text-white/75 lg:col-span-4"
              >
                {intro}
              </motion.p>
            )}
          </div>
        </div>
      </div>

      {bridge && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7, ease }}
          className="relative z-20 mx-auto -mt-16 max-w-[1440px] px-5 sm:px-8"
        >
          {bridge}
        </motion.div>
      )}
    </section>
  );
}
