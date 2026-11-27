"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { ArrowUpRight, Clock, Mail, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import Logo from "@/components/Logo";
import { DiamondDivider } from "@/components/Ornament";
import { ease } from "@/components/motion";
import { navLinks, site } from "@/lib/site";

/** Pages that open on a full-bleed dark hero, where the bar starts transparent. */
const darkHeroPaths = ["/", "/about", "/explore", "/suites", "/gallery", "/contact", "/policies"];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();

  // Hide on the way down, reveal on the way up.
  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 40);
    setHidden(y > 300 && y > prev && !open);
  });

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Close the menu whenever the route changes.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  const overHero = darkHeroPaths.includes(pathname) && !scrolled && !open;
  const light = overHero || open;

  return (
    <>
      <motion.header
        animate={{ y: hidden ? "-100%" : "0%" }}
        transition={{ duration: 0.5, ease }}
        className={[
          "fixed inset-x-0 top-0 z-50 transition-colors duration-500",
          open ? "bg-transparent" : overHero ? "bg-transparent" : "border-b border-line bg-paper/90 backdrop-blur-md",
        ].join(" ")}
      >
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute inset-x-0 top-0 h-36 bg-linear-to-b from-ink/55 to-transparent transition-opacity duration-500 ${overHero ? "opacity-100" : "opacity-0"}`}
        />
        <div
          className={[
            "relative mx-auto flex max-w-[1440px] items-center justify-between px-5 transition-[height] duration-500 sm:px-8",
            overHero ? "h-24" : "h-20",
            light ? "text-white" : "text-ink",
          ].join(" ")}
        >
          <Link href="/" aria-label={`${site.name} home`} className="relative z-10">
            <Logo
              tone="auto"
              onDark={light}
              preload
              className={`transition-[height] duration-500 ${overHero ? "h-[4.25rem]" : "h-14"}`}
            />
          </Link>

          <nav aria-label="Main" className="absolute top-1/2 left-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-7 whitespace-nowrap lg:flex xl:gap-9">
            {navLinks.map((link) => {
              const active = pathname.startsWith(link.href);
              const accent = light ? "text-brass-300" : "text-brass-700";
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`relative py-2 text-[0.8rem] font-medium tracking-[0.12em] uppercase transition-colors duration-300 ${active ? accent : light ? "hover:text-brass-300" : "hover:text-brass-700"}`}
                >
                  {link.label}
                  {active && (
                    <motion.span
                      layoutId="nav-active"
                      className={`absolute -bottom-1.5 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rotate-45 ${light ? "bg-brass-300" : "bg-brass-500"}`}
                      transition={{ duration: 0.5, ease }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/suites"
              className="group relative hidden items-center gap-2 overflow-hidden bg-brass-300 px-6 py-3 text-[0.75rem] font-semibold tracking-[0.18em] text-ink uppercase transition-colors duration-500 hover:text-white sm:flex"
            >
              <span className="absolute inset-0 translate-y-full bg-ink transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0" />
              <span className="relative">Book Direct</span>
              <ArrowUpRight size={14} className="relative transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="site-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="relative z-10 flex h-11 w-11 flex-col items-center justify-center gap-1.5 lg:hidden"
            >
              <motion.span
                animate={open ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }}
                className="block h-px w-6 bg-current"
              />
              <motion.span
                animate={open ? { rotate: -45, y: -3 } : { rotate: 0, y: 0 }}
                className="block h-px w-6 bg-current"
              />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="site-menu"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.8, ease }}
            className="grain fixed inset-0 z-40 flex h-[100dvh] flex-col overflow-y-auto bg-ink px-6 pt-28 pb-8 text-white lg:hidden"
          >
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25, ease }}
              className="eyebrow relative flex items-center gap-4 text-brass-300"
            >
              <span className="h-px w-10 bg-brass-300" />
              Menu
            </motion.p>

            <nav aria-label="Mobile" className="relative mt-6">
              <ul className="border-t border-white/10">
                {[{ href: "/", label: "Home" }, ...navLinks].map((link, i) => {
                  const current = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
                  return (
                    <li key={link.href} className="overflow-hidden border-b border-white/10">
                      <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: "0%" }}
                        transition={{ duration: 0.8, delay: 0.3 + i * 0.06, ease }}
                      >
                        <Link
                          href={link.href}
                          aria-current={current ? "page" : undefined}
                          className="group flex items-center gap-4 py-4"
                        >
                          <span className={`w-6 font-sans text-xs tabular-nums ${current ? "text-brass-300" : "text-white/40"}`}>0{i + 1}</span>
                          <span className={`flex-1 font-display text-[2.4rem] leading-none ${current ? "text-brass-300 italic" : "text-white"}`}>
                            {link.label}
                          </span>
                          {current ? (
                            <span className="h-2 w-2 rotate-45 bg-brass-300" />
                          ) : (
                            <ArrowUpRight size={18} className="text-white/30 transition-colors group-hover:text-brass-300" />
                          )}
                        </Link>
                      </motion.div>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.75, ease }}
              className="relative mt-auto pt-10"
            >
              <div className="h-3">
                <DiamondDivider tone="brass-300" />
              </div>
              <Link
                href="/suites"
                className="mt-8 flex w-full items-center justify-center gap-3 bg-brass-300 py-4 text-xs font-semibold tracking-[0.22em] text-ink uppercase"
              >
                Book direct &amp; save <ArrowUpRight size={14} />
              </Link>
              <ul className="mt-7 space-y-3 text-sm text-white/75">
                <li>
                  <a href={site.phoneHref} className="flex items-center gap-3 hover:text-brass-300">
                    <Phone size={15} className="text-brass-300" /> {site.phone}
                  </a>
                </li>
                <li>
                  <a href={`mailto:${site.email}`} className="flex items-center gap-3 break-all hover:text-brass-300">
                    <Mail size={15} className="shrink-0 text-brass-300" /> {site.email}
                  </a>
                </li>
                <li className="flex items-center gap-3 text-white/55">
                  <Clock size={15} className="text-brass-300" /> Check-in {site.checkIn} · Check-out {site.checkOut}
                </li>
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
