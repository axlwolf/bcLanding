# Active Context: BoothieCall Project Reset

**Date:** 2025-06-20

**Current Work Focus:**

- Implementación y validación de componentes UI base (Card, Input, Modal) siguiendo Atomic Design y Tailwind `@apply`.
- Integración y showcase de estos componentes en la página `design-system-preview.astro`.
- Modal accesible y funcional usando `<dialog>` nativo, con cierre por botón, Escape y clic fuera (backdrop).
- Limpieza de islands para cumplir con buenas prácticas y evitar estilos inline/lint errors.

**Recent Achievements (Jun 20):**

- `Card.astro` e `Input.astro` creados y documentados en el sistema de diseño.
- `Modal.tsx` refactorizado para usar `<dialog>`, con cierre robusto y accesible.
- Island `ModalDemo.tsx` limpio y funcional.
- Todos los componentes base probados visualmente y funcionales en `/design-system-preview`.
- **Implemented GSAP-based micro-interactions and animations across the landing page. This includes scroll-triggered entrance animations for all sections (Hero, Why, Packages, Testimonials, Contact, FAQ), hover effects for feature icons and the main logo, and smooth scrolling for internal anchor navigation. All animations respect `prefers-reduced-motion`.**

**Testing Roadmap:**

- Al concluir los batches de todas las secciones de la landing, se integrarán Jest (islands/lógica), @astrojs/test (componentes Astro) y Playwright (E2E), y se documentará en el memory bank y archivos de progreso.
- **Visual testing and refinement of GSAP animations across different browsers/devices.**

**System State:**

- Astro 4, React islands, Tailwind CSS, estructura y tokens globales intactos.
- CSS strategy: Atomic Design + Tailwind `@apply` en clases semánticas.
- **GSAP integrated for animations.**
- Sin errores de lint ni de sintaxis en islands ni en `.astro`.

**Next Steps:**

- **Conclude GSAP animation implementation and documentation.**
- Documentar progreso y realizar commit.
- Evaluate remaining tasks for Phase 1 MVP completion (e.g., Gallery, Pricing sections if not yet complete, or further component improvements).
