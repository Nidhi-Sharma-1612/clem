"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ease } from "@/components/motion";

/** Sticky jump-menu that highlights whichever section is in the middle of the screen. */
export default function SectionNav({ items }: { items: { id: string; label: string }[] }) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    items.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [items]);

  return (
    <nav aria-label="Policies" className="sticky top-28">
      <p className="eyebrow flex items-center gap-4 text-brass-700">
        <span className="h-px w-10 bg-brass-500" />
        On this page
      </p>
      <ul className="mt-6 border-l border-line">
        {items.map(({ id, label }, i) => {
          const on = id === active;
          return (
            <li key={id} className="relative">
              {on && (
                <motion.span layoutId="policy-nav" className="absolute top-0 bottom-0 -left-px w-px bg-brass-500" transition={{ duration: 0.5, ease }} />
              )}
              <a
                href={`#${id}`}
                className={`flex items-baseline gap-3 py-3 pl-5 transition-colors ${on ? "text-ink" : "text-ink-500 hover:text-ink"}`}
              >
                <span className={`text-xs font-semibold tabular-nums ${on ? "text-brass-700" : "text-ink-500"}`}>0{i + 1}</span>
                <span className="font-display text-xl">{label}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
