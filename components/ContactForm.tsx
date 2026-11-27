"use client";

import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  Check,
  ChevronDown,
  Clock,
  Minus,
  Phone,
  Plus,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import DateRangeCalendar from "@/components/DateRangeCalendar";
import { ease } from "@/components/motion";
import { isBefore, nightsBetween, parseISODate, toISODate } from "@/lib/date";
import { site } from "@/lib/site";

type Prefill = {
  suite?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: string;
};

const topics = [
  "Booking enquiry",
  "Question about a suite",
  "Group or long stay",
  "Something else",
] as const;

const input =
  "peer w-full border-b border-line bg-transparent pt-6 pb-3 text-base placeholder-transparent transition-colors focus:outline-none focus-visible:outline-none";
const label =
  "pointer-events-none absolute top-0 left-0 text-[0.7rem] font-semibold tracking-[0.2em] text-ink-500 uppercase transition-all peer-placeholder-shown:top-6 peer-placeholder-shown:text-base peer-placeholder-shown:font-normal peer-placeholder-shown:tracking-normal peer-placeholder-shown:normal-case peer-focus:top-0 peer-focus:text-[0.7rem] peer-focus:font-semibold peer-focus:tracking-[0.2em] peer-focus:text-brass-700 peer-focus:uppercase";

/** Brass line that draws across under a field while it has focus. */
function FocusLine() {
  return (
    <span className="pointer-events-none absolute bottom-0 left-0 h-px w-0 bg-brass-500 transition-[width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] peer-focus:w-full" />
  );
}

function Field({
  name,
  text,
  type = "text",
  required = false,
  autoComplete,
}: {
  name: string;
  text: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <div className="relative">
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={text}
        autoComplete={autoComplete}
        className={input}
      />
      <label htmlFor={name} className={label}>
        {text}
        {required && <span className="text-brass-700"> *</span>}
      </label>
      <FocusLine />
    </div>
  );
}

/** Numbered section heading: 01 · About you */
function Step({ n, title, note }: { n: string; title: string; note?: string }) {
  return (
    <div className="mb-8 flex items-baseline gap-4">
      <span className="font-display text-2xl text-brass-500 italic">{n}</span>
      <span className="eyebrow text-ink">{title}</span>
      {note && <span className="text-xs text-ink-500">{note}</span>}
      <span className="h-px flex-1 self-center bg-line" />
    </div>
  );
}

const fmt = (d: Date) =>
  d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

/**
 * Phase 1: validates and shows a confirmation on the page only.
 * Phase 2: POST to an API route that emails the team / creates a Hostaway inquiry.
 */
