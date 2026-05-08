"use client";

import { SITE } from "@/lib/content";

const NAV = [
  { id: "01", label: "About", href: "#about" },
  { id: "02", label: "Now", href: "#now" },
  { id: "03", label: "Work", href: "#work" },
  { id: "04", label: "Experience", href: "#experience" },
  { id: "05", label: "Blog", href: "#blog" },
];

// Template C — academic archive / digital garden. Left rail sticks; right column flows.
export default function TwoColumnSticky() {
  return (
    <div className="relative z-10 mx-auto grid max-w-6xl grid-cols-12 gap-8 px-6 py-12 md:px-10">
      <aside className="col-span-12 md:col-span-3">
        <div className="md:sticky md:top-12">
          <div className="serif text-3xl leading-none">{SITE.initials}</div>
          <div className="mt-2 mono text-[10px] uppercase tracking-[0.3em] text-ink-soft">
            {SITE.tagline}
          </div>
          <div className="mono text-[10px] uppercase tracking-[0.3em] text-ink-soft opacity-70">
            {SITE.affiliation} · {SITE.year}
          </div>

          <nav className="mt-12 space-y-2">
            {NAV.map((item) => (
              <a
                key={item.id}
                href={item.href}
                className="group flex items-baseline gap-3 text-sm text-ink-soft hover:text-ink"
              >
                <span className="mono text-[10px] uppercase tracking-[0.2em] opacity-60 group-hover:opacity-100">
                  {item.id}
                </span>
                <span>{item.label}</span>
              </a>
            ))}
          </nav>

          <div className="mt-12 mono text-[10px] uppercase tracking-[0.3em] text-ink-soft opacity-70">
            {SITE.status}
          </div>
        </div>
      </aside>

      <main className="col-span-12 space-y-32 pb-24 md:col-span-9">
        <section>
          <div className="mono text-[10px] uppercase tracking-[0.3em] text-ink-soft opacity-70">
            {SITE.hero.eyebrow}
          </div>
          <h1 className="serif mt-4 text-5xl leading-[0.95] md:text-7xl">
            {SITE.hero.headline}
          </h1>
        </section>

        <section id="about" className="space-y-6">
          <Eyebrow>01 — About</Eyebrow>
          <p className="text-lg leading-relaxed">{SITE.bio}</p>
        </section>

        <section id="now" className="space-y-4">
          <Eyebrow>02 — Now · {SITE.now.date}</Eyebrow>
          <div className="space-y-3 text-base leading-relaxed">
            {SITE.now.lines.map((l) => (
              <p key={l}>{l}</p>
            ))}
          </div>
        </section>

        <section id="work">
          <Eyebrow>03 — Selected work</Eyebrow>
          <ul className="mt-8 divide-y divide-ink/15">
            {SITE.projects.map((p) => (
              <li
                key={p.name}
                className="grid grid-cols-12 items-baseline gap-4 py-6"
              >
                <div className="col-span-2 mono text-[10px] uppercase tracking-[0.2em] text-ink-soft">
                  {p.year}
                </div>
                <div className="col-span-10 md:col-span-6">
                  <div className="serif text-2xl md:text-3xl">{p.name}</div>
                  <div className="mt-1 mono text-[10px] uppercase tracking-[0.2em] text-ink-soft opacity-70">
                    {p.stack}
                  </div>
                </div>
                <div className="col-span-12 text-sm text-ink-soft md:col-span-4 md:text-right">
                  {p.note}
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section id="experience">
          <Eyebrow>04 — Experience</Eyebrow>
          <ul className="mt-8 divide-y divide-ink/15">
            {SITE.experience.map((e) => (
              <li
                key={e.org}
                className="grid grid-cols-12 items-baseline gap-4 py-6"
              >
                <div className="col-span-12 mono text-[10px] uppercase tracking-[0.2em] text-ink-soft md:col-span-3">
                  {e.period}
                </div>
                <div className="col-span-12 md:col-span-9">
                  <div className="serif text-2xl">{e.org}</div>
                  <div className="mt-1 mono text-[10px] uppercase tracking-[0.2em] text-ink-soft">
                    {e.role}
                  </div>
                  <div className="mt-2 text-sm text-ink-soft">{e.note}</div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section id="blog" className="space-y-4">
          <Eyebrow>05 — Blog</Eyebrow>
          <p className="serif text-2xl leading-snug md:text-3xl">{SITE.blog.note}</p>
        </section>

        <footer className="space-y-6 border-t border-ink/20 pt-16">
          <Eyebrow>Contact</Eyebrow>
          <a
            href={`mailto:${SITE.contact.email}`}
            className="serif block text-3xl underline decoration-ink/30 underline-offset-8 hover:decoration-ink md:text-5xl"
          >
            {SITE.contact.email}
          </a>
          <div className="flex items-baseline justify-between mono text-[10px] uppercase tracking-[0.3em] text-ink-soft opacity-70">
            <span>© {SITE.year} {SITE.name}</span>
            <span>small, positive, repeated</span>
          </div>
        </footer>
      </main>
    </div>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="mono text-[10px] uppercase tracking-[0.3em] text-ink-soft">
      {children}
    </div>
  );
}
