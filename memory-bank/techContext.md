# BoothieCall - Tech Context

## Persistencia y configuración: de archivos locales a Supabase

- El sistema de archivos en Vercel es de solo lectura, lo que impide la persistencia de configuraciones en archivos locales (como `data/config/site.json`).
- La solución escalable y compatible con Next.js serverless es migrar la persistencia a Supabase.
- Supabase permite almacenar configuraciones globales, preferencias de usuario y cualquier dato crítico de forma segura y escalable.
- El endpoint `/api/allset/templates/update` y la lógica de configuración migrarán a Supabase, eliminando dependencias de SQLite o archivos JSON locales para producción.

### Stack actualizado:

- Next.js 14+
- Supabase (PostgreSQL) para persistencia
- @supabase/supabase-js como client SDK
- Variables de entorno: `SUPABASE_URL`, `SUPABASE_ANON_KEY`

> Ver `progress.md` para batches y pasos de migración.
