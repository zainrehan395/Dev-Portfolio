// lib/config.ts — single source of truth for Zain-ul-Abideen's portfolio

export const SITE_CONFIG = {
  name: "Zain-ul-Abideen",
  shortName: "Zain",
  title: "Zain-ul-Abideen · Software Engineer",
  description:
    "Software Engineer with 2 years of experience building scalable React, Next.js, and Node.js applications. Focused on performance, clean architecture, and shipping production-ready product features.",
  url: "https://zainulabideen.vercel.app",
  email: "zainrehan395@gmail.com",
  phone: "+92 317 4497273",
  location: "Lahore, Pakistan",
  resumePath: "/Zain-ul-Abideen_Resume.pdf",
  socials: {
    linkedin: "",
    github: "",
  },
  accent: "var(--color-brand)",
  marqueeText: "SOFTWARE ENGINEER // REACT // NEXT.JS // NODE // AWS // ",
} as const;

export const EXPERIENCE_DATA = [
  {
    role: "Software Engineer",
    company: "12th Spring LLC",
    location: "Full-time",
    period: "Jul 2024 - Present",
    techStack: [
      "React",
      "Next.js",
      "TypeScript",
      "Node.js",
      "AWS",
      "Redux",
      "Zustand",
      "GraphQL",
      "CI/CD",
    ],
    highlights: [
      "Design and ship React and Next.js apps with careful rendering, routing, and SEO practices.",
      "Use SSR and SSG in Next.js to improve load performance and search visibility.",
      "Integrate REST and GraphQL APIs, and implement Node.js and Express endpoints when needed.",
      "Build AWS workflows with S3 storage, Lambda functions, and CloudFront delivery.",
      "Own state management with Redux, Zustand, and Context for data-heavy product surfaces.",
      "Maintain CI/CD pipelines with GitHub Actions and AWS tooling, and mentor through code reviews.",
    ],
    metrics: [
      { value: "2+", label: "Years shipping" },
      { value: "SSR", label: "Next.js focus" },
      { value: "AWS", label: "Cloud delivery" },
    ],
  },
  {
    role: "Associate Software Engineer",
    company: "12th Spring LLC",
    location: "Full-time",
    period: "Jun 2023 - Jun 2024",
    techStack: ["React", "TypeScript", "REST APIs", "Redux", "Zustand", "Agile"],
    highlights: [
      "Built and maintained React applications with reusable, performance-minded components.",
      "Shipped responsive UIs, connected APIs, and collaborated with design and QA end to end.",
      "Debugged render and load issues to improve perceived performance for users.",
      "Handled complex client state with Redux, Zustand, and Context API.",
      "Worked in Agile rituals: sprint planning, stand-ups, and peer review.",
    ],
  },
  {
    role: "Angular Developer Intern",
    company: "Intelicode",
    location: "Internship",
    period: "Mar 2023 - Jun 2023",
    techStack: ["Angular", "TypeScript", "Git", "SDLC"],
    highlights: [
      "Contributed features and UI improvements to Angular applications.",
      "Built responsive, reusable TypeScript components for maintainability.",
      "Debugged and tested with senior engineers to keep the experience smooth.",
      "Practiced professional SDLC habits with Git-based collaboration.",
    ],
  },
];

