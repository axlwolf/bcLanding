# BoothieCall - System Patterns

## Architecture Overview

### Core Framework: Astro + React Islands

```
Static Generation (Astro)
├── Pages (routing and SEO)
├── Layouts (shared structure)
├── Components (reusable UI)
└── Islands (interactive React components)
```

**Key Principle**: Minimal JavaScript delivery through Islands Architecture

- Static content rendered at build time
- Interactive components hydrated only when needed
- Performance-first approach with selective hydration

### Project Structure

```
src/
├── components/          # Reusable components
│   ├── ui/             # Base UI components (Button, Card, Input)
│   ├── layout/         # Layout components (Header, Footer, Nav)
│   ├── sections/       # Page sections (Hero, Features, Gallery)
│   └── islands/        # Interactive React components
├── pages/              # File-based routing
├── content/            # Blog posts and content
├── layouts/            # Page layouts
├── styles/             # Global styles and themes
├── utils/              # Utilities and helpers
├── stores/             # Nanostores for state
├── types/              # TypeScript definitions
└── assets/             # Static assets
```

## Component Architecture

### Design System Hierarchy

```
Design Tokens (JSON/CSS Custom Properties)
├── Colors, Typography, Spacing, Animations
│
UI Components (Base Layer)
├── Atomic components with consistent API
├── TypeScript interfaces for props
├── Accessibility built-in
│
Section Components (Composition Layer)
├── Combine UI components into sections
├── Handle section-specific logic
├── Responsive behavior
│
Page Components (Assembly Layer)
├── Compose sections into complete pages
├── Handle page-level state and routing
└── SEO and meta management
```

### Component Patterns

#### 1. UI Component Pattern

```typescript
// Base UI component with consistent API
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'ghost'
  size: 'sm' | 'md' | 'lg'
  disabled?: boolean
  children: React.ReactNode
}

// Always include Angular equivalent documentation
// Angular: Use Angular Material button with custom styling
```

#### 2. Island Component Pattern

```typescript
// Interactive components as React Islands
// Only hydrated when needed
// Minimal props interface
// Self-contained state management

// Example: Contact form, gallery filters, pricing calculator
```

#### 3. Layout Component Pattern

```typescript
// Consistent layout structure
// Slot-based content composition
// Responsive breakpoint handling
// Theme and language context provision
```

## State Management Patterns

### Nanostores for Client State

```typescript
// Lightweight atomic state management
// Perfect for theme, language, form state
// Framework agnostic (works with React islands)

// Pattern: One store per concern
export const themeStore = atom<'light' | 'dark'>('dark')
export const languageStore = atom<'es' | 'en'>('es')
export const bookingStore = map({
  step: 1,
  selectedPackage: null,
  formData: {},
})
```

### Angular Equivalent Pattern

```typescript
// Angular Services with BehaviorSubject
// Reactive state management
// Dependency injection pattern
```

## Styling Architecture

### Tailwind + Custom CSS Pattern

```scss
// CSS Custom Properties for design tokens
:root {
  --gold-primary: #d4af37;
  --gold-light: #f4e4bc;
  --gold-dark: #b8860b;
  --apple-transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

// Utility-first with custom components
@layer components {
  .btn-primary {
    @apply from-gold-primary to-gold-light bg-gradient-to-r text-black;
    transition: var(--apple-transition);
  }
}
```

### Theme Pattern

```typescript
// CSS custom properties for theming
// Dark/light mode with smooth transitions
// Consistent color usage across components
// Performance-optimized theme switching
```

## Animation Patterns

### GSAP Integration and Core Patterns

GSAP (GreenSock Animation Platform) is the primary library for complex animations and interactions. Animations are implemented directly in Astro component scripts.

- **Utility Setup**: A utility file (`src/utils/gsapUtils.ts`) exports the core `gsap` instance. Plugins like `ScrollTrigger` and `ScrollToPlugin` are imported and registered within the specific Astro components that use them.
- **Execution Context**: All GSAP scripts in Astro components are wrapped in `document.addEventListener('astro:page-load', () => { ... });` to ensure they run correctly during client-side navigation and after island hydration.

#### Pattern: Scroll-Triggered Entrance Animations

