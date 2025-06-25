# Changelog

## 2025-06-24

### Supabase Template Sync Migration

- Migrated all template and site configuration from local files to Supabase (`site_config` table).
- Refactored `/api/allset/templates` and `/api/allset/templates/update` for cloud-native persistence.
- Fixed frontend fetch and UI sync issues after template changes.
- Added detailed logging and improved debugging for template management.
- Fixed Prettier/ESLint formatting errors blocking build.
- Documented required Supabase tables for production use.
- Refactored template update endpoint to use a single function (`updateActiveTemplate`) for validation and updating, reducing code duplication and improving maintainability.