// Case studies for real 12th Spring projects. Copy and highlights are grounded in the resume.
export const PROJECTS = [
  {
    id: "01",
    title: "CPI Business",
    tagline: "MARKETING SITE · 12TH SPRING",
    role: "Software Engineer",
    company: "12th Spring LLC",
    period: "Jul 2024 - Present",
    hook: "SEO-optimized marketing website for CPI Business: Nuxt 3 SSR with immersive scroll-driven interfaces powered by GSAP, Lenis, Lottie, and Three.js/GLSL.",
    problem:
      "CPI Business needed a performant, SEO-ready marketing presence with immersive motion and structured content across portfolio, blog, team, careers, and services pages.",
    desc: "Delivered an SEO-optimized marketing website using Nuxt 3 SSR with metadata, sitemap, robots configuration, and Google Analytics. Built immersive scroll-driven interfaces using GSAP, Lenis, Lottie, and Three.js/GLSL. Developed portfolio, blog, team, careers, and services pages using structured JSON content and dynamic slug-based routing. Implemented image preloading, branded loading states, and responsive layouts, and deployed to production on EC2 with PM2.",
    outcome:
      "CPI Business shipped a production marketing site with strong SEO foundations, immersive scroll experiences, and reliable EC2/PM2 deployment.",
    highlights: [
      "Delivered an SEO-optimized marketing website using Nuxt 3 SSR with metadata, sitemap, robots configuration, and Google Analytics.",
      "Built immersive scroll-driven interfaces using GSAP, Lenis, Lottie, and Three.js/GLSL.",
      "Developed portfolio, blog, team, careers, and services pages using structured JSON content and dynamic slug-based routing.",
      "Implemented image preloading, branded loading states, and responsive layouts.",
      "Deployed to production on AWS EC2 with PM2.",
    ],
    tech: [
      "Nuxt 3",
      "GSAP",
      "Three.js",
      "GLSL",
      "Lottie",
      "Lenis",
      "AWS EC2",
      "PM2",
    ],
    link: "",
    accent: "var(--color-brand)",
    diagram: {
      kind: "pipeline" as const,
      caption: "scroll · render · ship",
      nodes: [
        { label: "NUXT 3", sub: "SSR" },
        { label: "GSAP", sub: "Scroll" },
        { label: "THREE.JS", sub: "GLSL" },
        { label: "LENIS", sub: "Motion" },
        { label: "EC2", sub: "PM2" },
      ],
    },
  },
  {
    id: "02",
    title: "Lottae",
    tagline: "MULTI-TENANT PM · 12TH SPRING",
    role: "Software Engineer",
    company: "12th Spring LLC",
    period: "Jul 2024 - Present",
    hook: "Multi-tenant project management platform: pnpm/Turborepo monorepo with Next.js, tRPC, and Prisma — projects, sprints, Kanban, RBAC, and Slack collaboration.",
    problem:
      "Lottae needed a maintainable multi-tenant work-management platform with typed APIs, shared packages, role-based access, and collaboration features across tenants.",
    desc: "Architected a pnpm/Turborepo monorepo using Next.js, tRPC, and Prisma with shared packages for authentication, API services, validation, and database access. Developed core work-management features including projects, epics, user stories, tasks, sprints, and Kanban boards. Implemented role-based access control (RBAC) and route-level authorization so users and tenants access only permitted screens and actions. Delivered collaboration features including comments, notifications, issue history, time tracking, custom forms and fields, and Slack integration. Strengthened typed API contracts, shared validation, and database seeding to improve maintainability and reduce integration issues.",
    outcome:
      "Lottae shipped as a typed multi-tenant PM platform with shared monorepo packages, RBAC, Kanban workflows, and Slack-backed collaboration.",
    highlights: [
      "Architected a pnpm/Turborepo monorepo using Next.js, tRPC, and Prisma with shared packages for authentication, API services, validation, and database access.",
      "Developed core work-management features including projects, epics, user stories, tasks, sprints, and Kanban boards.",
      "Implemented role-based access control (RBAC) and route-level authorization so users and tenants access only permitted screens and actions.",
      "Delivered collaboration features including comments, notifications, issue history, time tracking, custom forms and fields, and Slack integration.",
      "Strengthened typed API contracts, shared validation, and database seeding to improve maintainability and reduce integration issues.",
    ],
    tech: [
      "Next.js",
      "TypeScript",
      "tRPC",
      "Prisma",
      "pnpm",
      "Turborepo",
      "Slack API",
    ],
    link: "",
    accent: "var(--color-brand)",
    diagram: {
      kind: "stack" as const,
      caption: "monorepo · typed APIs · ship",
      nodes: [
        { label: "NEXT.JS", sub: "UI" },
        { label: "tRPC", sub: "Typed API" },
        { label: "PRISMA", sub: "DB" },
        { label: "TURBOREPO", sub: "pnpm" },
      ],
    },
  },
  {
    id: "03",
    title: "Time2Wash",
    tagline: "BACKEND PLATFORM · 12TH SPRING",
    role: "Associate Software Engineer → Software Engineer",
    company: "12th Spring LLC",
    period: "Jun 2023 - Present",
    hook: "Node.js/Express backend for Time2Wash: ~120 APIs, booking workflows, HyperPay and Stripe payments, and JWT-secured mobile checkout for iOS and Android.",
    problem:
      "Time2Wash needed a reliable multi-role backend for customers, operators, vendors, and admins — covering bookings, payments, wallets, corporate clients, and native mobile checkout.",
    desc: "Built and extended a Node.js/Express backend with Sequelize and MySQL powering approximately 120 API endpoints for customers, operators, vendors, and admins. Developed booking workflows including slot selection, package purchase and redemption, cancellations, and booking status email notifications. Integrated HyperPay (including Mada) and Stripe checkout and webhooks for packages, wallets, and transaction tracking. Built JWT-secured APIs and native checkout support for iOS and Android customer and operator applications. Implemented corporate client upgrades with OTP verification, discounts, commissions, advertisements, S3 media handling, and dual EJS back-office panels.",
    outcome:
      "Time2Wash shipped a production backend covering bookings, dual payment rails, mobile JWT APIs, corporate upgrades, and dual EJS admin panels on AWS S3-backed media.",
    highlights: [
      "Built and extended a Node.js/Express backend with Sequelize and MySQL powering approximately 120 API endpoints for customers, operators, vendors, and admins.",
      "Developed booking workflows including slot selection, package purchase and redemption, cancellations, and booking status email notifications.",
      "Integrated HyperPay (including Mada) and Stripe checkout and webhooks for packages, wallets, and transaction tracking.",
      "Built JWT-secured APIs and native checkout support for iOS and Android customer and operator applications.",
      "Implemented corporate client upgrades with OTP verification, discounts, commissions, advertisements, S3 media handling, and dual EJS back-office panels.",
    ],
    tech: [
      "Node.js",
      "Express.js",
      "Sequelize",
      "MySQL",
      "Stripe",
      "HyperPay",
      "AWS S3",
      "JWT",
      "EJS",
    ],
    link: "",
    accent: "var(--color-brand)",
    diagram: {
      kind: "fanout" as const,
      caption: "book · pay · notify",
      source: { label: "EXPRESS API" },
      agents: [{ label: "BOOKINGS" }, { label: "PAYMENTS" }, { label: "MOBILE" }],
      sink: { label: "MYSQL" },
      out: { label: "EJS ADMIN" },
    },
  },
  {
    id: "04",
    title: "Shahen Express",
    tagline: "LOGISTICS MARKETPLACE · MIDDLE EAST",
    role: "Software Engineer",
    company: "12th Spring LLC",
    period: "Jul 2024 - Present",
    hook: "Logistics marketplace for the Middle East: Laravel + Angular platform with order booking, trip tracking, WASL/Bayan compliance, and AWS-hosted delivery.",
    problem:
      "Shahen Express needed freight workflows across admin, requester, and provider roles — with Saudi compliance integrations, live tracking, and reliable AWS staging/production releases.",
    desc: "Developed features across a Laravel backend with Passport API authentication and an Angular web platform supporting admin, requester, and provider workflows. Implemented order booking, offers, provider assignment, trip tracking, and invoicing workflows for freight operations. Contributed to WASL and Bayan government integrations for vehicle and driver registration, freight trips, and waybills to meet Saudi logistics compliance. Supported Google Maps location workflows, Firebase messaging, payment status handling, and operational dashboards with data export. Maintained AWS staging and production environments (S3, CloudFront, EC2) and authored deployment documentation for reliable releases.",
    outcome:
      "Shahen Express shipped freight operations with Passport-secured APIs, compliance-ready WASL/Bayan flows, and documented AWS staging and production releases.",
    highlights: [
      "Developed features across a Laravel backend with Passport API authentication and an Angular web platform supporting admin, requester, and provider workflows.",
      "Implemented order booking, offers, provider assignment, trip tracking, and invoicing workflows for freight operations.",
      "Contributed to WASL and Bayan government integrations for vehicle and driver registration, freight trips, and waybills to meet Saudi logistics compliance.",
      "Supported Google Maps location workflows, Firebase messaging, payment status handling, and operational dashboards with data export.",
      "Maintained AWS staging and production environments (S3, CloudFront, EC2) and authored deployment documentation for reliable releases.",
    ],
    tech: [
      "Laravel",
      "Angular",
      "AWS S3",
      "CloudFront",
      "EC2",
      "Firebase",
      "Google Maps API",
    ],
    link: "",
    accent: "var(--color-brand)",
    diagram: {
      kind: "secure" as const,
      caption: "S3 · CloudFront · EC2",
      left: { label: "SHAHEN APP", sub: "Angular" },
      right: { label: "USERS", sub: "CloudFront" },
      tunnel: "Laravel + Passport",
    },
  },
];

