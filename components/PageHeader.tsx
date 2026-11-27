import { Reveal, SplitText } from "@/components/motion";

/** Light, typographic page opener used on interior pages. Wrap a word in *asterisks* for the brass accent. */
export default function PageHeader({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="mx-auto max-w-[1440px] px-5 pt-40 pb-16 sm:px-8 lg:pt-48 lg:pb-20">
      <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-8">
          <Reveal>
            <p className="eyebrow flex items-center gap-4 text-brass-700">
              <span className="h-px w-10 bg-brass-500" />
              {eyebrow}
            </p>
          </Reveal>
          <SplitText
            as="h1"
            immediate
            delay={0.1}
            text={title}
            accentClass="text-brass-500"
            className="mt-6 font-display text-5xl leading-[1] tracking-tight sm:text-7xl lg:text-[6.5rem]"
          />
        </div>
        {intro && (
          <Reveal delay={0.4} className="lg:col-span-4">
            <p className="max-w-md leading-relaxed text-ink-500">{intro}</p>
          </Reveal>
        )}
      </div>
      {children}
    </header>
  );
}
