# BoothieCall - Progress Tracker

## [2025-06-24] Nuevo ciclo de desarrollo (RESET)

- Se inicia el proceso desde cero, migrando y documentando todo desde Next.js como fuente de verdad.
- Todos los milestones, avances y decisiones se documentarán aquí en batches claros y auditables.
- El progreso anterior queda archivado en la historia del repositorio.

---

## Batch 1: Diagnóstico y plan de error en Vercel al cambiar de tema

- [x] Se identificó el error 500: el backend intenta escribir en disco (read-only en Vercel), lo que causa fallo persistente.
- [x] Se analizaron logs y se documentó la causa raíz.
- [x] Se decidió migrar la persistencia a Supabase como "way to be" para producción.

---

## Batch 2: Integración de Supabase para persistencia de configuración

### Objetivo

Permitir que el endpoint `/api/allset/templates/update` y toda la lógica de configuración lean/escriban desde Supabase en vez de archivos locales.

### Tareas

- [ ] Crear proyecto y tabla en Supabase para configuración de sitio (`site_config`)
- [ ] Agregar variables de entorno de Supabase (`SUPABASE_URL`, `SUPABASE_ANON_KEY`, etc.)
- [ ] Instalar SDK de Supabase en el proyecto (`@supabase/supabase-js`)
- [ ] Refactorizar `lib/config.ts` para leer/escribir configuración desde Supabase
- [ ] Refactorizar el endpoint `/api/allset/templates/update` para usar Supabase
- [ ] Probar el flujo de cambio de tema en desarrollo y producción
- [ ] Documentar el nuevo flujo y dependencias en `memory-bank/techContext.md` y `progress.md`

> Este batch se dará por terminado cuando el cambio de tema sea persistente y funcional en Vercel usando Supabase.