export const SKILLS = [
  {
    category: "Languages",
    items: ["JavaScript", "TypeScript"],
  },
  {
    category: "Frontend",
    items: ["React", "Next.js", "Angular", "Tailwind CSS", "UI libraries"],
  },
  {
    category: "Backend",
    items: ["Node.js", "Express", "tRPC", "REST", "GraphQL"],
  },
  {
    category: "Cloud & Tooling",
    items: ["AWS", "Vercel", "Git", "GitHub", "GitHub Actions", "Jira", "Trello"],
  },
  {
    category: "Design",
    items: ["Figma", "Canva", "Adobe Illustrator"],
  },
];

export const EDUCATION = [
  {
    degree: "Bachelor of Computer Sciences",
    institution: "The University of Lahore",
    period: "2019 - 2023",
    note: "Bachelor's degree",
  },
  {
    degree: "Intermediate of Computer Science (ICS)",
    institution: "Kips College, Lahore",
    period: "2016 - 2018",
    note: "Intermediate",
  },
  {
    degree: "Matriculation",
    institution: "The Educators",
    period: "2014 - 2016",
    note: "Secondary",
  },
];

export const HERO_PANELS = {
  panel1: {
    tag: "STACK",
    meta: "WHAT I BUILD WITH",
    title: "SOFTWARE ENGINEER",
    desc: "TypeScript, React, Next.js, and Node.js apps with a bias for performance, clean code, and ownership.",
    stack: [
      "TypeScript",
      "React",
      "Next.js",
      "Node.js",
      "AWS",
      "tRPC",
      "Tailwind",
      "Zustand",
    ],
  },
  panel2: {
    tag: "FOCUS",
    meta: "WHERE I ADD VALUE",
    headline: "Full-stack\nproduct work",
    subtext:
      "Two years shipping CRM and project-management product features with front-end depth and cloud-aware delivery.",
  },
  panel3: {
    tag: "NOW",
    title: "SHIPPING AT\n12TH SPRING",
    desc: "Software Engineer building scalable React and Next.js systems with AWS-backed delivery.",
  },
  panel4: {
    tag: "OPEN TO WORK",
    cta: "Get in touch",
  },
} as const;
