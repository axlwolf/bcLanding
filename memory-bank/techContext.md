# BoothieCall - Tech Context

## Current Technical Architecture (June 2025)

### Template Switching System - Hybrid Architecture

- **Hybrid Storage**: localStorage for immediate UI updates + Supabase for persistence
- **Client-Server Bridge**: `ClientTemplateWrapper.tsx` enables client-side overrides while maintaining SSR
- **Zero Latency**: Template changes apply instantly without page refresh or API wait
- **Cross-Tab Sync**: localStorage events propagate changes between browser tabs
- **Fallback Strategy**: Graceful degradation to API-only mode if localStorage unavailable

### Production Infrastructure

- **Hosting**: Vercel (Next.js optimized platform)
- **Database**: Supabase (PostgreSQL with real-time capabilities)
- **Build System**: Next.js 15.3.4 with App Router
- **Styling**: Tailwind CSS v4 with PostCSS
- **TypeScript**: Full type safety across the application

### Error Handling & Monitoring

- **Environment Validation**: Runtime checks for required environment variables
- **Error Categorization**: Specific error types (CONFIG_ERROR, TABLE_NOT_FOUND, CONNECTION_ERROR)
- **Verification Tools**: `npm run verify-supabase` for connection testing
- **Deployment Documentation**: Comprehensive guides for Vercel setup

## Persistencia y configuración: de archivos locales a Supabase

- El sistema de archivos en Vercel es de solo lectura, lo que impide la persistencia de configuraciones en archivos locales (como `data/config/site.json`).
- La solución escalable y compatible con Next.js serverless es migrar la persistencia a Supabase.
- Supabase permite almacenar configuraciones globales, preferencias de usuario y cualquier dato crítico de forma segura y escalable.
- El endpoint `/api/allset/templates/update` y la lógica de configuración migraron a Supabase, eliminando dependencias de SQLite o archivos JSON locales para producción.
- **Landing Page Content**: Dynamic content for landing pages (previously from `data/landingContent.json`) is now stored in Supabase tables (`landing_pages` and `page_content`). The content editor at `/allset/landing-content` and relevant APIs now interact with these tables.

### Microbatches de integración Supabase

1. Crear cliente Supabase (`lib/supabaseClient.ts`) ✅
2. Refactorizar lectura de configuración (`lib/config.ts`) ✅
3. Refactorizar escritura/actualización de configuración (`lib/config.ts`) ✅
4. Refactorizar endpoint `/api/allset/templates/update` ✅
5. Documentar y limpiar dependencias legacy ✅

### Recent Technical Fixes (June 25, 2025)

#### Vercel Deployment Errors Resolved

1. **401 Unauthorized on Static Files**
   - Updated middleware to explicitly whitelist public paths
   - Created vercel.json with proper headers configuration
   - Added CORS headers for cross-origin resource access

2. **500 Internal Server Error on API**
   - Enhanced error handling with specific error types
   - Added environment variable validation
   - Created verification script for testing connections
   - Implemented graceful fallbacks for missing configuration

3. **Build-Time Environment Issues**
   - Added placeholder values for build-time Supabase client creation
   - Runtime validation ensures production safety
   - Clear error messages guide developers to proper setup

### Technical Stack Summary

- **Framework**: Next.js 15.3.4 (App Router)
- **UI**: React 18.3.1 + Tailwind CSS 4.1.10
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel
- **Type Safety**: TypeScript 5.8.3
- **Content**: MDX with Contentlayer2
- **Email**: Nodemailer with multiple provider support
- **AI Integration**: Support for OpenAI, Google Gemini, DeepSeek

#### Mejoras futuras

- Real-time Supabase subscriptions for multi-admin scenarios
- Performance monitoring and analytics
- Enhanced caching strategies
- Progressive Web App capabilities

> Ver `progress.md` para batches y estado de avance.
