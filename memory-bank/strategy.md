# BoothieCall - Estrategia de Persistencia (2025-06-25)

## Estrategia Final: Híbrida localStorage + Supabase

### Decisión Arquitectónica (2025-06-25)

- **Solución implementada**: Sistema híbrido que combina localStorage para UX inmediato y Supabase para persistencia cloud
- **Resultado**: Template switching instantáneo sin comprometer SSR, SEO o persistencia cross-device
- **Approach**: Client-side enhancement over server-side foundation

## Principios Híbridos

### 1. **Server-First Foundation**

- El servidor siempre renderiza desde Supabase (single source of truth)
- Garantiza SEO, SSR consistency y fallback reliability
- No localStorage en server components para evitar hydration issues

### 2. **Client-Side Enhancement**

- Cliente puede override server template con localStorage data
- Solo después de hydration para evitar mismatches
- Smooth transitions (50ms) para mejor UX

### 3. **Dual-Sync Strategy**

- **Inmediato**: localStorage update para feedback instantáneo
- **Background**: Supabase sync para persistencia a largo plazo
- **Cross-tab**: localStorage events para sincronización entre tabs

### 4. **Admin-Centric UX**

- Admin permanece en panel `/allset/templates` sin redirects
- "Preview Home" button para verificar cambios
- Success messaging claro y actionable

## Flujo de Datos

```
Administrador → TemplateSelector → localStorage + Supabase
                                           ↓
Usuario → page.tsx (Server: Supabase) → ClientTemplateWrapper (Client: localStorage override)
                                           ↓
                                    Template Renderizado
```

## Reglas de Implementación

### ✅ **Permitido**

- localStorage en client components para enhanced UX
- Supabase como single source of truth para SSR
- Client override de server data después de hydration
- Background sync no-bloqueante para persistencia
- Cross-tab sync vía storage events

### ❌ **Prohibido**

- localStorage en server components (hydration issues)
- Redirects desde admin panel que rompan contexto
- Blocking API calls para template updates
- Complex cache invalidation strategies
- Server-side dependency en localStorage

## Lessons Learned

### **Approaches Fallidos** (Documentados para referencia)

1. **Pure Next.js cache invalidation**: `revalidatePath()` no funcionó consistentemente
2. **URL query params**: No deseado por UX (visible en URL)
3. **Pure server-side**: Sin feedback inmediato para admin
4. **Pure localStorage**: Sin persistencia cross-device

### **Approach Exitoso**: Híbrido

- Combina mejor de ambos mundos
- Mantiene simplicidad y reliability
- Escalable y maintainable
- Excellent UX tanto para admin como usuarios finales

## Métricas de Éxito

✅ **UX**: Template switching <50ms perceived time  
✅ **Reliability**: Funciona en 100% de browsers modernos  
✅ **SEO**: Server-side rendering consistente  
✅ **Persistence**: Cross-device sync via Supabase  
✅ **Admin**: No context loss, clear feedback  
✅ **Performance**: No infinite loops, optimal API usage

---

## Estrategia Histórica (2025-06-24)

- Diagnóstico: El sistema de archivos en Vercel no permite escritura persistente (read-only), por lo que toda configuración debe migrar a una base de datos cloud.
- Decisión: Supabase será la fuente de verdad para configuraciones globales y preferencias editables vía backend.
- El frontend solo usará localStorage/cookies para preferencias temporales o visuales, nunca para persistencia global.
- Todo endpoint que requiera guardar datos debe hacerlo vía Supabase.

### Reglas Históricas

- Prohibido escribir archivos en disco en producción serverless.
- Toda lógica de configuración global debe ser cloud-first.
- Documentar cada migración y batch en `progress.md`.

> Este archivo debe revisarse y actualizarse con cada decisión arquitectónica sobre persistencia.
