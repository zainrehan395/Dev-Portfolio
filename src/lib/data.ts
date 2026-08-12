export const profile = {
  name: "Zain",
  fullName: "Zain-Ul-Abideen",
  role: "Full Stack Software Engineer",
  years: "3+",
  tagline:
    "I design and deliver high-performance, scalable web applications with React, Next.js, Node.js, and AWS — from frontend architecture to cloud deployment.",
  email: "zainrehan395@gmail.com",
  phone: "+92 317 4497273",
  location: "Lahore, Pakistan · Available worldwide",
  education: "Bachelor of Computer Sciences · The University of Lahore (2019–2023)",
};

export const experience = [
  {
    id: "12th-spring-se",
    year: "2024–Present",
    title: "Software Engineer",
    category: "12th Spring LLC",
    summary:
      "Design and deliver scalable, production-grade applications across frontend, backend, and cloud. Built with React, Next.js, Nuxt.js, Node.js, Express, NestJS, and Python services — including SSR/SSG, REST & GraphQL APIs, AWS (S3, Lambda, CloudFront), and CI/CD pipelines.",
    stack: ["React", "Next.js", "NestJS", "Nuxt.js", "AWS", "GraphQL"],
    outcome: "Full-stack delivery · mentorship · cloud architecture",
  },
  {
    id: "12th-spring-ase",
    year: "2023–2024",
    title: "Associate Software Engineer",
    category: "12th Spring LLC",
    summary:
      "Specialized in React development for scalable, high-performance web apps. Built responsive UIs, integrated APIs, managed complex state with Redux/Zustand/Context, and partnered with design and QA in Agile sprints to ship end-to-end features.",
    stack: ["React", "TypeScript", "Redux", "Zustand", "REST APIs"],
    outcome: "Faster load times · cleaner reusable UI systems",
  },
  {
    id: "intelicode",
    year: "2023",
    title: "Angular Developer Intern",
    category: "Intelicode",
    summary:
      "Contributed to Angular and TypeScript applications — reusable components, UI enhancements, debugging, and performance work alongside senior engineers while learning professional SDLC and Git collaboration.",
    stack: ["Angular", "TypeScript", "Git"],
    outcome: "Foundation in production frontend delivery",
  },
];

/** @deprecated use experience — kept as alias for existing imports */
export const projects = experience;

export const skillGroups = [
  {
    id: "frontend",
    label: "Frontend",
    items: ["React.js", "Next.js", "Nuxt.js", "TypeScript", "Tailwind CSS", "Redux / Zustand"],
  },
  {
    id: "backend",
    label: "Backend",
    items: ["Node.js", "Express.js", "NestJS", "Python", "tRPC", "GraphQL / REST"],
  },
  {
    id: "systems",
    label: "Systems",
    items: ["AWS", "Docker", "MongoDB / SQL", "Vercel", "CI/CD", "GitHub Actions"],
  },
];

/** Skill stops for the camera-scroll scene (pmndrs pattern). */
export const skillStops = [
  {
    id: "react",
    mesh: "VR_Headset",
    title: "React.js",
    group: "Frontend",
    copy: "Scalable component systems, state management with Redux and Zustand, and interfaces built for real product traffic.",
  },
  {
    id: "typescript",
    mesh: "Headphones",
    title: "TypeScript",
    group: "Frontend",
    copy: "Typed contracts across UI and API so refactors stay safe and intent stays clear in the codebase.",
  },
  {
    id: "next",
    mesh: "Rocket003",
    title: "Next.js",
    group: "Frontend",
    copy: "SSR, SSG, and modern rendering strategies that improve performance, SEO, and user experience.",
  },
  {
    id: "node",
    mesh: "Roundcube001",
    title: "Node.js",
    group: "Backend",
    copy: "Express and NestJS services — APIs, business logic, and backends that stay predictable under load.",
  },
  {
    id: "data",
    mesh: "Table",
    title: "SQL / MongoDB",
    group: "Backend",
    copy: "Query optimization and data modeling tuned for reliability and scale in production systems.",
  },
  {
    id: "aws",
    mesh: "Notebook",
    title: "AWS",
    group: "Systems",
    copy: "S3, Lambda, CloudFront, and cloud architectures built for high availability and distributed delivery.",
  },
  {
    id: "devops",
    mesh: "Zeppelin",
    title: "CI / CD",
    group: "Systems",
    copy: "GitHub Actions, AWS Pipelines, Docker, and CircleCI — faster releases with consistent deploy quality.",
  },
];

export const processSteps = [
  {
    title: "Discover",
    detail: "Align on goals, constraints, and success metrics with product, design, and engineering stakeholders.",
  },
  {
    title: "Architect",
    detail: "Shape frontend architecture, API boundaries, and cloud infrastructure as one coherent system.",
  },
  {
    title: "Build",
    detail: "Ship production-ready features across the stack with clean architecture, reviews, and Agile delivery.",
  },
  {
    title: "Optimize",
    detail: "Harden performance, SEO, CI/CD, and reliability so releases stay fast and systems stay stable.",
  },
];

export const bookingSlots = [
  { id: "tue-10", day: "Tue", date: "Mar 10", time: "10:00" },
  { id: "tue-14", day: "Tue", date: "Mar 10", time: "14:00" },
  { id: "wed-11", day: "Wed", date: "Mar 11", time: "11:00" },
  { id: "thu-09", day: "Thu", date: "Mar 12", time: "09:30" },
  { id: "fri-15", day: "Fri", date: "Mar 13", time: "15:00" },
  { id: "mon-13", day: "Mon", date: "Mar 16", time: "13:00" },
];

export const archNodes = [
  { id: "client", label: "Client", x: 12, y: 28, connects: ["api", "cdn"] },
  { id: "cdn", label: "CloudFront", x: 32, y: 14, connects: ["app"] },
  { id: "app", label: "Next.js", x: 52, y: 22, connects: ["api"] },
  { id: "api", label: "Node / NestJS", x: 38, y: 48, connects: ["db", "queue", "auth"] },
  { id: "auth", label: "Auth", x: 18, y: 62, connects: [] },
  { id: "db", label: "MongoDB / SQL", x: 58, y: 68, connects: [] },
  { id: "queue", label: "Lambda", x: 78, y: 52, connects: ["db"] },
  { id: "obs", label: "CI / CD", x: 82, y: 24, connects: ["app", "api"] },
];
