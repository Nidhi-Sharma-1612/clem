"use client";

import { useEffect, useState } from "react";

/**
 * Fixed "Reserve" bar for phones. Slides away while the booking card or the
 * footer is on screen, so it never covers the card it points to or the footer.
 */
export default function MobileBookBar({ price }: { price: number }) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const targets = [document.getElementById("book"), document.querySelector("footer")].filter(
      (el): el is HTMLElement => !!el,
    );
    const visible = new Set<Element>();
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) visible.add(e.target);
        else visible.delete(e.target);
      }
      setHidden(visible.size > 0);
    });
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  return (
    <div
      aria-hidden={hidden}
      className={`fixed inset-x-0 bottom-0 z-40 flex items-center justify-between border-t border-white/10 bg-ink/95 px-5 py-4 text-white backdrop-blur transition-transform duration-500 lg:hidden ${hidden ? "translate-y-full" : "translate-y-0"}`}
    >
      <p>
        <span className="text-xs text-white/60">from </span>
        <span className="font-display text-2xl">${price}</span>
        <span className="text-xs text-white/60"> / night</span>
      </p>
      <a href="#book" tabIndex={hidden ? -1 : undefined} className="bg-white px-7 py-3.5 text-xs font-semibold tracking-[0.18em] text-ink uppercase">
        Reserve
      </a>
    </div>
  );
}
