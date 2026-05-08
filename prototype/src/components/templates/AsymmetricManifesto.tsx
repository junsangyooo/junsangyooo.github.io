"use client";

import { SITE } from "@/lib/content";

// Template B — magazine cover. Outsized headline left, meta tucked into the corners,
// body text indented into the right column to feel like an essay reply to the title.
export default function AsymmetricManifesto() {
  return (
    <div className="relative z-10 mx-auto max-w-7xl px-6 py-10 md:px-12">
      <header className="flex items-start justify-between mono text-[10px] uppercase tracking-[0.3em] text-ink-soft">
        <div>
          <div className="text-ink">{SITE.name}</div>
          <div className="opacity-70">
            {SITE.tagline} — {SITE.affiliation}
          </div>
        </div>
        <div className="text-right opacity-70">
          <div>{SITE.status}</div>
          <div>{SITE.year}</div>
        </div>
      </header>

      <section className="grid min-h-[78vh] grid-cols-12 items-end gap-6 pt-16">
        <h1 className="col-span-12 serif text-7xl leading-[0.88] md:col-span-10 md:text-[150px] lg:text-[200px]">
          {SITE.hero.headline}
        </h1>
        <div className="col-span-12 mono text-[10px] uppercase tracking-[0.3em] text-ink-soft md:col-span-2 md:pb-6">
          {SITE.hero.eyebrow}
        </div>
      </section>

      <Section index="01" label="About">
        <p className="serif text-2xl leading-snug md:text-4xl">{SITE.bio}</p>
      </Section>

      <Section index="02" label={`Now · ${SITE.now.date}`}>
        <ul className="space-y-4 text-lg leading-relaxed">
          {SITE.now.lines.map((l) => (
            <li key={l} className="border-l border-ink/20 pl-4">
              {l}
            </li>
          ))}
        </ul>
      </Section>

      <Section index="03" label="Selected work">
        <ul className="space-y-1">
          {SITE.projects.map((p) => (
            <li
              key={p.name}
              className="grid grid-cols-12 gap-4 border-t border-ink/15 py-6 md:gap-6"
            >
              <div className="col-span-12 mono text-[10px] uppercase tracking-[0.2em] text-ink-soft md:col-span-2">
                {p.year}
              </div>
              <div className="col-span-12 serif text-4xl leading-tight md:col-span-7 md:text-6xl">
                {p.name}
              </div>
              <div className="col-span-12 text-sm text-ink-soft md:col-span-3">
                {p.note}
                <div className="mt-2 mono text-[10px] uppercase tracking-[0.2em] opacity-70">
                  {p.stack}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section index="04" label="Experience">
        <ul className="space-y-1">
          {SITE.experience.map((e) => (
            <li
              key={e.org}
              className="grid grid-cols-12 gap-4 border-t border-ink/15 py-6 md:gap-6"
            >
              <div className="col-span-12 mono text-[10px] uppercase tracking-[0.2em] text-ink-soft md:col-span-2">
                {e.period}
              </div>
              <div className="col-span-12 md:col-span-7">
                <div className="serif text-3xl md:text-4xl">{e.org}</div>
                <div className="mt-1 mono text-[10px] uppercase tracking-[0.2em] text-ink-soft">
                  {e.role}
                </div>
              </div>
              <div className="col-span-12 text-sm text-ink-soft md:col-span-3">
                {e.note}
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section index="05" label="Blog">
        <p className="serif text-2xl leading-snug md:text-3xl">{SITE.blog.note}</p>
      </Section>

      <footer className="mt-32 grid grid-cols-12 gap-6 border-t border-ink/20 pt-12">
        <div className="col-span-12 md:col-span-2 mono text-[10px] uppercase tracking-[0.3em] text-ink-soft">
          Contact
        </div>
        <a
          href={`mailto:${SITE.contact.email}`}
          className="col-span-12 serif text-5xl underline decoration-ink/30 underline-offset-8 hover:decoration-ink md:col-span-10 md:text-8xl lg:text-[140px]"
        >
          {SITE.contact.email}
        </a>
        <div className="col-span-12 mt-12 flex items-baseline justify-between mono text-[10px] uppercase tracking-[0.3em] text-ink-soft opacity-70">
          <span>© {SITE.year} {SITE.name}</span>
          <span>small, positive, repeated</span>
        </div>
      </footer>
    </div>
  );
}

function Section({
  index,
  label,
  children,
}: {
  index: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section className="grid grid-cols-12 gap-4 py-32 md:gap-6">
      <div className="col-span-12 mono text-[10px] uppercase tracking-[0.3em] text-ink-soft md:col-span-2">
        {index} / {label}
      </div>
      <div className="col-span-12 md:col-span-9 md:col-start-4">{children}</div>
    </section>
  );
}
