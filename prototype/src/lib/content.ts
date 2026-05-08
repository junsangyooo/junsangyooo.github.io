// Single source of content for the landing-page templates.
// Templates differ in layout only — they all render the same data shape.

export type Project = {
  year: string;
  name: string;
  note: string;
  stack: string;
};

export type Experience = {
  period: string;
  org: string;
  role: string;
  note: string;
};

export const SITE = {
  name: "Junsang Yoo",
  initials: "J.Y.",
  tagline: "Statistics · Computing",
  affiliation: "Waterloo",
  year: "2026",
  status: "Available 2026",

  hero: {
    headline: "small, positive, repeated.",
    eyebrow: "Personal site, v0",
  },

  bio: "A statistics undergrad at Waterloo, currently between the Republic of Korea Air Force and whatever comes after that. I work at the seam where data, software, and operations meet — and have a stubborn habit of building small, self-contained tools that make things a little less manual.",

  now: {
    date: "May 2026",
    lines: [
      "Building Nyom MVP — restaurant discovery as swipe-based UX.",
      "Back at Waterloo for the Stats / Computing track.",
      "Reading Hara Kenya, slowly.",
    ],
  },

  projects: [
    {
      year: "2025—",
      name: "Nyom",
      note: "Restaurant-discovery SaaS, swipe-based matching",
      stack: "Flutter · Node · AWS",
    },
    {
      year: "2024",
      name: "Quant pipeline",
      note: "Historical equity ingest + KIS live trading",
      stack: "Python · Pandas · scikit-learn",
    },
    {
      year: "2023",
      name: "Dragon Slayer",
      note: "2D roguelite with procedural levels",
      stack: "Unity · C#",
    },
  ] satisfies Project[],

  experience: [
    {
      period: "2023 — 2025",
      org: "Republic of Korea Air Force",
      role: "Aircraft armament systems specialist",
      note: "Supported 5,000+ sorties; cut onboarding from 6 to 4 months.",
    },
    {
      period: "2022",
      org: "Netmarble F&C Metaverse World",
      role: "QA test engineer intern",
      note: "Designed 500+ cross-platform test cases across three games.",
    },
  ] satisfies Experience[],

  blog: {
    note: "An archive of 50 LeetCode and algorithm notes from 2023–2024 lives at /blog/archive. New writing — soon.",
  },

  contact: {
    email: "junsang.yoo@uwaterloo.ca",
    github: "junsangyooo",
    linkedin: "junsang-yoo",
  },
};
