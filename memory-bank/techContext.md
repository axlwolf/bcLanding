# BoothieCall - Tech Context

## Persistencia y configuración: de archivos locales a Supabase

- El sistema de archivos en Vercel es de solo lectura, lo que impide la persistencia de configuraciones en archivos locales (como `data/config/site.json`).
- La solución escalable y compatible con Next.js serverless es migrar la persistencia a Supabase.
- Supabase permite almacenar configuraciones globales, preferencias de usuario y cualquier dato crítico de forma segura y escalable.
- El endpoint `/api/allset/templates/update` y la lógica de configuración migraron a Supabase, eliminando dependencias de SQLite o archivos JSON locales para producción.

### Microbatches de integración Supabase

1. Crear cliente Supabase (`lib/supabaseClient.ts`) ✅
2. Refactorizar lectura de configuración (`lib/config.ts`) ✅
3. Refactorizar escritura/actualización de configuración (`lib/config.ts`) ✅
4. Refactorizar endpoint `/api/allset/templates/update` ✅
5. Documentar y limpiar dependencias legacy (en curso)

#### Mejoras futuras

- Fallback a localStorage/indexedDB en frontend para preferencias de usuario.
- Fallback a Storage Buckets para alta disponibilidad global.

> Ver `progress.md` para batches y estado de avance.
