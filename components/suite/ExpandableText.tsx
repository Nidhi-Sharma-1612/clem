"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { ease } from "@/components/motion";

export default function ExpandableText({ text, collapsedHeight = 260 }: { text: string; collapsedHeight?: number }) {
  const [open, setOpen] = useState(false);
  const paragraphs = text.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  const long = text.length > 700;

  return (
    <div>
      <motion.div
        initial={false}
        animate={{ height: !long || open ? "auto" : collapsedHeight }}
        transition={{ duration: 0.7, ease }}
        className="relative overflow-hidden"
      >
        <div className="space-y-5 leading-relaxed whitespace-pre-line text-ink-500">
          {paragraphs.map((p, i) => (
            <p key={i} className={i === 0 ? "text-lg text-ink" : ""}>
              {p}
            </p>
          ))}
        </div>
        {long && !open && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-paper to-transparent" />
        )}
      </motion.div>
      {long && (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="link-line mt-5 pb-1 text-xs font-semibold tracking-[0.18em] uppercase"
        >
          {open ? "Show less" : "Read more"}
        </button>
      )}
    </div>
  );
}
