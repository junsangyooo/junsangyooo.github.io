"use client";

import { SITE } from "@/lib/content";

// Template D — newspaper front page. Heavy masthead, three-column body, hairline rules.
export default function PrintFrontPage() {
  return (
    <div className="relative z-10 mx-auto max-w-7xl px-6 py-8 md:px-10">
      <header className="border-b-2 border-ink pb-4">
        <div className="flex items-baseline justify-between">
          <div className="serif text-3xl uppercase tracking-wide md:text-5xl">
            {SITE.name}
          </div>
          <div className="mono text-[10px] uppercase tracking-[0.3em] text-ink-soft">
            Vol I · No 1 · {SITE.year}
          </div>
        </div>
        <div className="mt-2 flex items-baseline justify-between mono text-[10px] uppercase tracking-[0.3em] text-ink-soft opacity-80">
          <span>{SITE.tagline} — {SITE.affiliation}</span>
          <span>{SITE.status}</span>
        </div>
      </header>

      <main className="mt-8 grid grid-cols-12 gap-6 md:gap-8">
        <section className="col-span-12 md:col-span-3 md:border-r md:border-ink/30 md:pr-6">
          <div className="mono text-[10px] uppercase tracking-[0.3em] text-ink-soft">
            {SITE.hero.eyebrow}
          </div>
          <h1 className="serif mt-3 text-5xl leading-[0.95] md:text-6xl">
            {SITE.hero.headline}
          </h1>
          <p className="mt-8 text-sm leading-relaxed text-ink-soft">
            {SITE.bio}
          </p>
        </section>

        <section className="col-span-12 md:col-span-6 md:border-r md:border-ink/30 md:px-6">
          <div className="mono text-[10px] uppercase tracking-[0.3em] text-ink-soft">
            Selected work
          </div>
          <ul className="mt-4 divide-y divide-ink/20">
            {SITE.projects.map((p) => (
              <li key={p.name} className="py-5">
                <div className="flex items-baseline justify-between gap-4">
                  <div className="serif text-3xl leading-tight md:text-4xl">
                    {p.name}
                  </div>
                  <div className="mono text-[10px] uppercase tracking-[0.2em] text-ink-soft">
                    {p.year}
                  </div>
                </div>
                <div className="mt-2 text-sm text-ink-soft">{p.note}</div>
                <div className="mt-1 mono text-[10px] uppercase tracking-[0.2em] text-ink-soft opacity-70">
                  {p.stack}
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-12 mono text-[10px] uppercase tracking-[0.3em] text-ink-soft">
            Experience
          </div>
          <ul className="mt-4 divide-y divide-ink/20">
            {SITE.experience.map((e) => (
              <li key={e.org} className="py-5">
                <div className="flex items-baseline justify-between gap-4">
                  <div className="serif text-2xl leading-tight">{e.org}</div>
                  <div className="mono text-[10px] uppercase tracking-[0.2em] text-ink-soft">
                    {e.period}
                  </div>
                </div>
                <div className="mt-1 mono text-[10px] uppercase tracking-[0.2em] text-ink-soft opacity-70">
                  {e.role}
                </div>
                <div className="mt-2 text-sm text-ink-soft">{e.note}</div>
              </li>
            ))}
          </ul>
        </section>

        <section className="col-span-12 space-y-12 md:col-span-3 md:pl-6">
          <div>
            <div className="mono text-[10px] uppercase tracking-[0.3em] text-ink-soft">
              Now — {SITE.now.date}
            </div>
            <ul className="mt-3 space-y-2 text-sm">
              {SITE.now.lines.map((l) => (
                <li key={l}>— {l}</li>
              ))}
            </ul>
          </div>

          <div>
            <div className="mono text-[10px] uppercase tracking-[0.3em] text-ink-soft">
              Blog
            </div>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">
              {SITE.blog.note}
            </p>
          </div>

          <div>
            <div className="mono text-[10px] uppercase tracking-[0.3em] text-ink-soft">
              Contact
            </div>
            <a
              href={`mailto:${SITE.contact.email}`}
              className="mt-3 block text-sm underline decoration-ink/30 underline-offset-4 hover:decoration-ink"
            >
              {SITE.contact.email}
            </a>
            <div className="mt-2 mono text-[10px] uppercase tracking-[0.2em] text-ink-soft opacity-70">
              github · {SITE.contact.github}
            </div>
            <div className="mono text-[10px] uppercase tracking-[0.2em] text-ink-soft opacity-70">
              linkedin · {SITE.contact.linkedin}
            </div>
          </div>
        </section>
      </main>

      <footer className="mt-16 border-t-2 border-ink pt-3 flex items-baseline justify-between mono text-[10px] uppercase tracking-[0.3em] text-ink-soft">
        <span>© {SITE.year} {SITE.name}</span>
        <span>small, positive, repeated</span>
      </footer>
    </div>
  );
}
