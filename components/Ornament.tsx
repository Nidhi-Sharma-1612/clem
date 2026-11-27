"use client";

import type { LucideIcon } from "lucide-react";
import { useEffect, useRef } from "react";

/**
 * Traces a Lucide icon's strokes on once `drawn` is true. The dash setup is
 * applied after mount, so without JS the icon simply renders normally.
 * Styles live in globals.css (.draw-icon / .is-drawn).
 */
export function DrawIcon({
  icon: Icon,
  drawn,
  delay = 0,
  size = 22,
}: {
  icon: LucideIcon;
  drawn: boolean;
  delay?: number;
  size?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.querySelectorAll("path, circle, line, rect, polyline").forEach((n) => n.setAttribute("pathLength", "1"));
    el.classList.add("draw-icon");
  }, []);
  // Toggled directly (not via className) so React re-renders don't drop "draw-icon".
  useEffect(() => {
    ref.current?.classList.toggle("is-drawn", drawn);
  }, [drawn]);
  return (
    <span ref={ref} className="inline-flex" style={{ ["--draw-delay" as string]: `${delay}s` }}>
      <Icon size={size} strokeWidth={1.25} />
    </span>
  );
}

/**
 * Art Deco divider: a brass line fading out at both ends with a diamond at its
 * centre. Horizontal by default; `vertical` stands it upright (lg and up only
 * when `responsive` is set — flat below, upright from lg).
 */
export function DiamondDivider({ responsive = false, tone = "brass-500" }: { responsive?: boolean; tone?: "brass-500" | "brass-300" }) {
  const line = tone === "brass-300" ? "to-brass-300/40" : "to-brass-500/50";
  const border = tone === "brass-300" ? "border-brass-300" : "border-brass-500";
  const dot = tone === "brass-300" ? "bg-brass-300" : "bg-brass-500";
  const v = responsive;
  return (
    <span aria-hidden="true" className={`flex h-full w-full items-center justify-center ${v ? "lg:flex-col" : ""}`}>
      <span className={`h-px flex-1 bg-linear-to-r from-transparent ${line} ${v ? "lg:h-auto lg:w-px lg:bg-linear-to-b" : ""}`} />
      <span className={`mx-3 flex h-3 w-3 shrink-0 rotate-45 items-center justify-center border ${border} ${v ? "lg:mx-0 lg:my-3" : ""}`}>
        <span className={`h-1 w-1 ${dot} transition-transform duration-700 group-hover:scale-150`} />
      </span>
      <span className={`h-px flex-1 bg-linear-to-l from-transparent ${line} ${v ? "lg:h-auto lg:w-px lg:bg-linear-to-t" : ""}`} />
    </span>
  );
}
