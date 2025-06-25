# 📸 BoothieCall – Premium AI Landing Pages

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT 'MIT License')
![GitHub repo size](https://img.shields.io/github/repo-size/axlwolf/boothiecall)
[![Active](http://img.shields.io/badge/Status-Active-green.svg)](https://github.com/axlwolf/boothiecall)
[![Generic badge](https://img.shields.io/badge/lang-typescript-blue.svg)](https://www.typescriptlang.org/)
[![Generic badge](https://img.shields.io/badge/framework-next.js%2014+-black.svg)](https://nextjs.org/)
[![Generic badge](https://img.shields.io/badge/styles-tailwind%20css%203.4+-teal.svg)](https://tailwindcss.com/)
[![Generic badge](https://img.shields.io/badge/ai-powered-yes-purple.svg)](https://github.com/axlwolf/boothiecall)
[![Generic badge](https://img.shields.io/badge/last%20updated-06--2025-blue)](https://github.com/axlwolf/boothiecall)

![BoothieCall Logo](public/logo.svg)

BoothieCall is a premium landing page for photo booth rentals, focused on luxury events and exceptional user experience. This new version is built 100% with Next.js, integrating AI, advanced micro-interactions, and modern frontend best practices.

> **Note:** The official documentation and source of truth lives in the `memory-bank` folder. The README is only a quick reference; any relevant changes must be reflected first in the `.mdc` and `.md` files in `memory-bank`.

---

## 🚀 Features

- **Modular Landing Page:** Hero, features, gallery, pricing, testimonials, contact
- **AI Content Generation:** SEO-optimized texts and blogs via OpenAI, Gemini, Deepseek, Ollama
- **Blog System:** Generate and edit posts in MDX
- **Admin Panel Ready:** Structure for future dashboard and management
- **Premium Animations:** GSAP micro-interactions, scroll and hover, accessibility friendly
- **Themes:** Light/dark and support for custom themes
- **Mobile-first & Responsive:** Perfect experience on any device
- **Advanced SEO:** Automatic meta tags, optimal performance
- **Internationalization:** Spanish and English ready, adaptable to more languages
- **Integrations:** Analytics, email, CRM, newsletter

---

## 🏛️ Architecture

BoothieCall is modular, extensible, and AI-powered. All architectural decisions are documented in `memory-bank/architecture.md`.

- **Next.js 14+:** App Router, server components, API routes
- **Tailwind CSS:** Rapid and consistent theming
- **GSAP:** Advanced animations and micro-interactions
- **Contentlayer/MDX:** Content and blog management
- **React Context/Zustand:** Global state
- **Jest, Playwright, Testing Library:** Robust testing
- **Supabase (future):** Backend, auth, and realtime
- **Vercel:** Main deployment, with Netlify/Railway as alternatives

### Main Flows

- **Landing Generation (AI):** Modular JSON structure, rearrangeable blocks, GSAP animations
- **Blog AI:** Automatic SEO post creation, modular structure
- **Lead Reception & Analytics:** Real-time capture, notifications, CRM/email integration
- **Admin Panel:** User, role, content, and analytics management
- **Extensibility:** CLI, dashboard, plugins, multi-cloud and multi-LLM

---

## 🗂️ Project Structure

```
project-root/
├── app/                     # Next.js App Router
│   ├── (landing)/           # Main sections (Hero, Features, Gallery...)
│   ├── (blog)/              # Blog and MDX posts
│   ├── (admin)/             # Admin panel (future)
│   ├── api/                 # API routes (leads, emails, etc)
│   └── layout.tsx           # Global layout
├── components/              # Reusable UI components
├── lib/                     # Utilities, hooks, helpers, gsapUtils.ts
├── public/                  # Static assets (logo, images, fonts)
├── styles/                  # Tailwind config, themes, global CSS
├── memory-bank/             # 📚 Source of truth (living documentation)
│   ├── activeContext.md
│   ├── architecture.md
│   ├── productContext.md
│   ├── progress.md
│   ├── projectbrief.md
│   ├── systemPatterns.md
│   ├── techContext.md
│   └── ...
├── tests/                   # Unit and E2E tests
├── .env*                    # Environment variables
├── package.json             # Dependencies and scripts
└── README.md                # This reference
```

---

## 📚 Documentation & Source of Truth

The `memory-bank/` folder contains:

- **projectbrief.md:** Summary and objectives
- **productContext.md:** Justification, user journey, UX goals
- **architecture.md:** Modular architecture and flows
- **techContext.md:** Stack and technical decisions
- **systemPatterns.md:** Development and batching patterns
- **progress.md:** Roadmap and milestones
- **activeContext.md:** Current development state

> **All relevant decisions must be documented here before being reflected in code or the README.**

---

## 🛠️ Tech Stack

- **Next.js 14+** (App Router, SSR/SSG, API routes)
- **React 18**
- **TypeScript**
- **Tailwind CSS 3.4+**
- **GSAP 3.12+** (micro-interactions, scroll/hover animations)
- **Contentlayer/MDX** (blog and content)
- **Zustand / React Context** (global state)
- **Jest, Playwright, Testing Library** (testing)
- **Supabase** (future backend, auth, realtime)
- **Vercel** (main deployment)

---

## ⚡ Getting Started

### Prerequisites

- Node.js 18+
- npm or bun
- API keys for LLM provider (OpenAI, Gemini, etc)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/axlwolf/boothiecall.git
   cd boothiecall
   ```
2. Install dependencies:
   ```bash
   npm install
   # or
   bun install
   ```
3. Copy the environment file:
   ```bash
   cp .env.example .env.local
   ```
4. Configure your environment variables:
   ```env
   # LLM Providers
   OPENAI_API_KEY=your_key_here
   OPENAI_MODEL=gpt-4-turbo-preview
   GEMINI_API_KEY=your_key_here
   GEMINI_MODEL=gemini-pro
   NEXT_PUBLIC_SITE_URL=your_site_url
   ```
5. Start the development server:
   ```bash
   npm run dev
   # or
   bun run dev
   ```

---

## 🎨 Themes & Micro-interactions

- Light/dark support and custom themes (see ThemeProvider and systemPatterns.md)
- GSAP animations on all sections (Hero, Why, Gallery, Pricing, Testimonials, Contact, FAQ)
- Hover effects and smooth scrolling
- All animations respect `prefers-reduced-motion`

---

## 🧪 Testing

- **Unit tests:** Jest + @testing-library/react
- **E2E tests:** Playwright
- **Visual regression:** (future)
- **Batching pattern:** Follow systemPatterns.md for batches and tests
- **Documentation:** See `memory-bank/progress.md` and `systemPatterns.md`

---

## 🚀 Deployment

### Vercel

- Root: repository root (where package.json and app/ are located)
- Output: `.next` (automatically detected)
- public/: only static assets
- Advantages: automatic deploy, global CDN, serverless, previews, analytics

### Alternatives

- **Netlify:** Ideal for static sites
- **Railway:** Full-stack, database included
- **DigitalOcean App Platform:** More control and configuration

---

## 📅 Roadmap

1. **Phase 1:** Next.js implementation (current)
2. **Phase 2:** Refactor admin dashboard and advanced booking
3. **Phase 3:** Headless CMS for quick editing
4. **Phase 4:** Advanced optimization, internationalization, AI features

---

## 🏷️ License

MIT. See LICENSE for details.

---

If you want this as a new file (e.g. `README.en.md`) or want it to replace the current `README.md`, let me know and I’ll handle the file update for you!
