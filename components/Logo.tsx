import Image from "next/image";

/** The Historic George Hotel logo (from historicgeorgehotel.com), recoloured as clean white and ink versions. */
const SRC = { light: "/images/logo-light.png", dark: "/images/logo-dark.png" } as const;
const W = 687;
const H = 530;

/**
 * Size it with a height class (e.g. `h-14`); width follows the artwork's ratio.
 * `tone` is the logo colour: "light" for dark backgrounds, "dark" for light ones.
 * Pass "auto" with `onDark` to cross-fade between the two (used by the navbar).
 */
export default function Logo({
  tone = "dark",
  onDark = false,
  className = "h-14",
  preload = false,
}: {
  tone?: "light" | "dark" | "auto";
  onDark?: boolean;
  className?: string;
  preload?: boolean;
}) {
  const img = (src: string, extra = "") => (
    <Image
      src={src}
      alt=""
      width={W}
      height={H}
      preload={preload}
      className={`h-full w-auto ${extra}`}
    />
  );

  if (tone !== "auto") {
    return (
      <span className={`inline-block aspect-[687/530] ${className}`}>
        {img(SRC[tone])}
        <span className="sr-only">Historic George Hotel</span>
      </span>
    );
  }

  return (
    <span className={`relative inline-block aspect-[687/530] ${className}`}>
      {img(SRC.light, `absolute inset-0 transition-opacity duration-500 ${onDark ? "opacity-100" : "opacity-0"}`)}
      {img(SRC.dark, `absolute inset-0 transition-opacity duration-500 ${onDark ? "opacity-0" : "opacity-100"}`)}
      <span className="sr-only">Historic George Hotel</span>
    </span>
  );
}
