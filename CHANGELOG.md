# Changelog

## [Current Date, e.g., 2025-07-01] (Latest)

### 🚀 FEATURE: Dynamic Landing Page Content via Supabase

- **Data Persistence**: Migrated all landing page content (hero, features, CTAs, pricing, testimonials, FAQs, etc.) from the static `data/landingContent.json` file to a dynamic Supabase backend.
  - Created new Supabase tables: `landing_pages` (for page metadata like slug, page_type) and `page_content` (for storing individual page section data as JSONB).
- **Data Migration Script**: Developed `scripts/migrateLandingContent.js` to perform a one-time migration of existing JSON content into the new Supabase tables. Added `db:migrate-landing-content` npm script.
- **API Refactoring**:
  - `/api/allset/landing-content`:
    - `GET`: Now fetches and reconstructs landing page content from Supabase based on a page slug (defaults to "main-landing").
    - `POST`: Now saves the entire landing page content to Supabase by intelligently upserting data into the `page_content` table for each section and updating the `landing_pages` table if `pageType` changes.
  - `/api/allset/generate-content`: AI-generated content is now saved directly to Supabase.
  - `/api/allset/generate-blog-titles`: Now fetches landing page context from Supabase instead of the local JSON file.
  - API routes involved set to `dynamic = 'force-dynamic'` for Vercel compatibility.
- **Frontend Dynamic Content**:
  - Page templates (`app/Main.tsx` through `app/Main6.tsx`) converted to async Server Components. They now fetch content dynamically from the `/api/allset/landing-content` API instead of using static JSON imports.
  - Shared components like `components/Header.tsx` (via `app/layout.tsx`) now receive landing page content as props, allowing for dynamic elements (e.g., navigation links based on available content sections).
  - Client-side interactive parts within these templates have been preserved using `'use client'` directives and prop drilling.
- **Content Editor (`/allset/landing-content`)**:
  - Now loads data from and saves data to Supabase via the refactored API.
  - Issues with page type display (for the default "main-landing" page) and reset functionality are expected to be resolved due to the consistent Supabase backend.
- **Vercel Compatibility**: This migration ensures that landing page content is fully dynamic and manageable in a serverless environment like Vercel, removing reliance on a read-only filesystem.
- **Cleanup**: Deleted the `data/landingContent.json` file.

---

## 2025-06-25

### Vercel Deployment Error Fixes

**🐛 BUG FIXES: Resolved 401 and 500 Errors in Production**

- **Fixed 401 Unauthorized Error on `/static/favicons/site.webmanifest`**
  - Created `vercel.json` configuration file with proper headers for static assets
  - Added Cache-Control and CORS headers for favicon files
  - Updated middleware to explicitly allow public paths
  - Improved static file serving configuration

- **Fixed 500 Internal Server Error on `/api/allset/templates/update`**
  - Enhanced error handling with descriptive error messages
  - Added environment variable validation before Supabase operations
  - Implemented proper error categorization (CONFIG_ERROR, TABLE_NOT_FOUND, CONNECTION_ERROR)
  - Added OPTIONS handler for CORS support
  - Improved logging for better debugging

**🛠 Development Tools**

- Created `scripts/verify-supabase.mjs` for connection verification
  - Validates Supabase environment variables
  - Tests database connectivity
  - Provides SQL setup instructions if tables are missing
  - Added npm script: `npm run verify-supabase`

**📚 Documentation**

- Added `TROUBLESHOOTING_VERCEL.md` with detailed error resolution guide
- Documented required environment variables for Vercel deployment
- Included step-by-step instructions for Supabase table setup
- Added debugging tips and common solutions

**🔧 Configuration Updates**

- Updated `middleware.ts` with improved public path handling
- Enhanced `next.config.mjs` security headers
- Added `vercel.json` for deployment-specific settings
- Improved API route configuration with `dynamic = 'force-dynamic'`

---

## 2025-06-25

### Template Switching System - Hybrid Architecture Implementation

**🎉 MAJOR FEATURE: Instant Template Switching**

- Implemented hybrid localStorage + Supabase architecture for immediate template updates
- Created `ClientTemplateWrapper.tsx` for client-side template override logic
- Modified `app/page.tsx` to use hybrid server/client rendering approach
- Added `lib/templateStorage.ts` utility for localStorage + Supabase synchronization

**🔧 Admin Panel UX Improvements**

- Fixed incorrect redirect behavior in admin template selector
- Users now remain in `/allset/templates` admin panel after template changes
- Added "Preview Home" button to verify changes in new tab
- Improved success messaging and user guidance
- Enhanced admin panel instructions for clarity

**🚀 Performance & Reliability Fixes**

- Fixed infinite API loop in template selector component
- Resolved React useEffect dependency issues causing re-render loops
- Eliminated SSR/hydration mismatches between server and client
- Added smooth transitions (50ms) for template switching
- Implemented cross-tab synchronization using localStorage events

**📋 Architecture Documentation**

- Created comprehensive Mermaid diagrams for system architecture
- Added folder structure visualization diagrams
- Documented failed approaches and debugging attempts for future reference
- Updated `memory-bank/` with complete implementation history
- Added `diagrams-README.md` for diagram usage and maintenance

**🛠 Technical Implementation Details**

- **Hybrid Flow**: Admin panel → localStorage update → Supabase sync → Client override → Template render
- **SSR Safe**: Server always renders Supabase template, client enhances with localStorage
- **Cross-Device**: Supabase persistence ensures consistency across devices/sessions
- **Fallback Resilient**: Graceful degradation if localStorage unavailable
- **Real-time**: Changes propagate instantly between browser tabs

---

## 2024-06-25

### Added

- **Dynamic Site Settings**: Created a new settings page at `/allset/settings` to manage global site configuration.
- **Unified Settings API**: Implemented a new API endpoint at `/api/allset/settings` to handle saving site name, description, email, and logo uploads to Supabase.
- **Supabase Integration**: The root layout now fetches site name and logo URL from the `site_settings` table in Supabase, making the main template dynamic.
- **Lessons Learned Documentation**: Added `memory-bank/lessons-learned.md` to document key technical insights from the Supabase integration.

### Fixed

- **Settings Not Updating**: The settings page now fetches existing data from Supabase on load, ensuring the form is always up-to-date.
- **Template Not Updating**: The main site template now correctly displays the dynamic site name and logo from the settings.
- **Image Loading Error**: Added the Supabase storage domain to `next.config.mjs` to allow external images.
- **Linting Errors**: Corrected various linting errors in `next.config.mjs` and `settings/page.tsx`.

---

## 2025-06-24

### Supabase Template Sync Migration

- Migrated all template and site configuration from local files to Supabase (`site_config` table).
- Refactored `/api/allset/templates` and `/api/allset/templates/update` for cloud-native persistence.
- Fixed frontend fetch and UI sync issues after template changes.
- Added detailed logging and improved debugging for template management.
- Fixed Prettier/ESLint formatting errors blocking build.
- Documented required Supabase tables for production use.
- Refactored template update endpoint to use a single function (`updateActiveTemplate`) for validation and updating, reducing code duplication and improving maintainability.
