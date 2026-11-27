import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Bath, BedDouble, Building2, Star, Users } from "lucide-react";
import SuiteCard from "@/components/SuiteCard";
import { DiamondDivider } from "@/components/Ornament";
import { Reveal, SplitText } from "@/components/motion";
import Amenities from "@/components/suite/Amenities";
import BookingCard from "@/components/suite/BookingCard";
import MobileBookBar from "@/components/suite/MobileBookBar";
import ExpandableText from "@/components/suite/ExpandableText";
import HouseRules from "@/components/suite/HouseRules";
import SuiteLocation from "@/components/suite/SuiteLocation";
import SuitePhotos from "@/components/suite/SuitePhotos";
import { getSuite, relatedSuites, suites } from "@/lib/suites";
import { parseStay, stayQuery } from "@/lib/stay";

/** Brass-ruled section label used throughout the site. */
function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="eyebrow flex items-center gap-4 text-brass-700">
      <span className="h-px w-10 bg-brass-500" />
      {children}
    </p>
  );
}

export function generateStaticParams() {
  return suites.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/suites/[slug]">): Promise<Metadata> {
  const suite = getSuite((await params).slug);
  if (!suite) return {};
  return {
    title: `Suite ${suite.unit} — ${suite.title}`,
    description: `${suite.tagline}. ${suite.bedrooms}-bedroom suite for up to ${suite.guests} guests at The George, downtown Klamath Falls.`,
    openGraph: { images: [{ url: suite.images[0] }] },
  };
}

