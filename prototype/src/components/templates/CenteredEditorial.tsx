"use client";

import { SITE } from "@/lib/content";

// Template A — book body. Single narrow column, everything centered, hairline rules.
export default function CenteredEditorial() {
  return (
    <div className="relative z-10 mx-auto max-w-2xl px-6 py-16 md:px-8">
      <header className="mb-24 flex items-center justify-between mono text-[10px] uppercase tracking-[0.3em] text-ink-soft">
        <span>{SITE.name}</span>
        <span className="opacity-70">{SITE.year}</span>
      </header>

      <section className="text-center">
        <div className="mono text-[10px] uppercase tracking-[0.3em] text-ink-soft opacity-70">
          {SITE.hero.eyebrow}
        </div>
        <h1 className="serif mt-6 text-5xl leading-[0.95] md:text-7xl">
          {SITE.hero.headline}
        </h1>
        <p className="mx-auto mt-12 max-w-md text-base leading-relaxed text-ink-soft">
          {SITE.bio}
        </p>
      </section>

      <Rule />

      <section className="text-center">
        <Eyebrow>Now — {SITE.now.date}</Eyebrow>
        <div className="mt-6 space-y-3 text-base leading-relaxed">
          {SITE.now.lines.map((l) => (
            <p key={l}>{l}</p>
          ))}
        </div>
      </section>

      <Rule />

      <section>
        <div className="text-center">
          <Eyebrow>01 — Selected work</Eyebrow>
        </div>
        <ul className="mt-12 space-y-12">
          {SITE.projects.map((p) => (
            <li key={p.name} className="text-center">
              <div className="serif text-3xl">{p.name}</div>
              <div className="mt-2 mono text-[10px] uppercase tracking-[0.2em] text-ink-soft">
                {p.year} · {p.stack}
              </div>
              <div className="mt-3 text-sm text-ink-soft">{p.note}</div>
            </li>
          ))}
        </ul>
      </section>

      <Rule />

      <section>
        <div className="text-center">
          <Eyebrow>02 — Experience</Eyebrow>
        </div>
        <ul className="mt-12 space-y-10">
          {SITE.experience.map((e) => (
            <li key={e.org} className="text-center">
              <div className="serif text-2xl">{e.org}</div>
              <div className="mt-1 mono text-[10px] uppercase tracking-[0.2em] text-ink-soft">
                {e.period} · {e.role}
              </div>
              <div className="mt-2 text-sm text-ink-soft">{e.note}</div>
            </li>
          ))}
        </ul>
      </section>

      <Rule />

      <section className="text-center">
        <Eyebrow>03 — Blog</Eyebrow>
        <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-ink-soft">
          {SITE.blog.note}
        </p>
      </section>

      <Rule />

      <footer className="text-center">
        <a
          href={`mailto:${SITE.contact.email}`}
          className="serif text-3xl underline decoration-ink/30 underline-offset-8 hover:decoration-ink md:text-5xl"
        >
          {SITE.contact.email}
        </a>
        <div className="mt-12 mono text-[10px] uppercase tracking-[0.3em] text-ink-soft opacity-70">
          © {SITE.year} {SITE.name} · small, positive, repeated
        </div>
      </footer>
    </div>
  );
}

function Rule() {
  return <hr className="mx-auto my-32 w-12 border-ink/30" />;
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="mono text-[10px] uppercase tracking-[0.3em] text-ink-soft">
      {children}
    </div>
  );
}
