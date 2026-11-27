import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Ban,
  Building2,
  Car,
  CigaretteOff,
  Clock,
  DoorOpen,
  KeyRound,
  Phone,
  Sunrise,
  Users,
  WashingMachine,
  type LucideIcon,
} from "lucide-react";
import DarkHero from "@/components/DarkHero";
import SectionNav from "@/components/policies/SectionNav";
import { DiamondDivider } from "@/components/Ornament";
import { Reveal, SplitText } from "@/components/motion";
import { photos } from "@/lib/photos";
import { houseRules, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "House Policies",
  description: "Check-in, check-out, cancellation and house rules at Historic George Hotel.",
};

type Item = { icon: LucideIcon; text: string };

const arrival: Item[] = [
  { icon: Clock, text: `Check-in from ${houseRules.checkIn}` },
  { icon: DoorOpen, text: `Check-out by ${houseRules.checkOut}` },
  { icon: KeyRound, text: "24-hour self check-in" },
  { icon: Sunrise, text: "Free early check-in when available" },
];

const rules: Item[] = [
  { icon: Ban, text: "No pets" },
  { icon: CigaretteOff, text: "No smoking inside" },
  { icon: Users, text: "Most suites sleep two; two-bedroom suites sleep four" },
  { icon: WashingMachine, text: "On-site laundry, $2 per load" },
];

const building: Item[] = [
  { icon: Building2, text: "A professionally managed building with a mix of long-term residents and short-term guests" },
  { icon: Car, text: "Street parking is available nearby" },
];

/** Cancellation steps, from the listing policy. */
const cancellation = [
  { value: "100%", label: "refund", when: "Up to 14 days before arrival" },
  { value: "50%", label: "refund", when: "Up to 7 days before arrival" },
  { value: "None", label: "refunded", when: "Within 7 days of arrival" },
];

const sections = [
  { id: "arrival", label: "Arrival & departure" },
  { id: "rules", label: "House rules" },
  { id: "cancellation", label: "Cancellation" },
  { id: "building", label: "The building" },
];

function Heading({ n, eyebrow, title }: { n: number; eyebrow: string; title: string }) {
  return (
    <div>
      <Reveal>
        <p className="eyebrow flex items-center gap-4 text-brass-700">
          <span className="font-sans tabular-nums">0{n}</span>
          <span className="h-px w-10 bg-brass-500" />
          {eyebrow}
        </p>
      </Reveal>
      <SplitText text={title} accentClass="text-brass-500" className="mt-5 font-display text-4xl leading-tight tracking-tight sm:text-5xl" />
    </div>
  );
}

function ItemList({ items }: { items: Item[] }) {
  return (
    <ul className="mt-10 grid gap-3 sm:grid-cols-2">
      {items.map(({ icon: Icon, text }, i) => (
        <Reveal key={text} delay={i * 0.06} y={16}>
          <li className="group flex h-full items-center gap-4 border border-line bg-paper p-5 transition-colors duration-500 hover:border-brass-500/60">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-brass-500/40 text-brass-700 transition-colors duration-500 group-hover:border-ink group-hover:bg-ink group-hover:text-brass-300">
              <Icon size={17} strokeWidth={1.4} />
            </span>
            <span className="leading-snug">{text}</span>
          </li>
        </Reveal>
      ))}
    </ul>
  );
}

export default function PoliciesPage() {
  return (
    <>
      <DarkHero
        compact
        eyebrow="Good to know"
        title="House *policies.*"
        intro={`Everything you need to know before your stay at ${site.name} — arrival, house rules and cancellation.`}
        image={photos.bedroom208}
        imagePosition="50% 70%"
      />

      <div className="mx-auto grid max-w-[1440px] gap-16 px-5 py-20 sm:px-8 lg:grid-cols-12 lg:py-28">
        <aside className="hidden lg:col-span-3 lg:block">
          <SectionNav items={sections} />
        </aside>

        <div className="space-y-24 lg:col-span-8 lg:col-start-5">
          <section id="arrival" className="scroll-mt-28">
            <Heading n={1} eyebrow="Arrival & departure" title="Come and go with *ease.*" />
            <ItemList items={arrival} />
          </section>

          <div className="h-3">
            <DiamondDivider />
          </div>

          <section id="rules" className="scroll-mt-28">
            <Heading n={2} eyebrow="House rules" title="A few simple *rules.*" />
            <ItemList items={rules} />
          </section>

          <div className="h-3">
            <DiamondDivider />
          </div>

          <section id="cancellation" className="scroll-mt-28">
            <Heading n={3} eyebrow="Cancellation" title="Flexible when plans *change.*" />
            <ol className="relative mt-12 grid gap-4 sm:grid-cols-3">
              {/* Timeline rule behind the steps */}
              <span aria-hidden="true" className="absolute top-[1.15rem] right-[16%] left-[16%] hidden h-px bg-brass-500/40 sm:block" />
              {cancellation.map((c, i) => (
                <Reveal key={c.value} delay={i * 0.1} y={16}>
                  <li className="flex h-full flex-col items-center text-center">
                    <span className="relative z-10 flex h-9 w-9 items-center justify-center bg-paper">
                      <span className={`h-3 w-3 rotate-45 ${i === 2 ? "border border-brass-500" : "bg-brass-500"}`} />
                    </span>
                    <div className="mt-4 w-full flex-1 border border-line bg-paper p-6">
                      <p className="font-display text-5xl leading-none">{c.value}</p>
                      <p className="eyebrow mt-2 text-brass-700">{c.label}</p>
                      <p className="mt-4 text-sm text-ink-500">{c.when}</p>
                    </div>
                  </li>
                </Reveal>
              ))}
            </ol>
          </section>

          <div className="h-3">
            <DiamondDivider />
          </div>

          <section id="building" className="scroll-mt-28">
            <Heading n={4} eyebrow="The building" title="Life at *The* *George.*" />
            <ItemList items={building} />
          </section>

          {/* Help card */}
          <Reveal>
            <div className="grain relative overflow-hidden bg-ink p-8 text-white sm:p-12">
              <div className="relative flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="eyebrow flex items-center gap-3 text-brass-300">
                    <span className="h-1.5 w-1.5 rotate-45 bg-brass-300" />
                    Still have a question?
                  </p>
                  <p className="mt-4 max-w-md font-display text-3xl leading-snug">
                    Our team is happy to <em className="text-brass-300">help.</em>
                  </p>
                </div>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <Link
                    href="/contact"
                    className="group relative inline-flex items-center justify-center gap-3 overflow-hidden bg-white px-8 py-4 text-xs font-semibold tracking-[0.2em] text-ink uppercase"
                  >
                    <span className="absolute inset-0 translate-y-full bg-brass-300 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0" />
                    <span className="relative">Contact us</span>
                    <ArrowRight size={14} className="relative transition-transform duration-500 group-hover:translate-x-1" />
                  </Link>
                  <a href={site.phoneHref} className="flex items-center gap-2 text-sm text-white/75 hover:text-brass-300">
                    <Phone size={15} className="text-brass-300" /> {site.phone}
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </>
  );
}
