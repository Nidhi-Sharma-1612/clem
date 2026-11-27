"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Minus, Plus, Star, Users } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import DateRangeCalendar from "@/components/DateRangeCalendar";
import { ease } from "@/components/motion";
import { isBefore, nightsBetween, parseISODate } from "@/lib/date";
import { houseRules } from "@/lib/site";
import type { Stay } from "@/lib/stay";
import type { Suite } from "@/lib/suites";

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
          className="mt-1 flex items-baseline gap-2"
        >
          <span className="font-display text-3xl leading-none tabular-nums">{date.getDate()}</span>
          <span className="text-[0.7rem] font-semibold tracking-[0.12em] text-ink-500 uppercase">
            {date.toLocaleDateString("en-US", { month: "short" })}
            <span className="ml-1 font-medium tracking-normal normal-case">{date.toLocaleDateString("en-US", { weekday: "short" })}</span>
          </span>
        </motion.span>
      ) : (
        <motion.span
          key="empty"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="mt-1.5 block font-display text-lg text-ink-500 transition-colors group-hover:text-ink"
        >
          Add date
        </motion.span>
      )}
    </AnimatePresence>
  );
}

/**
 * Phase 1: starts with the dates and guests from the visitor's search (if any);
 * the estimate uses the starting rate and "Book now" does nothing yet.
 * Phase 2 swaps the estimate for a live Hostaway quote and wires "Book now" to checkout.
 */
