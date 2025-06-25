# BoothieCall - Diagramas Mermaid

Esta carpeta contiene los diagramas Mermaid que documentan la arquitectura y flujos del sistema BoothieCall.

## Archivos de Diagramas

### 1. `architecture-system-diagram.mmd`

**Diagrama Completo del Sistema**

- Arquitectura funcional y técnica integrada
- Módulos principales: AI Landing, Blog, Templates, Leads, Admin
- Infraestructura técnica: Next.js, Supabase, LLM integrations
- Features clave: Bilingüe, Mobile-first, SEO, GSAP
- Herramientas de desarrollo: TypeScript, Tailwind, Testing

### 2. `folder-structure-diagram.mmd`

**Estructura Detallada de Carpetas**

- Organización completa del proyecto
- Directorios principales: app/, components/, lib/, data/, memory-bank/
- Integraciones clave: Supabase, AI, Email, Themes
- Archivos de configuración y relaciones entre módulos

### 3. `template-update-fix-diagram.mmd`

**Documentación del Fix de Template Update (2025-06-25)**

- Problema anterior: Update no inmediato, requería refresh manual
- Solución implementada: 4 cambios específicos en APIs y configuración
- Resultado: Fix no funcionó, posibles causas identificadas
- Próximos pasos: Investigación adicional requerida

## Cómo Usar los Diagramas

### Visualización en VS Code

1. Instalar extensión "Mermaid Preview"
2. Abrir archivo `.mmd`
3. Usar `Ctrl+Shift+P` → "Mermaid: Preview"

### Visualización Online

1. Copiar contenido del archivo
2. Pegar en [mermaid.live](https://mermaid.live)
3. Ver diagrama renderizado

### Integración en Documentación

```markdown
\`\`\`mermaid
[contenido del archivo .mmd]
\`\`\`
```

## Mantenimiento

- **Actualizar diagramas** cuando se hagan cambios arquitectónicos significativos
- **Documentar fixes fallidos** para referencia futura y debugging
- **Sincronizar con architecture.md** para mantener consistencia
- **Versionar cambios** en progress.md

## Referencias

- Estos diagramas complementan la documentación en `architecture.md`
- Baseados en el protocolo ripperFive-Universal.mdc
- Integran feedback de arquitectura externa (imagen proporcionada)
- Documentan tanto éxitos como intentos fallidos para referencia completa

---

**Generado**: 2025-06-25  
**Protocolo**: ripperFive-Universal MODE: CODE  
**Estado**: Template update fix documentado (no funcional, investigación pendiente)
