# BoothieCall – Errores de Consola en Chrome (Jun 2025)

## 1. 404 Not Found de assets

```
GET http://localhost:4321/assets/avatar1.jpg 404 (Not Found)
```

**Causa:** El archivo no existe en la ruta pública.  
**Solución:** Asegúrate de que `/public/assets/avatar1.jpg` exista.

---

## 2. React production mode, dead code elimination

```
Uncaught Error: React is running in production mode, but dead code elimination has not been applied.
```

**Causa:** Bundle de React mal generado o entorno incorrecto.  
**Solución:** Usa `NODE_ENV=production` y asegúrate de que Astro/Vite hagan el build correctamente.

---

## 3. 504 Outdated Optimize Dep (@nanostores_react.js)

```
GET .../node_modules/.vite/deps/@nanostores_react.js?v=475bee5c net::ERR_ABORTED 504 (Outdated Optimize Dep)
```

**Causa:** Caché de dependencias de Vite corrupto o desactualizado.  
**Solución:** Borra la carpeta `.vite` en `node_modules` y reinicia el dev server.

---

## 4. TypeError: Cannot read properties of null (reading 'useState')

```
TypeError: Cannot read properties of null (reading 'useState')
    at FAQAccordion (FAQAccordion.tsx:13:27)
    at ModalDemo (ModalDemo.tsx:7:27)
    at TestimonialCarousel (TestimonialCarousel.tsx:14:29)
```

**Causa:** React no está correctamente inicializado (doble versión, mal contexto, island mal configurado).
**Solución:**

- Verifica que solo haya UNA versión de React y ReactDOM.
- Islands deben usar `client:load` o similar.
- Importa React y ReactDOM correctamente.

---

## 5. Minified React error #423

```
Uncaught Error: Minified React error #423; visit https://reactjs.org/docs/error-decoder.html?invariant=423
```

**Causa:** Error interno de React, normalmente por doble versión, mal bundle o contexto incorrecto.
**Solución:** Igual que arriba.

---

## 6. Failed to fetch dynamically imported module

```
Failed to fetch dynamically imported module: http://localhost:4321/src/components/islands/ThemeToggle.tsx
```

**Causa:** El archivo no existe, la ruta es incorrecta, o el island no está bien servido.
**Solución:** Verifica que el archivo existe y que la importación es correcta. Si renombraste/moviste el archivo, actualiza todas las rutas.

---

**IMPORTANTE:**

- Si ves estos errores, revisa este archivo antes de debuggear.
- Si la automatización falla, documenta manualmente el error y su solución aquí.
