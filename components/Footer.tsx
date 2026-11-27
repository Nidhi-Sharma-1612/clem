import Link from "next/link";
import { ArrowUp, Clock, Mail, MapPin, Phone, Star } from "lucide-react";
import Logo from "@/components/Logo";
import { DiamondDivider } from "@/components/Ornament";
import { navLinks, site } from "@/lib/site";
import { averageRating, totalReviews } from "@/lib/suites";

const directions = `https://www.google.com/maps/dir/?api=1&destination=${site.coords.lat},${site.coords.lng}`;

/** Brass-ruled column label, as used across the site. */
function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="eyebrow flex items-center gap-3 text-brass-300">
      <span className="h-px w-6 bg-brass-300" />
      {children}
    </p>
  );
}

export default function Footer() {
  const contact = [
    { icon: Phone, label: site.phone, href: site.phoneHref },
    { icon: Mail, label: site.email, href: `mailto:${site.email}` },
    { icon: MapPin, label: site.location, href: directions, external: true, note: "Directions" },
    { icon: Clock, label: `Check-in ${site.checkIn} · Check-out ${site.checkOut}` },
  ];
  const links = [...navLinks, { href: "/policies", label: "House policies" }];

  return (
    <footer className="grain relative overflow-hidden bg-ink text-white">
      <div className="relative mx-auto max-w-[1440px] px-5 pt-20 pb-8 sm:px-8 lg:pt-24">
        <div className="grid gap-14 md:grid-cols-12 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-5">
            <Link href="/" aria-label={`${site.name} home`} className="inline-block">
              <Logo tone="light" className="h-24" />
            </Link>
            <p className="mt-8 max-w-xs font-display text-xl leading-snug text-white/85">
              Boutique suites in a restored 1930s landmark, in the heart of downtown Klamath Falls.
            </p>
            <p className="mt-5 flex items-center gap-2 text-sm text-white/65">
              <span className="flex gap-0.5 text-brass-300">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={12} fill="currentColor" strokeWidth={0} />
                ))}
              </span>
              <span className="font-semibold text-white">{averageRating}</span> · {totalReviews} guest reviews
            </p>
          </div>

          {/* Explore */}
          <nav aria-label="Footer" className="md:col-span-3">
            <Label>Explore</Label>
            <ul className="mt-7 space-y-3.5">
              {links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="group relative inline-flex items-center text-white/75 transition-[color,transform] duration-300 hover:translate-x-3 hover:text-brass-300"
                  >
                    {/* Diamond sits outside the text so links stay aligned with the label */}
                    <span className="absolute top-1/2 -left-4 h-1.5 w-1.5 -translate-y-1/2 rotate-45 bg-brass-300 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Visit */}
          <div className="md:col-span-4">
            <Label>Visit</Label>
            <ul className="mt-7 space-y-4 text-white/80">
              {contact.map(({ icon: Icon, label, href, external, note }) => {
                const ring = (
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-brass-300/40 text-brass-300 transition-colors duration-300 group-hover:border-brass-300 group-hover:bg-brass-300 group-hover:text-ink">
                    <Icon size={14} strokeWidth={1.5} />
                  </span>
                );
                return (
                  <li key={label}>
                    {href ? (
                      <a
                        href={href}
                        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        className="group flex items-center gap-4 transition-colors hover:text-white"
                      >
                        {ring}
                        <span className="min-w-0 [overflow-wrap:anywhere]">
                          {label}
                          {note && <span className="eyebrow ml-3 text-brass-300">{note} ↗</span>}
                        </span>
                      </a>
                    ) : (
                      <span className="group flex items-center gap-4 text-white/60">
                        {ring}
                        {label}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="mt-20 h-3">
          <DiamondDivider tone="brass-300" />
        </div>

        <div className="mt-8 flex flex-col gap-4 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span>
              © {new Date().getFullYear()} {site.name}
            </span>
            <span className="h-1 w-1 rotate-45 bg-white/30" />
            <span>
              Designed and developed by{" "}
              <a
                href="https://designbydial.com"
                target="_blank"
                rel="noopener noreferrer"
                className="link-line pb-0.5 text-white/80 transition-colors hover:text-brass-300"
              >
                designbydial
              </a>
            </span>
          </p>
          <a href="#top" className="group inline-flex items-center gap-3 self-start text-white/70 transition-colors hover:text-white sm:self-auto">
            <span className="eyebrow">Back to top</span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 transition-colors duration-300 group-hover:border-brass-300 group-hover:bg-brass-300 group-hover:text-ink">
              <ArrowUp size={14} />
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}
