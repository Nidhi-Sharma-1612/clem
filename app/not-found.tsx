import Link from "next/link";
import Logo from "@/components/Logo";

export default function NotFound() {
  return (
    <section className="flex min-h-[80vh] flex-col items-center justify-center px-5 pt-24 text-center">
      <Logo tone="dark" className="h-28" />
      <p className="eyebrow mt-10 text-brass-700">Room not found</p>
      <h1 className="mt-4 font-display text-6xl sm:text-8xl">404</h1>
      <p className="mt-4 max-w-sm text-ink-500">This door doesn&rsquo;t lead anywhere. Let&rsquo;s get you back to the lobby.</p>
      <Link
        href="/"
        className="mt-10 bg-ink px-10 py-5 text-xs font-semibold tracking-[0.2em] text-white uppercase hover:bg-brass-700"
      >
        Return home
      </Link>
    </section>
  );
}
