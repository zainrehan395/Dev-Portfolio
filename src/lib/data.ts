export const profile = {
  name: "Zain",
  fullName: "Zain-Ul-Abideen",
  role: "Full Stack Software Engineer",
  years: "3+",
  tagline:
    "Full Stack Software Engineer with 3+ years building scalable, production-grade web applications using React.js, Next.js, Node.js, TypeScript, and AWS — from SSR/SSG frontends and REST/GraphQL APIs to monorepo architecture, payment integrations, and CI/CD.",
  email: "zainrehan395@gmail.com",
  phone: "+92 317 4497273",
  linkedin: "https://www.linkedin.com/in/zain-rehan/",
  location: "Lahore, Pakistan · Available worldwide",
  education: "Bachelor of Computer Science · The University of Lahore (2019-2023)",
  focus:
    "Delivered SaaS, logistics, and marketplace platforms for clients in the United States and the Middle East. Ships faster with AI-assisted tools (Claude, Cursor, Google Stitch) without compromising quality.",
};

export const experience = [
  {
    id: "12th-spring-se",
    year: "Jul 2024 — Present",
    title: "Software Engineer",
    category: "12th Spring LLC",
    summary:
      "Design and deliver scalable full-stack apps with React, Next.js, Nuxt.js, Node.js, Express, NestJS, and Python. Own SSR/SSG, REST & GraphQL APIs, AWS (S3, Lambda, CloudFront), CI/CD, state management, AI-assisted delivery, code reviews, and mentorship.",
    stack: ["React", "Next.js", "NestJS", "Nuxt.js", "AWS", "GraphQL"],
    outcome: "Full-stack delivery · mentorship · cloud architecture",
  },
  {
    id: "12th-spring-ase",
    year: "Jun 2023 — Jun 2024",
    title: "Associate Software Engineer",
    category: "12th Spring LLC",
    summary:
      "Built and maintained React applications with reusable, optimized components. Delivered responsive UIs, REST integrations, Redux/Zustand/Context state flows, and frontend performance work in Agile sprints with design and QA.",
    stack: ["React", "TypeScript", "Redux", "Zustand", "REST APIs"],
    outcome: "Faster load times · cleaner reusable UI systems",
  },
  {
    id: "intelicode",
    year: "Mar 2023 — Jun 2023",
    title: "Angular Developer Intern",
    category: "Intelicode",
    summary:
      "Shipped features and UI enhancements for Angular TypeScript apps — reusable components, debugging, and performance work alongside senior engineers while learning professional SDLC and Git collaboration.",
    stack: ["Angular", "TypeScript", "Git"],
    outcome: "Foundation in production frontend delivery",
  },
];

export const projects = [
  {
    id: "lottae",
    name: "Lottae",
    label: "Multi-Tenant Project Management",
    summary:
      "Architected a pnpm/Turborepo monorepo with Next.js, tRPC, and Prisma — shared auth, API, validation, and database packages. Built projects, epics, stories, tasks, sprints, Kanban, RBAC, comments, notifications, time tracking, custom fields, and Slack integration.",
    stack: ["Next.js", "TypeScript", "tRPC", "Prisma", "Turborepo", "Slack API"],
    region: "SaaS platform",
  },
  {
    id: "time2wash",
    name: "Time2Wash",
    label: "Car-Wash Booking Marketplace",
    summary:
      "Extended a Node/Express + Sequelize/MySQL backend (~120 APIs) for customers, operators, vendors, and admins. Booking workflows, HyperPay (incl. Mada) and Stripe payments, JWT mobile checkout, corporate OTP upgrades, S3 media, and dual EJS back-office panels.",
    stack: ["Node.js", "Express", "Sequelize", "MySQL", "Stripe", "HyperPay", "AWS S3"],
    region: "Marketplace",
  },
  {
    id: "shahen",
    name: "Shahen Express",
    label: "Logistics Marketplace",
    summary:
      "Features across a Laravel + Passport API and Angular web platform for admin, requester, and provider flows — booking, offers, assignment, trip tracking, invoicing, WASL/Bayan compliance, Maps, Firebase messaging, and AWS staging/production ops.",
    stack: ["Laravel", "Angular", "AWS", "Firebase", "Google Maps"],
    region: "Middle East",
  },
  {
    id: "ultra-mobile",
    name: "Ultra Mobile",
    label: "US Telecom Client",
    summary:
      "Designed and maintained scalable web features for a Costa Mesa, CA telecom client. Collaborated with global engineering and product in Agile sprints; reduced post-deployment defects by ~20% through reviews, debugging, and structured testing.",
    stack: ["Web applications", "Agile", "Code reviews"],
    region: "United States",
  },
  {
    id: "cpi-business",
    name: "CPI Business",
    label: "Events & Creative Agency",
    summary:
      "SEO-optimized Nuxt 3 SSR marketing site with metadata, sitemap, robots, and Analytics. Immersive GSAP/Lenis/Lottie/Three.js scroll interfaces; portfolio, blog, team, careers, and services from structured JSON — deployed on EC2 with PM2.",
    stack: ["Nuxt 3", "GSAP", "Three.js", "Lenis", "AWS EC2", "PM2"],
    region: "Marketing site",
  },
];

export const skillGroups = [
  {
    id: "frontend",
    label: "Frontend",
    items: [
      "React.js",
      "Next.js",
      "Nuxt.js",
      "TypeScript",
      "Tailwind CSS",
      "Redux / Zustand",
      "GSAP",
      "Three.js",
    ],
  },
  {
    id: "backend",
    label: "Backend",
    items: [
      "Node.js",
      "Express.js",
      "NestJS",
      "Laravel",
      "tRPC",
      "GraphQL / REST",
      "Prisma",
      "Python",
    ],
  },
  {
    id: "systems",
    label: "Systems",
    items: [
      "AWS",
      "Docker",
      "MySQL / MongoDB",
      "Vercel",
      "CI/CD",
      "Stripe / HyperPay",
      "Turborepo",
      "AI tooling",
    ],
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
    copy: "S3, Lambda, CloudFront, EC2, and cloud architectures built for high availability and distributed delivery.",
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
    detail:
      "Align on goals, constraints, and success metrics with product, design, and engineering stakeholders.",
  },
  {
    title: "Architect",
    detail:
      "Shape frontend architecture, API boundaries, monorepo packages, and cloud infrastructure as one coherent system.",
  },
  {
    title: "Build",
    detail:
      "Ship production-ready features across the stack with clean architecture, reviews, AI-assisted velocity, and Agile delivery.",
  },
  {
    title: "Optimize",
    detail:
      "Harden performance, SEO, CI/CD, and reliability so releases stay fast and systems stay stable.",
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