- **Description**: Elements within sections (e.g., headings, paragraphs, cards, images, islands) animate into view as the user scrolls down the page.
- **Implementation**: Uses GSAP core animations combined with `ScrollTrigger`.
- **Trigger**: Typically, animations are triggered when the top of the target section or element reaches 80% of the viewport height (`start: 'top 80%'`).
- **Effects**: Common effects include fade-in (`opacity`), upward/downward movement (`y` translation), and scaling (`scale`).
- **Example**:
  ```javascript
  // In an Astro component's script tag
  gsap.fromTo(
    element,
    { opacity: 0, y: 30, scale: 0.95 },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.8,
      scrollTrigger: { trigger: sectionElement, start: 'top 80%' },
    }
  )
  ```

#### Pattern: Hover Animations

- **Description**: Interactive elements like icons, buttons, or cards use subtle GSAP animations on mouse hover to provide visual feedback and enhance interactivity.
- **Implementation**: GSAP timelines are often used, created in a paused state. Event listeners (`mouseenter`, `mouseleave`) then play or reverse these timelines.
- **Effects**: Common effects include slight vertical movement (`y`), rotation (`rotate`), scaling (`scale`), or color/filter changes.
- **Example**:
  ```javascript
  // For an icon within a card
  const iconTimeline = gsap
    .timeline({ paused: true })
    .to(iconElement, { y: -5, rotate: 10, duration: 0.3, ease: 'power1.out' })
  cardElement.addEventListener('mouseenter', () => iconTimeline.play())
  cardElement.addEventListener('mouseleave', () => iconTimeline.reverse())
  ```

#### Pattern: Smooth Anchor Scrolling

- **Description**: Provides smooth scrolling for internal anchor links (e.g., primary navigation) instead of instant jumps.
- **Implementation**: Uses GSAP's `ScrollToPlugin`.
- **Trigger**: Click event listeners are attached to anchor links. `event.preventDefault()` stops the default jump, and GSAP animates the scroll.
- **Configuration**: `gsap.to(window, { duration: 1, scrollTo: { y: targetElement, offsetY: headerHeight }, ease: 'power2.inOut' });`
  - `duration`: Controls scroll speed.
  - `offsetY`: Accounts for fixed headers, ensuring the target section is not obscured.
  - `ease`: Defines the animation's easing function.

#### Pattern: Respecting User Motion Preferences

- **Description**: All GSAP animations (entrance, hover, scroll) must respect the user's operating system preference for reduced motion.
- **Implementation**: A check `window.matchMedia('(prefers-reduced-motion: reduce)').matches` is performed.
  - If `true`:
    - For entrance animations, elements are typically set to their final visible state instantly using `gsap.set()`.
    - For hover animations, the animation setup is skipped, or a non-animated static change is applied if necessary.
    - For smooth scrolling, the GSAP animation is skipped, allowing the browser's default (usually instant) anchor link behavior.
- **Importance**: Critical for accessibility and user experience.

### Angular Animation Equivalents

```typescript
// Angular Animations API
// CSS-in-JS alternatives
// Performance considerations
// State-driven animations
```

## Content Management Patterns

### Astro Content Collections

```typescript
// Type-safe content management
// Markdown/MDX support
// Automatic routing generation
// SEO optimization built-in

// Schema definition for type safety
const blogSchema = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum(['tips', 'events', 'technology']),
    publishDate: z.date(),
  }),
})
```

### i18n Pattern

```json
// Structured translation files
{
  "nav": {
    "services": "Servicios",
    "gallery": "Galería",
    "packages": "Paquetes",
    "contact": "Contacto"
  },
  "hero": {
    "title": "Captura Momentos Únicos",
    "subtitle": "Photo booths premium con tecnología de vanguardia"
  }
}
```

## Performance Patterns

### Critical Performance Strategies

1. **Image Optimization**: Astro's built-in image optimization
2. **Code Splitting**: Dynamic imports for animations and heavy components
3. **Preloading**: Strategic preloading of critical resources
4. **Bundle Analysis**: Regular bundle size monitoring

### Measurement Pattern

```typescript
// Core Web Vitals monitoring
// Lighthouse CI integration
// Performance budgets
// Real user monitoring preparation
```

## Data Flow Patterns

### Current (Client-Side)

```
User Interaction → Component State → UI Update
Form Submission → Email Service → User Feedback
```

### Future (Supabase Integration)

```
User Action → Client State → Supabase API → Database
Real-time Updates → Supabase Subscription → Client Update
Authentication → Supabase Auth → Protected Routes
```

## Error Handling Patterns

### Client-Side Error Boundaries

