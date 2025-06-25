# BoothieCall - Estrategia de Persistencia (2025-06-24)

- Diagnóstico: El sistema de archivos en Vercel no permite escritura persistente (read-only), por lo que toda configuración debe migrar a una base de datos cloud.
- Decisión: Supabase será la fuente de verdad para configuraciones globales y preferencias editables vía backend.
- El frontend solo usará localStorage/cookies para preferencias temporales o visuales, nunca para persistencia global.
- Todo endpoint que requiera guardar datos debe hacerlo vía Supabase.

## Reglas

- Prohibido escribir archivos en disco en producción serverless.
- Toda lógica de configuración global debe ser cloud-first.
- Documentar cada migración y batch en `progress.md`.

> Este archivo debe revisarse y actualizarse con cada decisión arquitectónica sobre persistencia.
