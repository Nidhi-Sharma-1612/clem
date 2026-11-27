"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, CalendarDays, Clock, Minus, Plus, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import DateRangeCalendar from "@/components/DateRangeCalendar";
import { ease } from "@/components/motion";
import { nightsBetween, parseISODate, toISODate } from "@/lib/date";
import { site } from "@/lib/site";

const MAX_GUESTS = 4;
const short = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });

function DateValue({ date }: { date: Date | null }) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      {date ? (
        <motion.span
          key={date.toDateString()}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3, ease }}
          className="mt-0.5 flex items-baseline gap-2"
        >
          <span className="font-display text-[2rem] leading-none tabular-nums">{date.getDate()}</span>
          <span className="text-xs font-semibold tracking-[0.12em] text-ink-500 uppercase">
            {date.toLocaleDateString("en-US", { month: "short" })}
            <span className="ml-1.5 font-medium tracking-normal normal-case">
              {date.toLocaleDateString("en-US", { weekday: "short" })}
            </span>
          </span>
        </motion.span>
      ) : (
        <motion.span
          key="empty"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="mt-1 block font-display text-xl text-ink-500 transition-colors group-hover:text-ink"
        >
          Add date
        </motion.span>
      )}
    </AnimatePresence>
  );
}

/** Brass underline that glides between whichever field is active. */
function ActiveLine({ show }: { show: boolean }) {
  return show ? (
    <motion.span layoutId="search-active" className="absolute inset-x-5 bottom-0 h-[2px] bg-brass-500" transition={{ duration: 0.45, ease }} />
  ) : null;
}

/** Brass icon ring that fills black while its field is active. */
function IconRing({ icon: Icon, on }: { icon: typeof Users; on: boolean }) {
  return (
    <span
      className={`hidden h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-colors duration-500 sm:flex ${on ? "border-ink bg-ink text-brass-300" : "border-brass-500/40 text-brass-700 group-hover:border-brass-500"}`}
    >
      <Icon size={17} strokeWidth={1.4} />
    </span>
  );
}

/**
 * Availability search. `hero` adds a glass header tier designed to sit over
 * the hero photo while the field row lands on the page below it.
 * Phase 1 filters suites by guests; phase 2 checks live Hostaway availability.
 */
