import Link from "next/link";
import { ArrowRight, Ban, CigaretteOff, Clock, DoorOpen, KeyRound, Users, type LucideIcon } from "lucide-react";
import { Reveal } from "@/components/motion";
import { formatHour, type Suite } from "@/lib/suites";

/** Cancellation steps, from the listing policy (same as the House policies page). */
const cancellation = [
  { value: "100%", label: "refund", when: "Up to 14 days before arrival" },
  { value: "50%", label: "refund", when: "Up to 7 days before arrival" },
  { value: "None", label: "refunded", when: "Within 7 days of arrival" },
];

/** Suite-page "Good to know": arrival times, house rules and cancellation. */
export default function HouseRules({ suite }: { suite: Suite }) {
  const rules: { icon: LucideIcon; title: string; note: string }[] = [
    { icon: Users, title: `Up to ${suite.guests} guests`, note: `${suite.bedrooms} bedroom${suite.bedrooms > 1 ? "s" : ""} · ${suite.beds} bed${suite.beds > 1 ? "s" : ""}` },
    { icon: KeyRound, title: "Self check-in", note: "Arrive whenever suits you" },
    { icon: Ban, title: "No pets", note: "Pets aren’t allowed in the suites" },
    { icon: CigaretteOff, title: "No smoking", note: "Not allowed anywhere inside" },
  ];

  const times = [
    { icon: Clock, label: "Check-in", time: formatHour(suite.checkIn), note: "From", dark: true },
    { icon: DoorOpen, label: "Check-out", time: formatHour(suite.checkOut), note: "By", dark: false },
  ];

  return (
    <div className="mt-10 space-y-10">
      {/* Arrival & departure */}
      <div className="grid gap-3 sm:grid-cols-2">
        {times.map(({ icon: Icon, label, time, note, dark }, i) => (
          <Reveal key={label} delay={i * 0.08} y={16}>
            <div className={`flex items-center justify-between gap-6 p-7 ${dark ? "grain relative bg-ink text-white" : "border border-line bg-bone"}`}>
              <div className="relative">
                <p className={`eyebrow flex items-center gap-2 ${dark ? "text-brass-300" : "text-brass-700"}`}>
                  <span className={`h-1.5 w-1.5 rotate-45 ${dark ? "bg-brass-300" : "bg-brass-500"}`} />
                  {label}
                </p>
                <p className="mt-3 flex items-baseline gap-2">
                  <span className={`text-sm ${dark ? "text-white/60" : "text-ink-500"}`}>{note}</span>
                  <span className="font-display text-4xl leading-none">{time}</span>
                </p>
              </div>
              <span
                className={`relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full border ${dark ? "border-brass-300/40 text-brass-300" : "border-brass-500/40 text-brass-700"}`}
              >
                <Icon size={19} strokeWidth={1.4} />
              </span>
            </div>
          </Reveal>
        ))}
      </div>

      {/* House rules */}
      <div>
        <h3 className="eyebrow flex items-center gap-3 text-ink-500">
          <span className="h-px w-6 bg-brass-500" />
          House rules
        </h3>
        <ul className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
          {rules.map(({ icon: Icon, title, note }, i) => (
            <Reveal key={title} delay={i * 0.06} y={16}>
              <li className="group flex h-full flex-col gap-4 border border-line bg-paper p-5 transition-colors duration-500 hover:border-brass-500/60">
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-brass-500/40 text-brass-700 transition-colors duration-500 group-hover:border-ink group-hover:bg-ink group-hover:text-brass-300">
                  <Icon size={18} strokeWidth={1.4} />
                </span>
                <span>
                  <span className="block text-sm font-semibold">{title}</span>
                  <span className="mt-1 block text-xs text-ink-500">{note}</span>
                </span>
              </li>
            </Reveal>
          ))}
        </ul>
      </div>

      {/* Cancellation */}
      <div>
        <h3 className="eyebrow flex items-center gap-3 text-ink-500">
          <span className="h-px w-6 bg-brass-500" />
          Cancellation
        </h3>
        <ol className="relative mt-5 grid grid-cols-3 gap-2 sm:gap-3">
          <span aria-hidden="true" className="absolute top-[1.15rem] right-[16%] left-[16%] h-px bg-brass-500/40" />
          {cancellation.map((c, i) => (
            <Reveal key={c.value} delay={i * 0.08} y={16}>
              <li className="flex h-full flex-col items-center text-center">
                <span className="relative z-10 flex h-9 w-9 items-center justify-center bg-paper">
                  <span className={`h-3 w-3 rotate-45 ${i === 2 ? "border border-brass-500" : "bg-brass-500"}`} />
                </span>
                <div className="mt-3 w-full flex-1 border border-line bg-paper px-1.5 py-4 min-[400px]:px-2 sm:px-4 sm:py-5">
                  <p className="font-display text-2xl leading-none sm:text-4xl">{c.value}</p>
                  <p className="eyebrow mt-2 text-[0.6rem] text-brass-700 max-[399px]:tracking-[0.08em] sm:text-[0.7rem]">{c.label}</p>
                  <p className="mt-2 text-[0.7rem] leading-snug text-ink-500 sm:mt-3 sm:text-xs">{c.when}</p>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>

      <Link href="/policies" className="group inline-flex items-center gap-3 text-xs font-semibold tracking-[0.2em] uppercase">
        <span className="link-line pb-1">Read all house policies</span>
        <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
      </Link>
    </div>
  );
}