export default function BookingCard({ suite, initial = {} }: { suite: Suite; initial?: Stay }) {
  // Past check-in dates from an old link are ignored.
  const [checkIn, setCheckIn] = useState<Date | null>(() => {
    const d = initial.checkIn ? parseISODate(initial.checkIn) : null;
    return d && !isBefore(d, new Date()) ? d : null;
  });
  const [checkOut, setCheckOut] = useState<Date | null>(() => (checkIn && initial.checkOut ? parseISODate(initial.checkOut) : null));
  // Never more guests than this suite sleeps.
  const [guests, setGuests] = useState(Math.min(initial.guests ?? 2, suite.guests));
  const [calendar, setCalendar] = useState(false);

  const nights = checkIn && checkOut ? nightsBetween(checkIn, checkOut) : 0;
  const subtotal = suite.priceFrom * nights;

  // Which date field the calendar is filling, for the brass underline.
  const activeField = calendar ? (checkIn && !checkOut ? "out" : "in") : null;
  const dateField =
    "group relative flex flex-col justify-center px-5 py-4 text-left transition-colors duration-300 hover:bg-bone/60";

  return (
    <div id="book" className="scroll-mt-28 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.3)]">
      {/* Header tier */}
      <div className="grain relative bg-ink px-7 py-6 text-white">
        <div className="relative flex items-center justify-between gap-4">
          <p className="flex items-center gap-3">
            <span className="h-2 w-2 rotate-45 bg-brass-300" />
            <span className="font-display text-xl">Reserve Suite {suite.unit}</span>
          </p>
          {suite.reviews > 0 ? (
            <span className="flex items-center gap-1.5 text-sm">
              <Star size={13} fill="currentColor" strokeWidth={0} className="text-brass-300" />
              <span className="font-semibold">{suite.rating.toFixed(1)}</span>
              <span className="text-white/60">({suite.reviews})</span>
            </span>
          ) : (
            <span className="eyebrow text-brass-300">New</span>
          )}
        </div>
        <div className="relative mt-5 flex items-end justify-between gap-4 border-t border-white/15 pt-5">
          <p>
            <span className="text-xs text-white/60">from </span>
            <span className="font-display text-4xl">${suite.priceFrom}</span>
            <span className="text-sm text-white/60"> / night</span>
          </p>
          <AnimatePresence mode="wait" initial={false}>
            {nights > 0 && checkIn && checkOut ? (
              <motion.p
                key="summary"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.3, ease }}
                className="flex items-center gap-1.5 pb-1 text-[0.65rem] font-semibold tracking-[0.14em] whitespace-nowrap uppercase"
              >
                <span className="text-brass-300">{short(checkIn)}</span>
                <ArrowRight size={11} className="text-white/50" />
                <span className="text-brass-300">{short(checkOut)}</span>
                <span className="text-white/40">·</span>
                <span className="text-white/80">
                  {nights} night{nights > 1 ? "s" : ""}
                </span>
              </motion.p>
            ) : (
              <motion.p
                key="hint"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="pb-1 text-xs text-white/55"
              >
                + tax
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Body */}
      <div className="border border-t-0 border-line bg-paper p-4 min-[380px]:p-6 sm:p-7">
        <div className="border border-line">
          <div className="relative grid grid-cols-2 divide-x divide-line">
            <button type="button" onClick={() => setCalendar(true)} aria-expanded={calendar} className={dateField}>
              <span className="eyebrow text-ink-500">Check in</span>
              <DateValue date={checkIn} />
              {activeField === "in" && (
                <motion.span layoutId="booking-active" className="absolute inset-x-5 bottom-0 h-[2px] bg-brass-500" transition={{ duration: 0.45, ease }} />
              )}
            </button>
            <button type="button" onClick={() => setCalendar(true)} aria-expanded={calendar} className={`${dateField} pl-8`}>
              <span className="eyebrow text-ink-500">Check out</span>
              <DateValue date={checkOut} />
              {activeField === "out" && (
                <motion.span layoutId="booking-active" className="absolute inset-x-5 bottom-0 h-[2px] bg-brass-500" transition={{ duration: 0.45, ease }} />
              )}
            </button>

            {/* Seam: arrow, then the nights count */}
            <span className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <AnimatePresence mode="wait" initial={false}>
                {nights > 0 ? (
                  <motion.span
                    key="nights"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={{ duration: 0.35, ease }}
                    className="flex h-10 w-10 flex-col items-center justify-center rounded-full bg-ink text-white ring-4 ring-paper"
                  >
                    <span className="font-display text-sm leading-none">{nights}</span>
                    <span className="text-[0.45rem] font-semibold tracking-[0.14em] uppercase">night{nights > 1 ? "s" : ""}</span>
                  </motion.span>
                ) : (
                  <motion.span
                    key="arrow"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={{ duration: 0.35, ease }}
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-line bg-paper text-ink-500"
                  >
                    <ArrowRight size={12} />
                  </motion.span>
                )}
              </AnimatePresence>
            </span>
          </div>

          {/* Guests */}
          <div className="flex items-center justify-between gap-3 border-t border-line px-4 py-4 min-[380px]:px-5">
            <div className="flex items-center gap-4">
              <span className="hidden h-10 w-10 min-[360px]:flex shrink-0 items-center justify-center rounded-full border border-brass-500/40 text-brass-700">
                <Users size={16} strokeWidth={1.4} />
              </span>
              <span>
                <span className="eyebrow block text-ink-500">Guests</span>
                <span className="mt-0.5 flex items-baseline gap-2">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span
                      key={guests}
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -10, opacity: 0 }}
                      transition={{ duration: 0.3, ease }}
                      className="font-display text-3xl leading-none tabular-nums"
                    >
                      {guests}
                    </motion.span>
                  </AnimatePresence>
                  <span className="text-xs text-ink-500">of {suite.guests} max</span>
                </span>
              </span>
            </div>
            <span className="flex items-center gap-2">
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
                disabled={guests >= suite.guests}
                onClick={() => setGuests((g) => g + 1)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-line transition-colors hover:border-ink hover:bg-ink hover:text-white disabled:pointer-events-none disabled:opacity-30"
              >
                <Plus size={13} />
              </button>
            </span>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {calendar && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.5, ease }}
              className="overflow-hidden"
            >
              <div className="pt-6">
                <DateRangeCalendar
                  singleMonth
                  checkIn={checkIn}
                  checkOut={checkOut}
                  onChange={(a, b) => {
                    setCheckIn(a);
                    setCheckOut(b);
                    if (a && b) setCalendar(false);
                  }}
                  onDone={() => setCalendar(false)}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Estimate */}
        <AnimatePresence initial={false}>
          {nights > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.5, ease }}
              className="overflow-hidden"
            >
              <dl className="mt-6 space-y-3 bg-bone p-5 text-sm">
                <div className="flex justify-between text-ink-500">
                  <dt>
                    ${suite.priceFrom} × {nights} night{nights > 1 ? "s" : ""}
                  </dt>
                  <dd className="tabular-nums">${subtotal.toLocaleString()}</dd>
                </div>
                <div className="flex justify-between text-ink-500">
                  <dt className="flex items-center gap-2">
                    Platform service fee
                    <span className="eyebrow rounded-full bg-paper px-2 py-0.5 text-[0.55rem] text-brass-700">Book direct</span>
                  </dt>
                  <dd className="tabular-nums">$0</dd>
                </div>
                <div className="flex items-baseline justify-between border-t border-line pt-3">
                  <dt className="font-semibold">Estimated subtotal</dt>
                  <dd className="font-display text-2xl tabular-nums">${subtotal.toLocaleString()}</dd>
                </div>
                <p className="text-xs text-ink-500">Final rate, taxes and fees confirmed before you pay.</p>
              </dl>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actions */}
        {/* Booking integration arrives in phase 2; the button is inert until then. */}
        <button
          type="button"
          className="group relative mt-6 flex w-full items-center justify-center gap-3 overflow-hidden bg-brass-300 py-4 text-xs font-semibold tracking-[0.22em] text-ink uppercase transition-colors duration-500 hover:text-white"
        >
          <span className="absolute inset-0 translate-y-full bg-ink transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0" />
          <span className="relative">Book now</span>
          <ArrowRight size={14} className="relative transition-transform duration-500 group-hover:translate-x-1" />
        </button>
        <p className="mt-3 text-center text-xs text-ink-500">
          You won&rsquo;t be charged yet.{" "}
          <Link href="/contact" className="link-line pb-0.5 font-semibold text-ink">
            Ask a question
          </Link>
        </p>

        <ul className="mt-6 space-y-2.5 border-t border-line pt-5 text-xs text-ink-500">
          <li className="flex items-center gap-3">
            <span className="h-1.5 w-1.5 shrink-0 rotate-45 bg-brass-500" /> Best rate guaranteed — no Airbnb fees
          </li>
          <li className="flex items-center gap-3">
            <span className="h-1.5 w-1.5 shrink-0 rotate-45 bg-brass-500" /> {houseRules.cancellation[0]}
          </li>
          <li className="flex items-center gap-3">
            <span className="h-1.5 w-1.5 shrink-0 rotate-45 bg-brass-500" /> Self check-in any time after {houseRules.checkIn}
          </li>
        </ul>
      </div>
    </div>
  );
}