export default async function SuitePage({ params, searchParams }: PageProps<"/suites/[slug]">) {
  const suite = getSuite((await params).slug);
  if (!suite) notFound();
  // Dates and guests searched for earlier, so the booking card starts filled in.
  const stay = parseStay(await searchParams);

  const related = relatedSuites(suite);

  const specs = [
    { icon: Users, value: suite.guests, label: suite.guests > 1 ? "Guests" : "Guest" },
    { icon: BedDouble, value: suite.bedrooms, label: suite.bedrooms > 1 ? "Bedrooms" : "Bedroom" },
    { icon: Bath, value: suite.bathrooms, label: suite.bathrooms > 1 ? "Bathrooms" : "Bathroom" },
    { icon: Building2, value: suite.floor, label: "Floor" },
  ];

  // Last word of the title becomes the italic brass accent, as in the site's other headings.
  const words = suite.title.split(" ");
  const accentTitle = words.length > 1 ? `${words.slice(0, -1).join(" ")} *${words.at(-1)}*` : suite.title;


  return (
    <>
      <div className="mx-auto max-w-[1440px] px-5 pt-28 sm:px-8 lg:pt-32">
        <Link
          href="/suites"
          className="group mb-6 inline-flex items-center gap-2 text-xs font-semibold tracking-[0.18em] text-ink-500 uppercase hover:text-ink"
        >
          <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" /> All suites
        </Link>
        <SuitePhotos suite={suite} />
      </div>

      <div className="mx-auto grid max-w-[1440px] gap-16 px-5 py-16 sm:px-8 lg:grid-cols-12 lg:py-24">
        <div className="min-w-0 lg:col-span-7">
          {/* Title */}
          <Reveal>
            <Eyebrow>
              Suite {suite.unit} · {suite.type}
            </Eyebrow>
          </Reveal>
          <SplitText
            as="h1"
            immediate
            delay={0.1}
            text={accentTitle}
            accentClass="text-brass-500"
            className="mt-6 font-display text-5xl leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl"
          />
          <Reveal delay={0.2}>
            <p className="mt-5 text-lg text-ink-500">{suite.tagline}</p>
            {suite.reviews > 0 ? (
              <p className="mt-5 flex items-center gap-2 text-sm text-ink-500">
                <span className="flex gap-0.5 text-brass-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={13} fill="currentColor" strokeWidth={0} />
                  ))}
                </span>
                <span className="font-semibold text-ink">{suite.rating.toFixed(1)}</span>· {suite.reviews} guest review
                {suite.reviews > 1 ? "s" : ""}
              </p>
            ) : (
              <p className="eyebrow mt-5 flex items-center gap-2 text-brass-700">
                <span className="h-1.5 w-1.5 rotate-45 bg-brass-500" />
                New at The George
              </p>
            )}
          </Reveal>

          {/* Specs */}
          <Reveal delay={0.25}>
            <ul className="mt-12 grid grid-cols-2 gap-px border border-line bg-line sm:grid-cols-4">
              {specs.map(({ icon: Icon, value, label }) => (
                <li key={label} className="flex flex-col items-start gap-4 bg-paper px-5 py-6">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-brass-500/40 text-brass-700">
                    <Icon size={18} strokeWidth={1.3} />
                  </span>
                  <span>
                    <span className="block font-display text-3xl leading-none">{value}</span>
                    <span className="eyebrow mt-1.5 block text-ink-500">{label}</span>
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>

          {/* About */}
          <section className="mt-20">
            <Eyebrow>About this suite</Eyebrow>
            <div className="mt-8">
              <ExpandableText text={suite.description} />
            </div>
          </section>

          {/* Amenities */}
          <section className="mt-20">
            <div className="h-3">
              <DiamondDivider />
            </div>
            <div className="mt-14">
              <Eyebrow>Amenities</Eyebrow>
              <SplitText
                text="What this suite *offers.*"
                accentClass="text-brass-500"
                className="mt-5 font-display text-4xl leading-tight sm:text-5xl"
              />
            </div>
            <div className="mt-10">
              <Amenities groups={suite.amenities} />
            </div>
          </section>

          {/* Good to know */}
          <section className="mt-20">
            <div className="h-3">
              <DiamondDivider />
            </div>
            <div className="mt-14">
              <Eyebrow>Policies</Eyebrow>
              <SplitText text="Good to *know.*" accentClass="text-brass-500" className="mt-5 font-display text-4xl leading-tight sm:text-5xl" />
            </div>
            <HouseRules suite={suite} />
          </section>

          {/* Map */}
          <section className="mt-20">
            <div className="h-3">
              <DiamondDivider />
            </div>
            <div className="mt-14">
              <Eyebrow>Location</Eyebrow>
              <SplitText text="Where you'll *be.*" accentClass="text-brass-500" className="mt-5 font-display text-4xl leading-tight sm:text-5xl" />
              <p className="mt-4 max-w-lg text-ink-500">
                Downtown Klamath Falls, Oregon — steps from Main Street, Klamath Commons Park and the Amtrak station.
              </p>
            </div>
            <SuiteLocation lat={suite.lat} lng={suite.lng} />
          </section>
        </div>

        <aside className="min-w-0 lg:col-span-5 lg:pl-8">
          <div className="lg:sticky lg:top-28">
            <BookingCard suite={suite} initial={stay} />
          </div>
        </aside>
      </div>

      <section className="bg-bone py-24 lg:py-32">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <Eyebrow>More suites</Eyebrow>
              <SplitText
                text="You may also *like.*"
                accentClass="text-brass-500"
                className="mt-5 font-display text-4xl leading-tight sm:text-5xl"
              />
            </div>
            <Link
              href="/suites"
              className="group relative inline-flex items-center gap-3 self-start overflow-hidden border border-ink px-7 py-3.5 text-xs font-semibold tracking-[0.2em] uppercase transition-colors duration-500 hover:text-white sm:self-auto"
            >
              <span className="absolute inset-0 translate-y-full bg-ink transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0" />
              <span className="relative">View all suites</span>
            </Link>
          </div>
          {/* Phones: swipeable row. Tablet and up: grid. */}
          <div className="no-scrollbar -mx-5 mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-px-5 px-5 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-x-8 sm:gap-y-14 sm:overflow-visible sm:px-0 lg:grid-cols-3">
            {related.map(({ suite: s, reason }, i) => (
              <div key={s.slug} className="w-[80vw] max-w-sm shrink-0 snap-start sm:w-auto sm:max-w-none">
                {/* Why this suite is suggested */}
                <p className="eyebrow mb-4 flex items-center gap-2 text-brass-700">
                  <span className="h-1.5 w-1.5 rotate-45 bg-brass-500" />
                  {reason}
                </p>
                <SuiteCard suite={s} index={i} query={stayQuery(stay)} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <MobileBookBar price={suite.priceFrom} />
    </>
  );
}
