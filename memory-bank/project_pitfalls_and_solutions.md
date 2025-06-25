# BoothieCall – Errores Críticos, Causas y Soluciones

Este documento recopila TODOS los errores que se presentaron, incluyendo los causados por la automatización, para que nunca vuelvan a ocurrir en el proyecto BoothieCall.

---

## 1. Errores de i18n: Claves inconsistentes

**Problema:**

- Errores como `Property 'testimonials.items' does not exist on type ...` o `Property 'testimonials.list' does not exist on type ...`.
- Causados por diferencias en las claves de traducción entre archivos (ej: `en.json` usaba `testimonials.list`, `es.json` usaba `testimonials.items`).

**Solución:**

- Todas las claves deben ser idénticas en todos los idiomas y en el código. Unifica y revisa cada cambio en los archivos i18n.

---

## 2. Inferencia incorrecta de tipos Zod/Astro

**Problema:**

- Errores como `Property 'schema' does not exist on type 'unknown'` o `Type 'CollectionConfig<...>' does not satisfy...` en `src/content/config.ts`.
- Ocurre al intentar inferir tipos desde la colección en vez del schema.

**Solución:**

- Define el schema Zod como constante separada (`const blogPostSchema = z.object({...})`).
- Usa esa constante tanto en `defineCollection` como en la inferencia de tipos (`z.infer<typeof blogPostSchema>`).

---

## 3. Uso de componentes inexistentes o incompletos

**Problema:**

- Fallos por importar/usar componentes no implementados (`Badge`, `Alert`), o nombres incorrectos.

**Solución:**

- Comentar importaciones y uso hasta que el componente exista y compile correctamente.
- Reintegrar solo tras validar su funcionamiento.

---

## 4. Props erróneas en componentes

**Problema:**

- Pasar props no soportadas (ej: `icon` en `Button.astro`).

**Solución:**

- Revisa siempre la API del componente antes de usar props. Si no existe, elimina la prop o adapta el componente.

---

## 5. Errores de sintaxis en documentación JSX/TSX

**Problema:**

- Errores como `Expected '}' but found ':'` por llaves `{}` sin escapar en bloques de documentación.

**Solución:**

- Escapa las llaves en documentación: `{\`{`}` para `{` y `{\`}`}` para `}`.

---

## 6. Problemas de automatización y memory bank

**Problema:**

- Fallos al guardar en el memory bank por rutas o nombres de proyecto incorrectos (ej: `axlwolf/landingBoothieCall`, `boothiecall_landing`).
- Errores como `ENOENT: no such file or directory, mkdir '~'` o `scandir .../memory-bank`.

**Solución:**

- Usar siempre la ruta absoluta y válida del memory bank (`/Users/flanuza/Desktop/landingBoothieCall/memory-bank`).
- Verificar que la carpeta existe antes de escribir.
- Documentar manualmente si la automatización falla.

---

## 7. Otros errores comunes Astro/Vite detectados

- No definir islands React ni hooks dentro de archivos `.astro`.
- No sobrescribir archivos i18n: fusionar siempre para no perder traducciones.
- Todas las claves i18n deben estar presentes para evitar errores de undefined.
- Las props pasadas a islands deben ser serializables.
- Mantener rutas de assets y traducciones consistentes.
- Validar siempre JSON de traducciones antes de guardar.

---

**¡SIGUE ESTAS REGLAS Y NUNCA MÁS SUFRIRÁS ESTOS ERRORES EN BOOTHIECALL!**
