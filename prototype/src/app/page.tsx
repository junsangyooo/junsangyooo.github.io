"use client";

export default function Home() {
  return (
    <div className="relative">
      {/*
        Hero — particles come from the layout's BackgroundCanvas.
        This page only paints text/UI on top of that fixed background.
      */}
      <section className="relative z-10 flex h-screen w-full flex-col">
        <header className="flex items-start justify-between p-6 md:p-10 mono text-[11px] uppercase tracking-[0.2em] text-ink-soft">
          <div>
            <div className="text-ink">Junsang Yoo</div>
            <div className="opacity-60">Statistics · Computing — Waterloo</div>
          </div>
          <nav className="hidden gap-6 md:flex">
            <a className="hover:text-ink" href="#about">About</a>
            <a className="hover:text-ink" href="#work">Work</a>
            <a className="hover:text-ink" href="#writing">Writing</a>
          </nav>
        </header>

        <div className="flex flex-1 items-end justify-between p-6 md:p-10">
          <div className="max-w-xl">
            <div className="mono text-[10px] uppercase tracking-[0.3em] text-ink-soft opacity-70">
              Personal site, v0 prototype
            </div>
            <h1 className="serif mt-3 text-5xl leading-[0.95] md:text-7xl lg:text-[88px]">
              small, positive, repeated.
            </h1>
          </div>

          <div className="hidden text-right md:block">
            <div className="mono text-[10px] uppercase tracking-[0.3em] text-ink-soft opacity-70">
              the figure morphs
            </div>
            <div className="mono text-[10px] uppercase tracking-[0.3em] text-ink-soft opacity-70">
              every few seconds
            </div>
          </div>
        </div>

        <footer className="flex items-center justify-between p-6 md:p-10 mono text-[10px] uppercase tracking-[0.3em] text-ink-soft opacity-70">
          <span>Scroll ↓</span>
          <span>v0 · prototype</span>
        </footer>
      </section>

      <section
        id="about"
        className="relative z-10 mx-auto flex min-h-screen max-w-4xl flex-col justify-center px-6 py-24 md:px-10"
      >
        <div className="mono text-[10px] uppercase tracking-[0.3em] text-ink-soft opacity-70">
          01 — About
        </div>
        <h2 className="serif mt-6 text-4xl leading-tight md:text-6xl">
          A statistics undergrad at Waterloo, currently between the
          <em className="ml-2 text-accent">Republic of Korea Air Force</em> and
          whatever comes after that.
        </h2>
        <p className="mt-10 max-w-2xl text-lg leading-relaxed text-ink-soft">
          I work at the seam where data, software, and operations meet.
          Past lives include QA at Netmarble F&amp;C, weapons systems
          for the ROKAF, and a stubborn habit of building small,
          self-contained tools that make my life — or someone else&apos;s —
          a little less manual.
        </p>
      </section>

      <section
        id="work"
        className="relative z-10 mx-auto max-w-5xl px-6 py-24 md:px-10"
      >
        <div className="mono text-[10px] uppercase tracking-[0.3em] text-ink-soft opacity-70">
          02 — Selected work
        </div>
        <ul className="mt-10 divide-y divide-ink/10">
          {[
            {
              year: "2025—",
              name: "Nyom",
              note: "Restaurant-discovery SaaS — Flutter, Node, AWS",
            },
            {
              year: "2024",
              name: "Quant pipeline",
              note: "Historical equity ingest + KIS live trading",
            },
            {
              year: "2023",
              name: "Dragon Slayer",
              note: "2D roguelite in Unity / C#",
            },
          ].map((p) => (
            <li
              key={p.name}
              className="flex items-baseline justify-between gap-6 py-6"
            >
              <div className="mono text-xs uppercase tracking-[0.2em] text-ink-soft opacity-70">
                {p.year}
              </div>
              <div className="serif flex-1 text-3xl md:text-4xl">{p.name}</div>
              <div className="hidden text-sm text-ink-soft md:block">
                {p.note}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section
        id="writing"
        className="relative z-10 mx-auto max-w-4xl px-6 py-24 md:px-10"
      >
        <div className="mono text-[10px] uppercase tracking-[0.3em] text-ink-soft opacity-70">
          03 — Writing
        </div>
        <p className="serif mt-6 text-3xl leading-snug md:text-5xl">
          The blog is asleep. <span className="text-ink-soft">A small
          archive of LeetCode and algorithm notes lives in
          <span className="ml-2 mono text-base normal-case tracking-normal text-accent">/blog/archive</span>
          — coming soon.</span>
        </p>
      </section>

      <footer className="relative z-10 mx-auto flex max-w-5xl items-center justify-between px-6 py-12 md:px-10 mono text-[10px] uppercase tracking-[0.3em] text-ink-soft opacity-70">
        <span>© {new Date().getFullYear()} Junsang Yoo</span>
        <span>built quietly, in the dark</span>
      </footer>
    </div>
  );
}
