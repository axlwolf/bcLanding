# BoothieCall – Premium AI Landing Pages

BoothieCall is a premium landing page generator for photo booth rentals, built with Next.js, AI content generation, and modern best practices. All configuration (including template selection and active theme) is now persisted in Supabase for full cloud compatibility.

---

## Key Features

- Modular landing page sections
- AI-powered content and blog generation
- Admin panel ready
- GSAP-powered micro-interactions
- Theme/template switching fully synced with Supabase

---

## Supabase Migration (2025-06-24)

- All template and site configuration is now stored in the `site_config` table in Supabase.
- Endpoints `/api/allset/templates` and `/api/allset/templates/update` have been refactored to use Supabase as the single source of truth.
- Frontend now fetches and updates config directly from the backend, eliminating stale/cached UI bugs.
- See `memory-bank/progress.md` for detailed migration history.

---

## Setup

See the [memory-bank/](memory-bank/) folder for full documentation, Supabase SQL setup, and architecture diagrams.
