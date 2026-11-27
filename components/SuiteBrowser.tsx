"use client";

import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { ChevronDown, Info } from "lucide-react";
import { useMemo, useState } from "react";
import { DiamondDivider } from "@/components/Ornament";
import SuiteCard from "@/components/SuiteCard";
import { ease } from "@/components/motion";
import type { Suite } from "@/lib/suites";

type Size = "all" | "1" | "2";
type Sort = "unit" | "price-asc" | "price-desc" | "rating";

const sizes: { id: Size; label: string }[] = [
  { id: "all", label: "All suites" },
  { id: "1", label: "One bedroom" },
  { id: "2", label: "Two bedroom" },
];

export default function SuiteBrowser({
  suites,
  initialGuests,
  hasDates,
  query = "",
}: {
  suites: Suite[];
  initialGuests?: number;
  hasDates: boolean;
  /** The visitor's search, passed on to each suite page. */
  query?: string;
}) {
  const [size, setSize] = useState<Size>(initialGuests && initialGuests > 2 ? "2" : "all");
  const [floor, setFloor] = useState<0 | 2 | 3>(0);
  const [sort, setSort] = useState<Sort>("unit");

  const list = useMemo(() => {
    const out = suites.filter(
      (s) =>
        (size === "all" || String(s.bedrooms) === size) &&
        (!floor || s.floor === floor) &&
        (!initialGuests || s.guests >= initialGuests),
    );
    const by: Record<Sort, (a: Suite, b: Suite) => number> = {
      unit: (a, b) => a.unit.localeCompare(b.unit),
      "price-asc": (a, b) => a.priceFrom - b.priceFrom,
      "price-desc": (a, b) => b.priceFrom - a.priceFrom,
      rating: (a, b) => b.rating * Math.min(b.reviews, 1) - a.rating * Math.min(a.reviews, 1) || b.reviews - a.reviews,
    };
    return [...out].sort(by[sort]);
  }, [suites, size, floor, sort, initialGuests]);

  const groups =
    sort === "unit" && floor === 0 && list.length > 0
      ? ([2, 3] as const)
          .map((f) => ({ floor: f, items: list.filter((s) => s.floor === f) }))
          .filter((g) => g.items.length > 0)
      : null;

  const count = (pred: (s: Suite) => boolean) => suites.filter(pred).length;

  const pill = (active: boolean) =>
    `relative isolate shrink-0 whitespace-nowrap rounded-full px-3.5 py-2 text-xs sm:px-4 font-semibold tracking-[0.12em] uppercase transition-colors ${active ? "text-white" : "text-ink-500 hover:text-ink"}`;

  return (
    <section id="results" className="mx-auto max-w-[1440px] scroll-mt-24 px-5 py-16 sm:px-8 lg:py-24">
      <LayoutGroup>
        <div className="flex flex-col gap-6 border-b border-line pb-8 xl:flex-row xl:items-end xl:justify-between">
          <div className="flex flex-col gap-5 sm:flex-row sm:flex-wrap sm:items-end sm:gap-8">
            {/* Bedrooms */}
            <div>
              <p className="eyebrow mb-2.5 text-ink-500">Bedrooms</p>
              <div className="no-scrollbar flex w-fit max-w-full overflow-x-auto rounded-full border border-line p-1">
                {sizes.map((s) => (
                  <button key={s.id} type="button" onClick={() => setSize(s.id)} className={pill(size === s.id)} aria-pressed={size === s.id}>
                    {size === s.id && (
                      <motion.span layoutId="size-pill" className="absolute inset-0 -z-10 rounded-full bg-ink" transition={{ duration: 0.5, ease }} />
                    )}
                    {s.label}
                    <span className="ml-1.5 opacity-50">
                      {s.id === "all" ? suites.length : count((x) => String(x.bedrooms) === s.id)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            {/* Floor */}
            <div>
              <p className="eyebrow mb-2.5 text-ink-500">Floor</p>
              <div className="no-scrollbar flex w-fit max-w-full overflow-x-auto rounded-full border border-line p-1">
                {([0, 2, 3] as const).map((f) => (
                  <button key={f} type="button" onClick={() => setFloor(f)} className={pill(floor === f)} aria-pressed={floor === f}>
                    {floor === f && (
                      <motion.span layoutId="floor-pill" className="absolute inset-0 -z-10 rounded-full bg-ink" transition={{ duration: 0.5, ease }} />
                    )}
                    {f === 0 ? "Any" : `Floor ${f}`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-end justify-between gap-8">
            <p className="flex items-baseline gap-2 text-sm text-ink-500" aria-live="polite">
              <span className="font-display text-4xl leading-none text-ink">{list.length}</span>
              suite{list.length === 1 ? "" : "s"}
              {initialGuests ? ` for ${initialGuests} guest${initialGuests > 1 ? "s" : ""}` : ""}
            </p>
            <label className="block">
              <span className="eyebrow mb-2.5 block text-ink-500">Sort by</span>
              <span className="relative block">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as Sort)}
                  className="appearance-none rounded-full border border-line bg-transparent py-2.5 pr-10 pl-4 text-sm text-ink transition-colors hover:border-ink focus:border-ink focus:outline-none"
                >
                  <option value="unit">Suite number</option>
                  <option value="price-asc">Price: low to high</option>
                  <option value="price-desc">Price: high to low</option>
                  <option value="rating">Top rated</option>
                </select>
                <ChevronDown size={14} className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-ink-500" />
              </span>
            </label>
          </div>
        </div>
      </LayoutGroup>

      {hasDates && (
        <p className="mt-6 flex items-center gap-3 border-l-2 border-brass-500 bg-bone px-5 py-4 text-sm text-ink-500">
          <Info size={16} className="shrink-0 text-brass-700" />
          Live availability for your dates is coming soon. For now, choose a suite and we&rsquo;ll confirm your dates.
        </p>
      )}

      {/* Sorted by suite number with no floor filter: group under floor headings. */}
      {groups ? (
        <div className="mt-6">
          {groups.map(({ floor: f, items }, gi) => (
            <section key={f} className={gi > 0 ? "mt-24" : "mt-10"}>
              {gi > 0 && (
                <div className="mb-16 h-3">
                  <DiamondDivider />
                </div>
              )}
              <div className="flex items-end justify-between gap-6">
                <div>
                  <p className="eyebrow flex items-center gap-4 text-brass-700">
                    <span className="h-px w-10 bg-brass-500" />
                    Floor {f}
                  </p>
                  <h2 className="mt-4 font-display text-4xl leading-tight sm:text-5xl">
                    {f === 2 ? "The second" : "The third"} <em className="text-brass-500">floor</em>
                  </h2>
                </div>
                <p className="shrink-0 text-sm text-ink-500">
                  <span className="font-display text-2xl text-ink">{items.length}</span> suites
                </p>
              </div>
              <div className="mt-10 grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((suite, i) => (
                  <SuiteCard key={suite.slug} suite={suite} index={i} preload={gi === 0 && i < 3} query={query} />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <motion.div layout className="mt-12 grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {list.map((suite, i) => (
              <motion.div
                key={suite.slug}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.5, ease }}
              >
                <SuiteCard suite={suite} index={i} preload={i < 3} query={query} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {list.length === 0 && (
        <div className="flex flex-col items-center py-24 text-center">
          <span className="h-3 w-3 rotate-45 border border-brass-500" />
          <p className="mt-6 font-display text-3xl">No suites match those filters.</p>
          <button
            type="button"
            onClick={() => {
              setSize("all");
              setFloor(0);
            }}
            className="link-line mt-4 pb-1 text-xs font-semibold tracking-[0.18em] text-brass-700 uppercase"
          >
            Clear filters
          </button>
        </div>
      )}
    </section>
  );
}
