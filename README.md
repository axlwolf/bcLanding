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
3. **Database**: Run the SQL setup scripts from `VERCEL_SETUP.md` in your Supabase project. This will create the `site_config` table (for templates) and the `site_settings` table (for global settings).
4. **Storage**: In your Supabase project, create a new **public** storage bucket named `siteassets`. Then, run the storage policy script from `VERCEL_SETUP.md` to allow public uploads.
5. **Verify Supabase (Optional but Recommended)**: Run `npm run verify-supabase` to test your connection to the Supabase database and ensure the required tables exist.
6. **Start**: `npm run dev`

### Production Deployment

1. **Vercel Setup**: See `VERCEL_SETUP.md` for complete deployment guide
2. **Environment Variables**: Configure in Vercel Dashboard
3. **Database**: Ensure Supabase `site_config` table exists

### Admin Panel

1. **Template Management**: Navigate to `/allset/templates` to switch between site templates.
2. **Site Settings**: Navigate to `/allset/settings` to update the site name, description, and logo.
3. **Preview**: Use the "Preview Home" button in the template manager to verify changes.
4. **Documentation**: See `memory-bank/` for complete technical details, including `lessons-learned.md`.

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
