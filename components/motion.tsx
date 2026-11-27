"use client";

import Image from "next/image";
import {
  animate,
  MotionConfig,
  motion,
  useInView,
  useMotionValue,
  useScroll,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, type ReactNode } from "react";

export const ease = [0.22, 1, 0.36, 1] as const;

export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

/** Fades and lifts its children in the first time they scroll into view. */
export function Reveal({
  children,
  className = "",
  delay = 0,
  y = 32,
}: {
  children?: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, delay, ease }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Splits a heading into words that slide up from behind a mask, one after
 * another. Plays on mount (`immediate`) or when scrolled into view.
 */
export function SplitText({
  text,
  className = "",
  delay = 0,
  immediate = false,
  as: Tag = "h2",
  accentClass = "text-brass-300",
}: {
  text: string;
  /** Colour for *accent* words — brass-300 on ink, brass-500 on paper. */
  accentClass?: string;
  className?: string;
  delay?: number;
  immediate?: boolean;
  as?: "h1" | "h2" | "h3" | "p";
}) {
  // Words wrapped in *asterisks* render as an italic brass accent.
  const words = text.split(" ");
  const label = text.replaceAll("*", "");
  const MotionTag = motion[Tag];
  const trigger = immediate ? { animate: "show" } : { whileInView: "show", viewport: { once: true, margin: "-60px" } };
  return (
    <MotionTag
      className={className}
      initial="hidden"
      {...trigger}
      transition={{ staggerChildren: 0.07, delayChildren: delay }}
      aria-label={label}
    >
      {words.map((raw, i) => {
        const accent = /^\*.*\*[.,!?]?$/.test(raw);
        const word = raw.replaceAll("*", "");
        return (
        <span key={i} aria-hidden="true" className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-top">
          <motion.span
            className={`inline-block ${accent ? `italic ${accentClass}` : ""}`}
            variants={{ hidden: { y: "110%" }, show: { y: "0%", transition: { duration: 1, ease } } }}
          >
            {word}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
        );
      })}
    </MotionTag>
  );
}

/** An image that drifts slower than the page while scrolling, inside a clipped frame. */
export function ParallaxImage({
  src,
  alt,
  className = "",
  sizes = "100vw",
  strength = 12,
  preload = false,
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  strength?: number;
  preload?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [`-${strength}%`, `${strength}%`]);
  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div className="absolute inset-x-0" style={{ y, top: `-${strength * 2}%`, bottom: `-${strength * 2}%` }}>
        <Image src={src} alt={alt} fill sizes={sizes} preload={preload} className="object-cover" />
      </motion.div>
    </div>
  );
}

/** A clip-path wipe that uncovers an image from bottom to top when it enters view. */
export function ImageReveal({
  src,
  alt,
  className = "",
  sizes = "50vw",
  delay = 0,
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  delay?: number;
}) {
  // Visibility is observed on an unclipped wrapper: an element fully hidden by
  // its own clip-path never registers as intersecting.
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <div ref={ref} className={`relative ${className}`}>
      <motion.div
        className="absolute inset-0 overflow-hidden"
        initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
        animate={inView ? { clipPath: "inset(0% 0% 0% 0%)" } : undefined}
        transition={{ duration: 1.3, delay, ease }}
      >
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.25 }}
          animate={inView ? { scale: 1 } : undefined}
          transition={{ duration: 1.8, delay, ease }}
        >
          <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" />
        </motion.div>
      </motion.div>
    </div>
  );
}

/** Counts up to `to` the first time it's on screen. */
export function Counter({ to, decimals = 0, suffix = "" }: { to: number; decimals?: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const value = useMotionValue(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(value, to, {
      duration: 2,
      ease,
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = v.toFixed(decimals) + suffix;
      },
    });
    return () => controls.stop();
  }, [inView, to, decimals, suffix, value]);

  return (
    <span ref={ref} className="tabular-nums">
      {to.toFixed(decimals)}
      {suffix}
    </span>
  );
}

/** Thin line that grows across its container on scroll-in. */
export function Rule({ className = "", dark = false }: { className?: string; dark?: boolean }) {
  return (
    <motion.div
      aria-hidden="true"
      className={`h-px origin-left ${dark ? "bg-white/20" : "bg-line"} ${className}`}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.4, ease }}
    />
  );
}
