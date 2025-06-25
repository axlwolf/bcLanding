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

### ✅ Template Switching System

- **Hybrid Architecture**: localStorage for immediate updates + Supabase for persistence
- **Admin UX**: Template changes without leaving admin panel (`/allset/templates`)
- **Cross-Tab Sync**: Changes propagate automatically between browser tabs
- **SSR Compatible**: No hydration issues, consistent server-side rendering
- **Preview Function**: "Preview Home" button to verify changes in new tab

### ✅ Performance Optimizations

- Fixed infinite API loops in template selector
- Eliminated Next.js cache conflicts with hybrid client/server approach
- Smooth transitions with loading states (50ms)

---

## Quick Start

1. **Admin Panel**: Navigate to `/allset/templates` for template management
2. **Template Selection**: Choose template → changes apply instantly to home page
3. **Preview**: Use "Preview Home" button to verify changes
4. **Documentation**: See [memory-bank/](memory-bank/) for complete technical details

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
