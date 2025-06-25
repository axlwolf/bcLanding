# BoothieCall - Project Brief (Next.js Edition)

## Project Overview

BoothieCall is a premium photo booth rental landing page focused on luxury events and exceptional user experience. This new version is built 100% with Next.js, integrating modern frontend best practices.

> **Note:** The official documentation and single source of truth for architecture, technical decisions, and processes lives in the `memory-bank` folder. The README.md is only a quick reference; any relevant change must be reflected here first.

## Core Requirements

### Primary Goals

- Create a highly effective landing page for photo booth rental conversions
- Showcase premium quality with elegant design and micro-interactions
- Provide a smooth and simple booking experience
- Support bilingual content (Spanish/English)
- Implement light/dark theme switching
- Ensure mobile-first and fully responsive design

### Target Audience

- **Primary:** Premium event organizers (weddings, corporate, celebrations)
- **Secondary:** Marketing agencies seeking services for their clients
- **Geography:** Initially Mexico City metropolitan area

### Key Features Required

1. **Landing Page:** Hero, features, gallery, pricing, testimonials, contact
2. **Blog System:** Content marketing for SEO
3. **Booking System (MVP):** Simple form with email notification
4. **Admin Ready:** Structure ready for a future dashboard

### Technical Requirements (Next.js Stack)

- **Framework:** Next.js (App Router, Server Components, React 18)
- **Styling:** Tailwind CSS with custom golden luxury theme
- **Animations:** GSAP for premium micro-interactions
- **Testing:** Jest (logic), Playwright (E2E), @testing-library/react
- **Content:** MDX or Contentlayer for blog/posts
- **State:** React Context, Zustand or lightweight solution (as needed)
- **Deployment:** Vercel (recommended), Netlify and Railway as alternatives
- **Accessibility:** Accessible modal, keyboard navigation, dark mode
- **Optimizations:** Next.js images, lazy loading, Lighthouse 90+

### Success Metrics

- Lighthouse score 90+ in all categories
- Mobile-first design
- Sub-2 second load times
- High conversion rate on contact forms
- Excellent SEO

### Brand Identity

- **Colors:** Premium golden palette (#D4AF37, #F4E4BC, #B8860B)
- **Aesthetic:** Cinematic, elegant, premium quality
- **Tone:** Professional yet approachable, luxury without pretension
- **Typography:** Modern serif for headings, clean sans-serif for body

## Project Constraints

- No localStorage usage for MVP
- MVP is client-side only (backend to be integrated in future phases)
- Angular migration path must be documented for historical reference only
- Maintain feature parity documentation for future migrations

## Deployment & Vercel Advantages (README Extract)

- **Root Directory:** Must be the repository root (where package.json and app/ are located).
- **Output Directory:** `.next` (automatically detected by Vercel).
- **public/** folder: Only static files.
- **Vercel Advantages:**
  1. Optimized for Next.js
  2. Automatic deploys on push to main
  3. Global CDN and serverless functions included
  4. PR preview deployments and performance analytics
  5. Generous free tier

## Roadmap (Next.js-First)

1. **Phase 1:** Next.js implementation (CURRENT FOCUS)
2. **Phase 2:** Refactor for admin dashboard and advanced booking
3. **Phase 3:** Headless CMS integration for rapid content editing
4. **Phase 4:** Advanced optimization, internationalization, AI features

---

> **Reminder:** Any update to architecture, dependencies, or processes must be reflected first in the `memory-bank` files.
