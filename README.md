# RESK — Portfolio (2026)

<div align="center">
  <img src="public/favicon.svg" width="96" height="96" alt="RESK Logo" style="border-radius: 50%;" />
  <h1>Reddy Santosh Kumar</h1>
  <p><strong>Full Stack Developer & AI/ML Engineer</strong></p>
  <p>Building production-grade ML systems, autonomous multi-agent protocols, and interactive WebGL experiences.</p>

  <p>
    <a href="https://github.com/RESKCORE"><img src="https://img.shields.io/badge/GitHub-RESKCORE-181717?style=flat-square&logo=github" alt="GitHub" /></a>
    <a href="https://www.linkedin.com/in/reddy-santosh-kumar/"><img src="https://img.shields.io/badge/LinkedIn-reddy--santosh--kumar-0A66C2?style=flat-square&logo=linkedin" alt="LinkedIn" /></a>
    <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react" alt="React 19" />
    <img src="https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Vite-6-646CFF?style=flat-square&logo=vite" alt="Vite 6" />
    <img src="https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat-square&logo=tailwind-css" alt="Tailwind CSS" />
  </p>
</div>

---

## ⚡ Overview

A high-performance, editorial portfolio crafted with a bold **cobalt blue (`#0047FF`)** and **warm cream (`#FFF8E7`)** aesthetic. Designed with fluid simulation, smooth inertial scrolling, micro-animations, and a radial navigation dome.

### ✨ Key Highlights

- **Three.js WebGL Fluid Dynamics**: Real-time GPU fluid simulation on the hero landing page with mouse/touch interaction.
- **Radial Dome Menu**: GPU-accelerated 360° circular lens bloom navigation with equal sector geometry and responsive mobile scaling.
- **Lenis Smooth Scroll + GSAP ScrollTrigger**: Silky inertial scrolling and scrubbed image parallax throughout all pages.
- **Custom Target Cursor**: Responsive dual-ring cursor with interactive hover detection (`.cursor-target`, links, buttons).
- **Asynchronous Contact System**: In-page email dispatch powered by Web3Forms with live transmission states, anti-spam honeypot, and 1-click clipboard copy for email and WhatsApp.
- **Single-Page Application Routing**: React Router v7 with zero-flicker transitions and `vercel.json` SPA rewrite rules.

---

## 🗂️ Production Archive & Chronological Timeline

```
Nexus (Jan 2026) ➔ KLAROS (Jan–Sep 2026) ➔ KRIORA (Aug 2026) ➔ KRUZZ (Sep 2026) ➔ AgentPal (Oct 2026)
```

| # | System | Timeline | Domain / Stack | Live Application |
|---|---|---|---|---|
| **01** | **Nexus** | January 2026 | Global Open-Source Activity Observatory<br/>`Next.js 16 · TypeScript · Supabase · D3` | [nexus-one-eosin.vercel.app ↗](https://nexus-one-eosin.vercel.app) |
| **02** | **KLAROS** | Jan/Feb – Sep 2026 | Decision Intelligence & Deterministic MCDA<br/>`React · Supabase · Groq · Vercel AI SDK` | [klaros-ten.vercel.app ↗](https://klaros-ten.vercel.app/) |
| **03** | **KRIORA LMS** | August 2026 | AI-Powered Learning Management System<br/>`React 19 · Convex Cloud · TypeScript · Tailwind` | [kriora.vercel.app ↗](https://kriora.vercel.app) |
| **04** | **KRUZZ** | September 2026 | System Architecture & Case Studies Arena<br/>`TypeScript · Convex · System Design · Mermaid` | [kruzz.indevs.in ↗](https://kruzz.indevs.in) |
| **05** | **AgentPal** *(Featured)* | October 2026 | Bilateral AI Negotiation & Settlement Kernel<br/>`React · TypeScript · AI Agents · PayPal REST API` | [agentpal-three.vercel.app ↗](https://agentpal-three.vercel.app/) |

---

## 🛠️ Tech Stack

- **Core**: React 19, TypeScript 5.8, Vite 6
- **Routing**: React Router DOM v7
- **Styling**: Tailwind CSS v4, Vanilla CSS Design System Tokens
- **Creative Dev & Animations**: Three.js, React Three Fiber, GSAP 3, ScrollTrigger, SplitType, Lenis
- **Icons**: Lucide React
- **Forms & Email**: Web3Forms REST API
- **Deployment**: Vercel

---

## 📁 Repository Structure

```
├── public/                     # High-res screenshots, favicons, vector assets
│   ├── AgentPal *.png          # Case study visuals (Terminal & Invoicing)
│   ├── Klaros *.png            # Decision intelligence dashboards
│   ├── Kriora *.png            # LMS platform and arena views
│   ├── KRUZZ *.png             # System design simulation screens
│   ├── Nexus *.png             # Global observatory live feed views
│   ├── favicon.svg             # Circular profile vector favicon
│   └── profile.png             # Portrait image & OG share asset
├── src/
│   ├── components/             # Reusable UI & canvas components
│   │   ├── AnimatedCopy.tsx    # Split-text diffuse / slide typography
│   │   ├── FluidSimulation.tsx # GPU-accelerated WebGL fluid dynamics
│   │   ├── Menu.tsx            # 360° Radial dome navigation system
│   │   ├── Nav.tsx             # Real-time IST clock & location telemetry
│   │   ├── Footer.tsx          # Editorial site footer
│   │   └── TargetCursor.tsx    # Interactive tracking custom cursor
│   ├── hooks/
│   │   └── useLenis.ts         # Inertial smooth scroll & GSAP ticker
│   ├── pages/
│   │   ├── Home.tsx            # Hero with fluid simulation & brand typography
│   │   ├── Work.tsx            # Chronological Selected Works (01-05)
│   │   ├── Project.tsx         # AgentPal featured case study & deep dive
│   │   ├── Lab.tsx             # About, engineering principles, stats & tech stack
│   │   └── Contact.tsx         # Contact form, direct copy actions & socials
│   ├── index.css               # Design tokens, typography variables & gutters
│   └── App.tsx                 # Route declarations & cursor/nav shell
├── vercel.json                 # SPA client-side rewrite configuration
└── vite.config.ts              # Vite plugins & path aliases
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- `npm` or `bun`

### 1. Clone the repository

```bash
git clone https://github.com/RESKCORE/Portfolio-RESKCORE.git
cd Portfolio-RESKCORE
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

Add your free Web3Forms access key (generated in 10 seconds at [web3forms.com](https://web3forms.com)):

```env
VITE_WEB3FORMS_ACCESS_KEY="your-access-key-here"
```

### 4. Start local development server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Production Build

Validate TypeScript and bundle for production:

```bash
npm run lint
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

---

## 🌐 Deploying to Vercel

1. Import this repository into [Vercel](https://vercel.com/new).
2. Add your environment variable in project settings:
   - `VITE_WEB3FORMS_ACCESS_KEY` = `your-web3forms-access-key`
3. Click **Deploy**. The included [`vercel.json`](vercel.json) handles client-side routing on all page refreshes.

---

## 📬 Contact & Connect

- **Engineer**: Reddy Santosh Kumar (RESK)
- **Email**: [reddysantosh1310@gmail.com](mailto:reddysantosh1310@gmail.com)
- **Phone / WhatsApp**: [+91 89779 97886](tel:+918977997886)
- **GitHub**: [@RESKCORE](https://github.com/RESKCORE)
- **LinkedIn**: [linkedin.com/in/reddy-santosh-kumar](https://www.linkedin.com/in/reddy-santosh-kumar/)
- **Location**: Vijayawada, India (IST / UTC+5:30)
