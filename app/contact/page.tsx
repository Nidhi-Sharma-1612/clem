import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import ContactForm from "@/components/ContactForm";
import DarkHero from "@/components/DarkHero";
import LocationMap from "@/components/map/LocationMap";
import { DiamondDivider } from "@/components/Ornament";
import { Reveal, SplitText } from "@/components/motion";
import { photos } from "@/lib/photos";
import { site } from "@/lib/site";
import { suites } from "@/lib/suites";

export const metadata: Metadata = {
  title: "Contact",
  description: "Questions or need help with your reservation at Historic George Hotel? Our team is happy to assist you.",
};

/** Facts guests most often ask before booking — all from the house rules and listings. */
const quickAnswers = [
  { q: "Check-in & check-out", a: `From ${site.checkIn} · by ${site.checkOut}` },
  { q: "Arrival", a: "24-hour self check-in" },
  { q: "Parking", a: "Street parking nearby" },
  { q: "Laundry", a: "On-site, $2 per load" },
  { q: "Pets", a: "Not allowed" },
  { q: "Smoking", a: "Not allowed inside" },
];

export default async function ContactPage({ searchParams }: PageProps<"/contact">) {
  const sp = await searchParams;
  const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
  const prefill = {
    suite: one(sp.suite),
    checkIn: one(sp.checkIn),
    checkOut: one(sp.checkOut),
    guests: one(sp.guests),
  };

  const details = [
    { icon: Phone, label: "Call us", value: site.phone, href: site.phoneHref },
    { icon: Mail, label: "Email", value: site.email, href: `mailto:${site.email}` },
    { icon: MapPin, label: "Find us", value: site.location },
    { icon: Clock, label: "Check-in / out", value: `${site.checkIn} / ${site.checkOut}` },
  ];

  return (
    <>
      <DarkHero
        compact
        eyebrow="Contact us"
        title={prefill.suite ? "Request your *stay.*" : "We're here to *help.*"}
        intro="Have questions or need help with your reservation? Our team is happy to assist you."
        image={photos.living210}
        imagePosition="50% 70%"
      />

      <section className="mx-auto grid max-w-[1440px] gap-16 px-5 py-20 sm:px-8 lg:grid-cols-12 lg:py-28">
        {/* Details + quick answers */}
        <div className="lg:col-span-5">
          <Reveal>
            <p className="eyebrow flex items-center gap-4 text-brass-700">
              <span className="h-px w-10 bg-brass-500" />
              Get in touch
            </p>
          </Reveal>
          <SplitText
            text="Talk to a *real* person."
            accentClass="text-brass-500"
            className="mt-6 font-display text-4xl leading-[1.05] tracking-tight sm:text-5xl"
          />

          <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {details.map(({ icon: Icon, label, value, href }, i) => {
              const body = (
                <>
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-brass-500/40 text-brass-700 transition-colors duration-500 group-hover:border-ink group-hover:bg-ink group-hover:text-brass-300">
                    <Icon size={17} strokeWidth={1.4} />
                  </span>
                  <span className="min-w-0">
                    <span className="eyebrow block text-ink-500">{label}</span>
                    <span className="mt-1.5 block font-display text-lg leading-snug [overflow-wrap:anywhere]">{value}</span>
                  </span>
                </>
              );
              const card =
                "group flex h-full items-start gap-4 border border-line bg-paper p-5 transition-[border-color,transform] duration-500 hover:-translate-y-0.5 hover:border-brass-500/60";
              return (
                <Reveal key={label} delay={i * 0.06} y={16}>
                  <li className="h-full">
                    {href ? (
                      <a href={href} className={card}>
                        {body}
                      </a>
                    ) : (
                      <div className={card}>{body}</div>
                    )}
                  </li>
                </Reveal>
              );
            })}
          </ul>

          <Reveal delay={0.2} className="mt-12">
            <div className="border border-line bg-bone p-7">
              <p className="eyebrow flex items-center gap-3 text-brass-700">
                <span className="h-1.5 w-1.5 rotate-45 bg-brass-500" />
                Quick answers
              </p>
              <dl className="mt-5 divide-y divide-line">
                {quickAnswers.map(({ q, a }) => (
                  <div key={q} className="flex items-baseline justify-between gap-6 py-3 text-sm">
                    <dt className="text-ink-500">{q}</dt>
                    <dd className="text-right font-medium text-ink">{a}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>
        </div>

        {/* Form */}
        <Reveal delay={0.15} className="lg:col-span-7">
          <ContactForm suites={suites.map((s) => ({ unit: s.unit, title: s.title }))} prefill={prefill} />
        </Reveal>
      </section>

      {/* Map */}
      <section className="mx-auto max-w-[1440px] px-5 pb-24 sm:px-8 lg:pb-32">
        <div className="h-3">
          <DiamondDivider />
        </div>
        <div className="mt-14 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow flex items-center gap-4 text-brass-700">
              <span className="h-px w-10 bg-brass-500" />
              Visit
            </p>
            <SplitText
              text="Downtown on *Main* *Street.*"
              accentClass="text-brass-500"
              className="mt-6 font-display text-4xl leading-tight sm:text-5xl"
            />
          </div>
          <p className="flex items-center gap-2 text-sm text-ink-500">
            <MapPin size={16} className="text-brass-700" /> {site.location}
          </p>
        </div>
        <LocationMap className="mt-10 aspect-[4/3] sm:aspect-[21/9]" />
      </section>
    </>
  );
}