export default function SearchBar({
  initial,
  variant = "inline",
}: {
  initial?: { checkIn?: string; checkOut?: string; guests?: number };
  variant?: "hero" | "inline";
}) {
  const router = useRouter();
  const [checkIn, setCheckIn] = useState<Date | null>(() => (initial?.checkIn ? parseISODate(initial.checkIn) : null));
  const [checkOut, setCheckOut] = useState<Date | null>(() => (initial?.checkOut ? parseISODate(initial.checkOut) : null));
  const [guests, setGuests] = useState(initial?.guests ?? 2);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [focus, setFocus] = useState<"in" | "out" | "guests" | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!calendarOpen) return;
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setCalendarOpen(false);
        setFocus(null);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setCalendarOpen(false);
        setFocus(null);
      }
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [calendarOpen]);

  const nights = checkIn && checkOut ? nightsBetween(checkIn, checkOut) : 0;
  const active = calendarOpen ? (checkIn && !checkOut ? "out" : "in") : focus;

  function openDates(which: "in" | "out") {
    setFocus(which);
    setCalendarOpen(true);
  }

  // Closing the calendar also clears the field highlight, so nothing stays "active".
  function closeCalendar() {
    setCalendarOpen(false);
    setFocus(null);
  }

  function submit() {
    const params = new URLSearchParams();
    if (checkIn) params.set("checkIn", toISODate(checkIn));
    if (checkOut) params.set("checkOut", toISODate(checkOut));
    params.set("guests", String(guests));
    setCalendarOpen(false);
    router.push(`/suites?${params.toString()}#results`);
  }

  const hero = variant === "hero";
  const field =
    "group relative flex flex-1 items-center gap-4 px-5 py-4 text-left transition-colors duration-300 hover:bg-bone/60 sm:min-h-[92px] sm:px-6";

  return (
    <div ref={ref} className="relative">
      {hero && (
        <div className="flex h-16 items-center justify-between gap-6 border border-b-0 border-white/15 bg-ink/55 px-6 text-white backdrop-blur-md">
          <p className="flex items-center gap-3">
            <span className="h-2 w-2 rotate-45 bg-brass-300" />
            <span className="font-display text-xl">Reserve your suite</span>
          </p>
          {/* Live summary once dates are chosen; house times before that. */}
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={nights > 0 ? "summary" : "times"}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3, ease }}
              className="hidden items-center gap-2 text-[0.7rem] font-semibold tracking-[0.16em] whitespace-nowrap text-white/80 uppercase sm:flex"
            >
              {nights > 0 && checkIn && checkOut ? (
                <>
                  <span className="text-brass-300">{short(checkIn)}</span>
                  <ArrowRight size={12} className="text-white/50" />
                  <span className="text-brass-300">{short(checkOut)}</span>
                  <span className="text-white/40">·</span>
                  {nights} night{nights > 1 ? "s" : ""}
                  <span className="text-white/40">·</span>
                  {guests} guest{guests > 1 ? "s" : ""}
                </>
              ) : (
                <>
                  <Clock size={13} className="text-brass-300" /> Check-in {site.checkIn} · Check-out {site.checkOut}
                </>
              )}
            </motion.span>
          </AnimatePresence>
        </div>
      )}

      <div
        className={[
          // Phone: stacked. Tablet and small laptop: dates on top, guests + button below. Wide: one row.
          "flex flex-col bg-paper text-ink sm:grid sm:grid-cols-2 xl:flex xl:flex-row",
          hero ? "shadow-[0_18px_40px_-24px_rgba(0,0,0,0.35)] ring-1 ring-line" : "border border-line",
        ].join(" ")}
      >
        {/* Dates: two fields sharing one calendar; the seam shows an arrow, then the nights count */}
        <div className="relative flex flex-[2] divide-x divide-line border-b border-line sm:col-span-2 xl:border-r xl:border-b-0">
          <button type="button" className={field} onClick={() => openDates("in")} aria-expanded={calendarOpen}>
            <IconRing icon={CalendarDays} on={active === "in"} />
            <span>
              <span className="eyebrow block text-ink-500">Check in</span>
              <DateValue date={checkIn} />
            </span>
            <ActiveLine show={active === "in"} />
          </button>
          <button type="button" className={`${field} sm:pl-14`} onClick={() => openDates("out")} aria-expanded={calendarOpen}>
            <IconRing icon={CalendarDays} on={active === "out"} />
            <span>
              <span className="eyebrow block text-ink-500">Check out</span>
              <DateValue date={checkOut} />
            </span>
            <ActiveLine show={active === "out"} />
          </button>

          <span className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <AnimatePresence mode="wait" initial={false}>
              {nights > 0 ? (
                <motion.span
                  key="nights"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  transition={{ duration: 0.35, ease }}
                  className="flex h-11 w-11 flex-col items-center justify-center rounded-full bg-ink text-white ring-4 ring-paper"
                >
                  <span className="font-display text-base leading-none">{nights}</span>
                  <span className="text-[0.5rem] font-semibold tracking-[0.14em] uppercase">night{nights > 1 ? "s" : ""}</span>
                </motion.span>
              ) : (
                <motion.span
                  key="arrow"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  transition={{ duration: 0.35, ease }}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-line bg-paper text-ink-500"
                >
                  <ArrowRight size={13} />
                </motion.span>
              )}
            </AnimatePresence>
          </span>
        </div>

        {/* Guests: inline stepper */}
        <div
          className="group relative flex flex-1 items-center justify-between gap-4 px-5 py-4 transition-colors duration-300 hover:bg-bone/60 sm:min-h-[92px] sm:px-6"
          onMouseEnter={() => !calendarOpen && setFocus("guests")}
          onMouseLeave={() => !calendarOpen && setFocus(null)}
        >
          <div className="flex items-center gap-4">
            <IconRing icon={Users} on={active === "guests"} />
            <div>
              <span className="eyebrow block text-ink-500">Guests</span>
              <span className="mt-0.5 flex items-baseline gap-2">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={guests}
                    initial={{ y: 12, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -12, opacity: 0 }}
                    transition={{ duration: 0.3, ease }}
                    className="font-display text-[2rem] leading-none tabular-nums"
                  >
                    {guests}
                  </motion.span>
                </AnimatePresence>
                <span className="text-xs font-semibold tracking-[0.12em] text-ink-500 uppercase">guest{guests > 1 ? "s" : ""}</span>
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              aria-label="Fewer guests"
              disabled={guests <= 1}
              onClick={() => setGuests((g) => g - 1)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-line transition-colors hover:border-ink hover:bg-ink hover:text-white disabled:pointer-events-none disabled:opacity-30"
            >
              <Minus size={13} />
            </button>
            <button
              type="button"
              aria-label="More guests"
              disabled={guests >= MAX_GUESTS}
              onClick={() => setGuests((g) => g + 1)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-line transition-colors hover:border-ink hover:bg-ink hover:text-white disabled:pointer-events-none disabled:opacity-30"
            >
              <Plus size={13} />
            </button>
          </div>
          <ActiveLine show={active === "guests"} />
        </div>

        {/* Search: brass by default, ink rises through on hover */}
        <button
          type="button"
          onClick={submit}
          className="group relative flex items-center justify-center gap-3 overflow-hidden bg-brass-300 px-9 py-5 text-xs font-semibold tracking-[0.22em] text-ink uppercase transition-colors duration-500 hover:text-white xl:min-w-[210px]"
        >
          <span className="absolute inset-0 translate-y-full bg-ink transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0" />
          <span className="relative">Search suites</span>
          <span className="relative flex h-8 w-8 items-center justify-center rounded-full border border-ink/25 transition-[transform,border-color] duration-500 group-hover:translate-x-1 group-hover:border-white/40">
            <ArrowRight size={14} />
          </span>
        </button>
      </div>

      <AnimatePresence>
        {calendarOpen && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.35, ease }}
            className="absolute left-0 z-30 mt-2 w-full max-w-2xl bg-paper p-6 text-ink shadow-[0_30px_80px_-20px_rgba(0,0,0,0.35)] ring-1 ring-line"
          >
            <DateRangeCalendar
              checkIn={checkIn}
              checkOut={checkOut}
              onChange={(a, b) => {
                setCheckIn(a);
                setCheckOut(b);
                if (a && b) closeCalendar();
              }}
              onDone={closeCalendar}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
