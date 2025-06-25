# Changelog

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
