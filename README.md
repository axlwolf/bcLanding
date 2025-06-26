# BoothieCall – Premium AI Landing Pages

BoothieCall is a premium landing page generator for photo booth rentals, built with Next.js, AI content generation, and modern best practices. Features instant template switching with localStorage + Supabase hybrid architecture.

---

## Key Features

- **Instant Template Switching**: Admin changes apply immediately with localStorage + Supabase sync
- **Modular Landing Pages**: Multiple Main templates (Main, Main2-6) with different layouts
- **AI-Powered Content**: Automated blog and content generation
- **Admin Panel**: Full template management without page refreshes
- **GSAP Animations**: Premium micro-interactions and smooth transitions
- **Bilingual Support**: Spanish/English content management
- **Cloud-Native**: Full Supabase integration for scalable deployment
- **Dynamic Landing Page Content**: Editable via admin panel, stored in Supabase.

---

## Recent Updates (2025-06-25)

### ✅ Dynamic Site Settings & Content

- **Dynamic Template**: The main site template now dynamically displays the site name and logo from Supabase.
- **Global Settings Page**: A new settings page at `/allset/settings` allows admins to update the site name, description, and logo.
- **Supabase Storage**: Logo uploads are now handled via a public `siteassets` bucket in Supabase.
- **Unified API**: A single API endpoint (`/api/allset/settings`) now manages all site settings updates.

### ✅ Template Switching System

- **Hybrid Architecture**: localStorage for immediate updates + Supabase for persistence.
- **Admin UX**: Template changes without leaving admin panel (`/allset/templates`).
- **Cross-Tab Sync**: Changes propagate automatically between browser tabs.

### ✅ Dynamic Landing Page Content Management (New - [Current Date])

- **Supabase Backend**: All landing page textual and structural content (hero, features, CTAs, etc.) is now stored in Supabase (`landing_pages` and `page_content` tables).
- **Dynamic Rendering**: Page templates (`Main*.tsx`) fetch content dynamically from Supabase.
- **Content Editor Integration**: The admin editor at `/allset/landing-content` now reads from and writes to Supabase.
- **Vercel Compatibility**: Eliminates reliance on local JSON files for page content, ensuring full Vercel deployment compatibility.
- **AI Content Generation**: AI tools now also use and save content to Supabase.

---

## Quick Start

### Environment Variables Required

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Development Setup

1. **Clone & Install**: `npm install`
2. **Environment**: Copy `.env.example` to `.env.local` and configure all required variables.
3. **Database**:
    - Run the SQL setup scripts from `VERCEL_SETUP.md` in your Supabase project. This will create the `site_config` table (for templates) and the `site_settings` table (for global settings).
    - Run the SQL DDL provided in the `memory-bank` (or commit history) to create the `landing_pages` and `page_content` tables for dynamic landing page content.
    - After table creation, run `npm run db:migrate-landing-content` to populate these tables with initial content from the (now deleted) `data/landingContent.json`.
4. **Storage**: In your Supabase project, create a new **public** storage bucket named `siteassets`. Then, run the storage policy script from `VERCEL_SETUP.md` to allow public uploads.
5. **Verify Supabase (Optional but Recommended)**: Run `npm run verify-supabase` to test your connection to the Supabase database and ensure all required tables exist (`site_config`, `site_settings`, `landing_pages`, `page_content`).
6. **Start**: `npm run dev`

### Production Deployment

1. **Vercel Setup**: See `VERCEL_SETUP.md` for complete deployment guide
2. **Environment Variables**: Configure in Vercel Dashboard (including `SUPABASE_SERVICE_KEY` if migration script needs to be run in a CI/CD pipeline, though typically it's a one-off local run).
3. **Database**: Ensure Supabase `site_config`, `site_settings`, `landing_pages`, and `page_content` tables exist and are populated.

### Admin Panel

1. **Template Management**: Navigate to `/allset/templates` to switch between site templates.
2. **Site Settings**: Navigate to `/allset/settings` to update the site name, description, and logo.
3. **Landing Page Content**: Navigate to `/allset/landing-content` to edit the content of the main landing page.
4. **Preview**: Use the "Preview Home" button in the template manager to verify changes.
5. **Documentation**: See `memory-bank/` for complete technical details, including `lessons-learned.md`.

---

## Architecture

```
Admin Panel (/allset/templates)
    ↓ Select Template
TemplateStorage.ts (localStorage + Supabase)
    ↓ Hybrid Update
ClientTemplateWrapper.tsx (Client Override)
    ↓ Render
Home Page (/) with Selected Template
```

See `memory-bank/architecture.md` and diagrams for complete system overview.