```typescript
// React error boundaries for islands
// Graceful degradation
// User-friendly error messages
// Development vs production behavior
```

### Form Validation Pattern

```typescript
// Zod schema validation
// Real-time feedback
// Accessibility considerations
// Multi-language error messages
```

## Testing Patterns

### Component Testing Strategy

```typescript
// Unit tests for utility functions
// Component testing for UI components
// Integration tests for user flows
// Visual regression testing for design consistency
```

### Angular Testing Equivalents

```typescript
// Angular Testing Utilities
// Karma/Jasmine setup
// Component testing strategies
// Service testing patterns
```

## Build and Deployment Patterns

### Build Optimization

```typescript
// Static site generation
// Bundle optimization
// Asset optimization
// SEO generation
```

### Deployment Strategy

```typescript
// Static hosting (Vercel/Netlify)
// CDN optimization
// Environment configuration
// Performance monitoring
```

## Documentation and Development Workflow Patterns

### Post-Feature Documentation Pattern (MANDATORY)

```typescript
// This workflow MUST be executed after EVERY feature implementation
// NO EXCEPTIONS - This is a critical pattern for project maintainability

interface PostFeatureWorkflow {
  1. updateMemoryBank: {
    activeContext: "Update current status and next steps",
    progress: "Mark completed items and update metrics",
    strategy?: "Update if strategic changes occurred",
    techContext?: "Update if dependencies or tech stack changed",
    systemPatterns?: "Add new patterns discovered"
  }

  2. updateReadme: {
    features: "Document new capabilities",
    roadmap: "Update phase progress",
    architecture?: "Note architectural changes",
    dependencies?: "Update if packages changed"
  }

  3. reviewConsistency: {
    allFiles: "Ensure all memory bank files are consistent",
    references: "Update any outdated references",
    lessons: "Document lessons learned"
  }

  4. commitChanges: {
    documentation: "Must be current before commit",
    message: "Comprehensive with progress metrics",
    reference: "Include completed checklist items"
  }
}

// Example implementation
const completeFeature = async (feature: string) => {
  // 1. Implement feature code
  await implementFeature(feature);

  // 2. MANDATORY: Update all documentation
  await updateMemoryBank({
    activeContext: true,
    progress: true,
    // ... other files as needed
  });

  await updateReadme();

  // 3. ONLY THEN commit
  await gitCommit({
    message: `feat: ${feature} - Items X-Y completed (Z% progress)`,
    files: ['src/', 'memory-bank/', 'README.md']
  });
};
```

### Memory Bank Pattern

```typescript
// Memory bank serves as the source of truth for project state
// Must be kept accurate for session resets
// All major decisions and patterns must be documented

const memoryBankStructure = {
  core: [
    'projectbrief.md', // Foundation document
    'productContext.md', // Why and how
    'activeContext.md', // Current state
    'systemPatterns.md', // Technical patterns
    'techContext.md', // Technology stack
    'progress.md', // Implementation tracking
  ],
  optional: [
    'strategy.md', // Strategic decisions
    'lessons.md', // Lessons learned
    // ... other context-specific files
  ],
}
```

### Batching Pattern for Development (MANDATORY)

```typescript
// CRITICAL: Prevents model exhaustion and credit depletion
// Must be followed for ALL implementation work

interface BatchingStrategy {
  maxItemsPerBatch: 3-5,  // Never exceed 5 items
  maxResponseLength: "50% of model limit",
  pauseBetweenBatches: true,

  batchingRules: [
    "Maximum 3-5 items per batch",
    "Each batch must be self-contained and functional",
    "Pause between batches to verify progress",
    "Document completion before starting next batch",
    "If response exceeds 50% of limit, split into sub-batches"
  ],
  rules: [
    "Each batch must be self-contained and functional",
    "Document completion before starting next batch",
    "If response exceeds 50% limit, split into sub-batches",
    "Always provide batch summary at end",
    "User must approve each batch before proceeding"
  ],

  benefits: [
    "Prevents model exhaustion",
    "Preserves user credits",
    "Allows progress verification",
    "Maintains code quality",
    "Enables better error recovery"
  ]
}

// Example batch structure
const implementationBatch = {
  batchNumber: 1,
  batchName: "Critical Fixes",
  items: [
    "Fix corrupted file",
    "Update configuration",
    "Test functionality"
  ],
  estimatedResponseSize: "Small",
  requiresUserApproval: true
};
```
