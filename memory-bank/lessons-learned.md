# Lessons Learned: Supabase Integration and Dynamic Content

This document summarizes the key technical lessons learned while integrating Supabase for dynamic site settings and resolving related deployment issues.

### 1. Dynamic vs. Static Data in Next.js

A Next.js application can have data coming from multiple sources. It's crucial to trace where the data originates.

- **Problem**: Changes made in the admin settings page were not reflected on the live site.
- **Root Cause**: The site's metadata (title, logo, etc.) was hardcoded in a static file (`/data/siteMetadata.js`).
- **Solution**: We refactored the root layout (`/app/layout.tsx`) to be a server component that fetches dynamic settings from the Supabase `site_settings` table. This data was then merged with the static data and passed down to the `<Header>` component as props.

### 2. Importance of Client-Side Loading States

When fetching data on a client-side component, always implement a loading state.

- **Problem**: The settings page would initially show blank or default values before the data was fetched from Supabase, causing a flicker and poor user experience.
- **Solution**: We introduced an `isLoading` state to the settings page (`/app/allset/settings/page.tsx`). The page now displays a "Loading..." message until the data has been successfully fetched and is ready to be displayed.

### 3. Component Props and Type Safety

When passing data between components, ensure the child component is designed to accept those props. This is especially important in TypeScript for maintaining type safety.

- **Problem**: A TypeScript error occurred when we passed the `finalSiteMetadata` object from `layout.tsx` to `Header.tsx`.
- **Root Cause**: The `<Header>` component was not typed to accept the `siteMetadata` prop.
- **Solution**: We defined a `HeaderProps` interface in `Header.tsx` to properly type the incoming props. This resolved the error and ensures that the component receives the data it expects.

### 4. Next.js Image Configuration for External Sources

To use external images (like those from Supabase Storage), the remote hostname must be explicitly allowed in the Next.js configuration.

- **Problem**: The site logo uploaded to Supabase Storage was not displaying.
- **Root Cause**: The Supabase domain (`wftxeiwoacxjhqulbotv.supabase.co`) was not included in the `images.remotePatterns` array in `next.config.mjs`.
- **Solution**: We added the Supabase hostname to the configuration. **Crucially, the local development server must be restarted for this change to take effect.**

### 5. Supabase RLS and Storage Policies

Correctly configuring Row Level Security (RLS) is essential for both security and functionality.

- **Problem**: The application was unable to upload the logo file to Supabase Storage due to RLS policies.
- **Solution**: We created and applied SQL policies to the `siteassets` storage bucket to allow public `select` (read) and `insert` (upload) operations. This ensured that the application could save and retrieve files without violating security rules.
