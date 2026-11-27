"use client";

import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import {
  Accessibility,
  AirVent,
  ArrowUpDown,
  Baby,
  Bath,
  BedDouble,
  Building2,
  CalendarDays,
  Car,
  Check,
  Coffee,
  CookingPot,
  DoorOpen,
  Droplets,
  Fan,
  FireExtinguisher,
  Flame,
  KeyRound,
  Landmark,
  Laptop,
  Microwave,
  Moon,
  Mountain,
  Refrigerator,
  Shirt,
  Siren,
  Snowflake,
  Sofa,
  SprayCan,
  Tv,
  Utensils,
  WashingMachine,
  Wifi,
  Wind,
  type LucideIcon,
} from "lucide-react";
import { useMemo, useState } from "react";
import { ease } from "@/components/motion";

/** Amenity name → icon. First match wins, so specific patterns come first. */
const iconRules: [RegExp, LucideIcon][] = [
  [/wifi|wireless|internet/i, Wifi],
  [/air condition/i, AirVent],
  [/heating/i, Flame],
  [/ceiling fan/i, Fan],
  [/hair dryer/i, Wind],
  [/washing|dryer|laundr/i, WashingMachine],
  [/microwave/i, Microwave],
  [/freezer/i, Snowflake],
  [/refrigerator/i, Refrigerator],
  [/coffee|kettle|tea/i, Coffee],
  [/utensil|dining|dishes/i, Utensils],
  [/kitchen|stove|oven|cooking|toaster/i, CookingPot],
  [/tv|cable/i, Tv],
  [/parking/i, Car],
  [/check-?in|contactless|private entrance/i, KeyRound],
  [/elevator/i, ArrowUpDown],
  [/smoke|carbon/i, Siren],
  [/fire/i, FireExtinguisher],
  [/laptop|workspace/i, Laptop],
  [/iron|hanger|clothing/i, Shirt],
  [/linens|towels|pillow/i, BedDouble],
  [/room darkening/i, Moon],
  [/shampoo|soap|conditioner|gel|hot water/i, Droplets],
  [/shower|tub|toilet|bath/i, Bath],
  [/cleaning/i, SprayCan],
  [/children|infants/i, Baby],
  [/wheelchair|accessib/i, Accessibility],
  [/long term/i, CalendarDays],
  [/living room/i, Sofa],
  [/mountain/i, Mountain],
  [/historic/i, Landmark],
  [/downtown|city view/i, Building2],
  [/entrance/i, DoorOpen],
];

function iconFor(name: string) {
  return iconRules.find(([re]) => re.test(name))?.[1] ?? Check;
}

/** What guests ask about first, in order. Each slot takes its first matching alternative. */
const priority: RegExp[][] = [
  [/wifi speed/i, /free wifi/i, /wireless|internet/i],
  [/air condition/i],
  [/^kitchen$/i],
  [/washing/i],
  [/smart tv/i, /^tv$/i, /cable/i],
  [/laptop/i],
  [/contactless/i, /24-hour/i],
  [/coffee/i],
  [/free parking/i, /private parking/i, /street parking/i],
  [/elevator/i],
  [/heating/i],
];

/** Tab order for Hostaway's categories; anything else follows. */
const categoryOrder = ["Kitchen & dining", "Bathroom", "General", "Safety", "Parking", "Policy", "Location", "Cleanliness"];

export default function Amenities({ groups }: { groups: Record<string, string[]> }) {
  const all = useMemo(() => [...new Set(Object.values(groups).flat())], [groups]);

  const highlights = useMemo(() => {
    const picked: string[] = [];
    for (const alternatives of priority) {
      let hit: string | undefined;
      for (const re of alternatives) {
        hit = all.find((a) => re.test(a) && !picked.includes(a));
        if (hit) break;
      }
      if (hit) picked.push(hit);
      if (picked.length === 9) break;
    }
    return picked;
  }, [all]);

  const tabs = useMemo(() => {
    const cats = Object.keys(groups).sort((a, b) => {
      const ia = categoryOrder.indexOf(a);
      const ib = categoryOrder.indexOf(b);
      return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
    });
    return [{ id: "Highlights", items: highlights }, ...cats.map((c) => ({ id: c, items: groups[c] }))];
  }, [groups, highlights]);

  const [tab, setTab] = useState("Highlights");
  const current = tabs.find((t) => t.id === tab) ?? tabs[0];

  return (
    <div>
      <div className="flex items-end justify-between gap-6">
        <p className="text-sm text-ink-500">
          <span className="font-display text-3xl text-ink">{all.length}</span> amenities in this suite
        </p>
      </div>

      <LayoutGroup>
        <div className="no-scrollbar -mx-5 mt-6 flex gap-1 overflow-x-auto border-b border-line px-5 sm:mx-0 sm:px-0">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              aria-pressed={tab === t.id}
              className={`relative shrink-0 px-3 pt-2 pb-3.5 text-xs font-semibold tracking-[0.12em] whitespace-nowrap uppercase transition-colors ${tab === t.id ? "text-ink" : "text-ink-500 hover:text-ink"}`}
            >
              {t.id === "Highlights" && <span className="mr-2 inline-block h-1.5 w-1.5 rotate-45 bg-brass-500 align-middle" />}
              {t.id}
              <span className="ml-1.5 text-ink-500/70">{t.items.length}</span>
              {tab === t.id && (
                <motion.span layoutId="amenity-tab" className="absolute inset-x-3 -bottom-px h-[2px] bg-brass-500" transition={{ duration: 0.45, ease }} />
              )}
            </button>
          ))}
        </div>
      </LayoutGroup>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={current.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35, ease }}
          className="mt-8"
        >
          {current.id === "Highlights" ? (
            <ul className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {current.items.map((a, i) => {
                const Icon = iconFor(a);
                return (
                  <motion.li
                    key={a}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.04, ease }}
                    className="group flex flex-col gap-4 border border-line bg-paper p-5 transition-colors duration-500 hover:border-brass-500/60"
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-full border border-brass-500/40 text-brass-700 transition-colors duration-500 group-hover:border-ink group-hover:bg-ink group-hover:text-brass-300">
                      <Icon size={18} strokeWidth={1.4} />
                    </span>
                    <span className="text-sm leading-snug font-medium">{a}</span>
                  </motion.li>
                );
              })}
            </ul>
          ) : (
            <ul className="grid gap-x-10 sm:grid-cols-2">
              {current.items.map((a, i) => {
                const Icon = iconFor(a);
                const negative = /not accessible/i.test(a);
                return (
                  <motion.li
                    key={a}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.35, delay: Math.min(i, 12) * 0.025 }}
                    className={`flex items-center gap-4 border-b border-line py-3.5 text-sm ${negative ? "text-ink-500 line-through decoration-ink-500/40" : ""}`}
                  >
                    <Icon size={18} strokeWidth={1.4} className={`shrink-0 ${negative ? "text-ink-500" : "text-brass-700"}`} />
                    {a.trim()}
                  </motion.li>
                );
              })}
            </ul>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
