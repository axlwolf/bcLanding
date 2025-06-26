# Changelog

## 2025-06-25 (Latest)

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

## 2025-06-24

### Supabase Template Sync Migration

- Migrated all template and site configuration from local files to Supabase (`site_config` table).
- Refactored `/api/allset/templates` and `/api/allset/templates/update` for cloud-native persistence.
- Fixed frontend fetch and UI sync issues after template changes.
- Added detailed logging and improved debugging for template management.
- Fixed Prettier/ESLint formatting errors blocking build.
- Documented required Supabase tables for production use.
- Refactored template update endpoint to use a single function (`updateActiveTemplate`) for validation and updating, reducing code duplication and improving maintainability.
