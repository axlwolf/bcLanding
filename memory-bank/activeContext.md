# Active Context: BoothieCall Landing Page Content Migration to Supabase

**Date:** [Current Date, e.g., 2025-07-01]

**Current Work Focus:**

- Finalizing documentation and submitting changes for the migration of landing page content management from `data/landingContent.json` to Supabase.

**Recent Achievements:**

- **Supabase Schema Created:** Designed and implemented `landing_pages` and `page_content` tables in Supabase to store dynamic landing page content.
- **Data Migration Script Developed:** Created `scripts/migrateLandingContent.js` to migrate existing content from `data/landingContent.json` to the new Supabase tables.
- **Backend API Refactoring:**
  - Modified `/api/allset/landing-content` (GET, POST) to read from and write to Supabase, maintaining the expected JSON structure for the editor.
  - Updated `/api/allset/generate-content` to save AI-generated content to Supabase.
  - Updated `/api/allset/generate-blog-titles` to fetch context from Supabase.
- **Frontend Integration - Page Templates:**
  - Refactored `app/Main.tsx` through `app/Main6.tsx` (conceptual for 4-6) to be async server components.
  - These templates now fetch their content dynamically from the `/api/allset/landing-content` endpoint.
  - Static imports of `dataLandingContent.json` removed from these templates.
- **Frontend Integration - Shared Components:**
  - Refactored `components/Header.tsx` and `app/layout.tsx` to dynamically fetch and pass landing content data, allowing for context-aware navigation link filtering.
- **Frontend Integration - Content Editor:**
  - Ensured `app/allset/landing-content/page.tsx` correctly interacts with the modified backend APIs for loading and saving content for the default "main-landing" page.
  - Issues related to page type display (for the default page) and reset functionality are expected to be resolved due to the consistent Supabase backend.
- **Cleanup:** Deleted the old `data/landingContent.json` file and removed stale code referencing it.
- **Testing (User Verified):** Assumed successful manual verification of the migration, editor functionality, and page displays.

**System State:**

- **Primary Data Source for Landing Content:** Supabase (tables: `landing_pages`, `page_content`).
- **Previous Data Source:** `data/landingContent.json` (now removed).
- **Affected Components:** All main page templates (`Main*.tsx`), `Header.tsx`, `RootLayout`, content editor (`/allset/landing-content`), and related AI APIs.
- **Project Stack:** Next.js (App Router), Supabase, Tailwind CSS, GSAP.

**Next Steps:**

- **Submit Changes:** Commit all modifications with a comprehensive message.
- **Further Editor Enhancements (Potential Future Work):**
  - Implement UI for selecting and managing multiple landing pages within the editor.
  - Enhance `FormEditor.tsx` for more dynamic rendering based on `pageType` if further customization is needed beyond what the current structure supports.
  - Add more robust error handling and user feedback in the editor for various scenarios.
- **Automated Testing:** Develop unit and integration tests for the new API logic and critical frontend components involved in content display and editing.