export default function ContactForm({
  suites,
  prefill,
}: {
  suites: { unit: string; title: string }[];
  prefill: Prefill;
}) {
  const hasStay = !!(prefill.suite || prefill.checkIn);
  const [sent, setSent] = useState(false);
  const [topic, setTopic] = useState<(typeof topics)[number]>(
    hasStay ? "Booking enquiry" : "Question about a suite",
  );
  const [checkIn, setCheckIn] = useState<Date | null>(() => {
    const d = prefill.checkIn ? parseISODate(prefill.checkIn) : null;
    return d && !isBefore(d, new Date()) ? d : null;
  });
  const [checkOut, setCheckOut] = useState<Date | null>(() =>
    checkIn && prefill.checkOut ? parseISODate(prefill.checkOut) : null,
  );
  const [guests, setGuests] = useState(() =>
    Math.min(Math.max(Number(prefill.guests) || 2, 1), 8),
  );
  const [calendar, setCalendar] = useState(false);
  const [chars, setChars] = useState(0);

  const nights = checkIn && checkOut ? nightsBetween(checkIn, checkOut) : 0;
  const isBooking =
    topic === "Booking enquiry" || topic === "Group or long stay";

  return (
    <AnimatePresence mode="wait">
      {sent ? (
        <motion.div
          key="sent"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease }}
          className="grain relative overflow-hidden bg-ink p-10 text-white sm:p-14"
        >
          <motion.span
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease }}
            className="relative flex h-16 w-16 items-center justify-center rounded-full border border-brass-300 text-brass-300"
          >
            <Check size={24} />
          </motion.span>
          <h2 className="relative mt-8 font-display text-4xl sm:text-5xl">
            Thank <em className="text-brass-300">you.</em>
          </h2>
          <p className="relative mt-4 max-w-md text-white/70">
            {isBooking
              ? "We’ve received your request and will confirm availability and your rate shortly."
              : "Your message is on its way. We’ll get back to you shortly."}
          </p>
          <p className="relative mt-8 flex items-center gap-3 border-t border-white/15 pt-6 text-sm text-white/60">
            <Clock size={14} className="text-brass-300" /> We usually reply
            within a few hours.
          </p>
        </motion.div>
      ) : (
        <motion.div
          key="form"
          exit={{ opacity: 0, y: -10 }}
          className="shadow-[0_30px_60px_-30px_rgba(0,0,0,0.3)]"
        >
          {/* Header */}
          <div className="grain relative bg-ink px-6 py-7 text-white sm:px-10">
            <div className="relative flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="flex items-center gap-3">
                  <span className="h-2 w-2 rotate-45 bg-brass-300" />
                  <span className="font-display text-2xl sm:text-3xl">
                    Send us a message
                  </span>
                </p>
                <p className="mt-2 text-sm text-white/65">
                  Questions about a suite, your stay or the area — we’re happy
                  to help.
                </p>
              </div>
              <p className="flex items-center gap-2 text-[0.65rem] font-semibold tracking-[0.16em] text-white/70 uppercase">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inset-0 animate-ping rounded-full bg-brass-300 opacity-60" />
                  <span className="relative h-2 w-2 rounded-full bg-brass-300" />
                </span>
                Replies within hours
              </p>
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
            className="border border-t-0 border-line bg-paper px-6 py-10 sm:px-10"
          >
            <input type="hidden" name="topic" value={topic} />

            {/* Topic */}
            <fieldset>
              <legend className="eyebrow mb-4 text-ink-500">
                What’s this about?
              </legend>
              <LayoutGroup id="contact-topic">
                <div className="flex flex-wrap gap-2">
                  {topics.map((t) => {
                    const on = topic === t;
                    return (
                      <button
                        key={t}
                        type="button"
                        aria-pressed={on}
                        onClick={() => setTopic(t)}
                        className={`relative isolate rounded-full border px-4 py-2.5 text-xs font-semibold tracking-[0.08em] transition-colors duration-300 ${on ? "border-ink text-white" : "border-line text-ink-500 hover:border-ink hover:text-ink"}`}
                      >
                        {on && (
                          <motion.span
                            layoutId="topic-pill"
                            className="absolute inset-0 -z-10 rounded-full bg-ink"
                            transition={{ duration: 0.45, ease }}
                          />
                        )}
                        {t}
                      </button>
                    );
                  })}
                </div>
              </LayoutGroup>
            </fieldset>

            {/* About you */}
            <div className="mt-12">
              <Step n="01" title="About you" />
              <div className="grid gap-9 sm:grid-cols-2 sm:gap-x-10">
                <Field
                  name="firstName"
                  text="First name"
                  autoComplete="given-name"
                />
                <Field
                  name="lastName"
                  text="Last name"
                  autoComplete="family-name"
                />
                <Field
                  name="email"
                  text="Email"
                  type="email"
                  required
                  autoComplete="email"
                />
                <Field
                  name="phone"
                  text="Phone number"
                  type="tel"
                  required
                  autoComplete="tel"
                />
              </div>
            </div>

            {/* Your stay */}
            <div className="mt-14">
              <Step
                n="02"
                title="Your stay"
                note={isBooking ? undefined : "Optional"}
              />
              <div className="border border-line">
                {/* Suite */}
                <div className="relative border-b border-line px-5 py-4">
                  <label htmlFor="suite" className="eyebrow block text-ink-500">
                    Suite
                  </label>
                  <select
                    id="suite"
                    name="suite"
                    defaultValue={prefill.suite ?? ""}
                    className="mt-1 w-full cursor-pointer appearance-none bg-transparent pr-8 font-display text-lg focus:outline-none sm:text-xl"
                  >
                    <option value="">Any suite</option>
                    {suites.map((s) => (
                      <option key={s.unit} value={s.unit}>
                        Suite {s.unit} · {s.title}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={16}
                    className="pointer-events-none absolute right-5 bottom-5 text-ink-500"
                  />
                </div>

                {/* Dates + guests */}
                <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_auto]">
                  <div className="relative border-b border-line sm:border-r sm:border-b-0">
                    <button
                      type="button"
                      onClick={() => setCalendar((c) => !c)}
                      aria-expanded={calendar}
                      className={`group flex h-full w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-bone/60 ${checkIn ? "pr-14" : ""}`}
                    >
                      <span
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 ${calendar ? "border-ink bg-ink text-brass-300" : "border-brass-500/40 text-brass-700"}`}
                      >
                        <CalendarDays size={16} strokeWidth={1.4} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="eyebrow block text-ink-500">
                          Dates
                        </span>
                        <span className="mt-1 block truncate font-display text-lg sm:text-xl">
                          {checkIn ? (
                            <>
                              {fmt(checkIn)}
                              <span className="mx-2 text-ink-500">→</span>
                              {checkOut ? (
                                fmt(checkOut)
                              ) : (
                                <span className="text-ink-500">Check-out</span>
                              )}
                            </>
                          ) : (
                            <span className="text-ink-500 transition-colors group-hover:text-ink">
                              Add dates
                            </span>
                          )}
                        </span>
                        {/* Phones: nights under the dates. Wider: a pill to the right. */}
                        {nights > 0 && (
                          <span className="eyebrow mt-1 block text-[0.6rem] text-brass-700 sm:hidden">
                            {nights} night{nights > 1 ? "s" : ""}
                          </span>
                        )}
                      </span>
                      {nights > 0 && (
                        <span className="eyebrow hidden shrink-0 sm:inline-flex rounded-full bg-ink px-3 py-1.5 text-[0.6rem] text-white">
                          {nights} night{nights > 1 ? "s" : ""}
                        </span>
                      )}
                    </button>
                    {checkIn && (
                      <button
                        type="button"
                        aria-label="Clear dates"
                        onClick={() => {
                          setCheckIn(null);
                          setCheckOut(null);
                        }}
                        className="absolute top-1/2 right-4 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-ink-500 hover:bg-bone hover:text-ink"
                      >
                        <X size={13} />
                      </button>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-5 px-5 py-4">
                    <span className="flex items-center gap-4">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-brass-500/40 text-brass-700">
                        <Users size={16} strokeWidth={1.4} />
                      </span>
                      <span>
                        <span className="eyebrow block text-ink-500">
                          Guests
                        </span>
                        <span className="mt-1 block font-display text-xl tabular-nums">
                          {guests}
                        </span>
                      </span>
                    </span>
                    <span className="flex items-center gap-2">
                      {[
                        {
                          icon: Minus,
                          label: "Fewer guests",
                          off: guests <= 1,
                          d: -1,
                        },
                        {
                          icon: Plus,
                          label: "More guests",
                          off: guests >= 8,
                          d: 1,
                        },
                      ].map(({ icon: Icon, label: l, off, d }) => (
                        <button
                          key={l}
                          type="button"
                          aria-label={l}
                          disabled={off}
                          onClick={() => setGuests((g) => g + d)}
                          className="flex h-9 w-9 items-center justify-center rounded-full border border-line transition-colors hover:border-ink hover:bg-ink hover:text-white disabled:pointer-events-none disabled:opacity-30"
                        >
                          <Icon size={13} />
                        </button>
                      ))}
                    </span>
                  </div>
                </div>
              </div>

              <input
                type="hidden"
                name="checkIn"
                value={checkIn ? toISODate(checkIn) : ""}
              />
              <input
                type="hidden"
                name="checkOut"
                value={checkOut ? toISODate(checkOut) : ""}
              />
              <input type="hidden" name="guests" value={guests} />

              <AnimatePresence initial={false}>
                {calendar && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.5, ease }}
                    className="overflow-hidden"
                  >
                    <div className="border border-t-0 border-line p-5 sm:p-6">
                      <DateRangeCalendar
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
            </div>

            {/* Message */}
            <div className="mt-14">
              <Step n="03" title="Your message" />
              <div className="relative">
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  maxLength={1000}
                  placeholder="Message"
                  onChange={(e) => setChars(e.target.value.length)}
                  className={`${input} resize-none`}
                />
                <label htmlFor="message" className={label}>
                  How can we help?<span className="text-brass-700"> *</span>
                </label>
                <FocusLine />
                <span className="absolute right-0 -bottom-6 text-[0.65rem] text-ink-500 tabular-nums">
                  {chars}/1000
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-14 flex flex-col gap-6 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="submit"
                className="group relative flex items-center justify-center gap-3 overflow-hidden bg-brass-300 px-10 py-5 text-xs font-semibold tracking-[0.22em] text-ink uppercase transition-colors duration-500 hover:text-white"
              >
                <span className="absolute inset-0 translate-y-full bg-ink transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0" />
                <span className="relative">
                  {isBooking ? "Send booking request" : "Send message"}
                </span>
                <ArrowRight
                  size={14}
                  className="relative transition-transform duration-500 group-hover:translate-x-1"
                />
              </button>
              <a
                href={site.phoneHref}
                className="group flex items-center gap-3 text-sm text-ink-500 hover:text-ink"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-brass-500/40 text-brass-700 transition-colors duration-500 group-hover:border-ink group-hover:bg-ink group-hover:text-brass-300">
                  <Phone size={15} />
                </span>
                <span>
                  <span className="eyebrow block text-ink-500">
                    Prefer to talk?
                  </span>
                  <span className="font-medium text-ink">{site.phone}</span>
                </span>
              </a>
            </div>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
