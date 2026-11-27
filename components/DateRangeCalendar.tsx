"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import {
  addMonths,
  buildMonthGrid,
  formatDisplayDate,
  formatMonthYear,
  isAfter,
  isBefore,
  isSameDay,
  nightsBetween,
  startOfDay,
} from "@/lib/date";

const weekdays = ["S", "M", "T", "W", "T", "F", "S"];

/**
 * Phase 1: every future date is selectable. Phase 2 passes blocked dates from
 * the Hostaway calendar via `isBlocked`.
 */
export default function DateRangeCalendar({
  checkIn,
  checkOut,
  onChange,
  onDone,
  singleMonth = false,
  isBlocked,
}: {
  checkIn: Date | null;
  checkOut: Date | null;
  onChange: (checkIn: Date | null, checkOut: Date | null) => void;
  onDone?: () => void;
  singleMonth?: boolean;
  isBlocked?: (d: Date) => boolean;
}) {
  const today = startOfDay(new Date());
  // Late in the month, open on next month so guests don't land on a page of crossed-out days.
  const [view, setView] = useState(() => {
    if (checkIn) return addMonths(checkIn, 0);
    const daysLeft = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate() - today.getDate();
    return addMonths(today, daysLeft < 7 ? 1 : 0);
  });
  const [hover, setHover] = useState<Date | null>(null);

  function select(d: Date) {
    if (!checkIn || checkOut || !isAfter(d, checkIn)) onChange(d, null);
    else onChange(checkIn, d);
  }

  const rangeEnd = checkOut ?? (checkIn && hover && isAfter(hover, checkIn) ? hover : null);
  const status =
    checkIn && checkOut
      ? `${formatDisplayDate(checkIn)} – ${formatDisplayDate(checkOut)} · ${nightsBetween(checkIn, checkOut)} night${nightsBetween(checkIn, checkOut) > 1 ? "s" : ""}`
      : checkIn
        ? "Select check-out"
        : "Select check-in";

  function month(m: Date) {
    const days = buildMonthGrid(m.getFullYear(), m.getMonth())
      .filter((w) => w.some((d) => d.isCurrentMonth))
      .flat();
    return (
      <div className="flex-1">
        <p className="text-center font-display text-lg">{formatMonthYear(m)}</p>
        <div className="mt-3 grid grid-cols-7 text-center text-[10px] font-semibold tracking-widest text-ink-400">
          {weekdays.map((w, i) => (
            <span key={i}>{w}</span>
          ))}
        </div>
        <div className="mt-2 grid grid-cols-7 gap-y-1">
          {days.map(({ date, isCurrentMonth }, i) => {
            if (!isCurrentMonth) return <span key={i} />;
            const disabled = isBefore(date, today) || !!isBlocked?.(date);
            const isEdge = isSameDay(date, checkIn) || isSameDay(date, rangeEnd);
            const inRange = checkIn && rangeEnd && isAfter(date, checkIn) && isBefore(date, rangeEnd);
            return (
              <button
                key={i}
                type="button"
                disabled={disabled}
                onClick={() => select(date)}
                onMouseEnter={() => setHover(date)}
                aria-label={date.toDateString()}
                aria-pressed={isEdge}
                className={[
                  "h-10 text-sm transition-colors duration-200",
                  isEdge
                    ? "bg-ink font-semibold text-white"
                    : inRange
                      ? "bg-bone text-ink"
                      : disabled
                        ? "cursor-not-allowed text-ink-400/40 line-through"
                        : "text-ink hover:bg-bone",
                ].join(" ")}
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div onMouseLeave={() => setHover(null)}>
      <div className="flex items-center justify-between">
        <button
          type="button"
          aria-label="Previous month"
          disabled={!isAfter(view, today)}
          onClick={() => setView((v) => addMonths(v, -1))}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-line transition-colors hover:border-ink disabled:invisible"
        >
          <ChevronLeft size={16} />
        </button>
        <p className="eyebrow text-brass-700" aria-live="polite">
          {status}
        </p>
        <button
          type="button"
          aria-label="Next month"
          onClick={() => setView((v) => addMonths(v, 1))}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-line transition-colors hover:border-ink"
        >
          <ChevronRight size={16} />
        </button>
      </div>
      <div className={`mt-4 flex gap-8 ${singleMonth ? "" : ""}`}>
        {month(view)}
        {!singleMonth && <div className="hidden flex-1 md:block">{month(addMonths(view, 1))}</div>}
      </div>
      <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
        <button
          type="button"
          onClick={() => onChange(null, null)}
          className="text-xs font-semibold tracking-wider text-ink-500 uppercase underline-offset-4 hover:underline"
        >
          Clear
        </button>
        {onDone && (
          <button
            type="button"
            onClick={onDone}
            className="bg-ink px-6 py-2.5 text-xs font-semibold tracking-[0.18em] text-white uppercase transition-colors hover:bg-brass-700"
          >
            Done
          </button>
        )}
      </div>
    </div>
  );
}
