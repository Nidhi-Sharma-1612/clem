"use client";

import { motion, useInView } from "framer-motion";
import { Building2, KeyRound, Sofa, type LucideIcon } from "lucide-react";
import { useRef } from "react";
import { DiamondDivider, DrawIcon } from "@/components/Ornament";
import { ease } from "@/components/motion";

const pillars: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: Building2,
    title: "Historic character",
    body: "Original brick, tall windows and radiators from a building that has watched over downtown for nearly a century.",
  },
  {
    icon: Sofa,
    title: "Modern comfort",
    body: "Every suite has been renovated with air conditioning, fast WiFi, smart TVs, kitchens and premium bath amenities.",
  },
  {
    icon: KeyRound,
    title: "Easy hospitality",
    body: "24-hour self check-in, professional management and a team that is a message away whenever you need anything.",
  },
];

/** Three pillars on ink, with traced brass icons and diamond dividers (as in "Book direct"). */
export default function Pillars() {
  const ref = useRef<HTMLUListElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <ul ref={ref} className="mx-auto mt-20 grid max-w-6xl lg:grid-cols-3">
      {pillars.map((p, i) => (
        <li key={p.title} className="group relative px-6 py-12 text-center lg:py-6">
          {i > 0 && (
            <motion.span
              className="absolute inset-x-6 top-0 flex lg:inset-x-auto lg:inset-y-0 lg:left-0 lg:w-0"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={inView ? { opacity: 1, scale: 1 } : undefined}
              transition={{ duration: 1.1, delay: 0.4 + i * 0.15, ease }}
            >
              <DiamondDivider responsive tone="brass-300" />
            </motion.span>
          )}
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-brass-300/40 text-brass-300 transition-all duration-500 group-hover:border-white group-hover:bg-white group-hover:text-ink">
            <DrawIcon icon={p.icon} drawn={inView} delay={0.5 + i * 0.15} size={24} />
          </span>
          <motion.h3
            className="mt-8 font-display text-3xl"
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.9, delay: 0.6 + i * 0.12, ease }}
          >
            {p.title}
          </motion.h3>
          <motion.p
            className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-white/65"
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.9, delay: 0.7 + i * 0.12, ease }}
          >
            {p.body}
          </motion.p>
        </li>
      ))}
    </ul>
  );
}
