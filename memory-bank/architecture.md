# BoothieCall – Architecture Overview

## Modular, AI-Driven Architecture

BoothieCall is designed as a modular, extensible, AI-powered platform for launching and managing high-conversion landing pages and related digital products. The architecture leverages Next.js for scalability, modern best practices, and seamless integration with AI and cloud services.

---

## System Architecture Diagrams

### Complete System Architecture

_Ver diagrama Mermaid "BoothieCall - Arquitectura Completa del Sistema" para visualización interactiva_

### Project Structure

_Ver diagrama Mermaid "BoothieCall - Estructura de Carpetas Detallada" para estructura técnica_

---

## Template Switching System (Hybrid Architecture)

### **Implementation Overview (2025-06-25)**

The template switching system uses a hybrid localStorage + Supabase architecture that provides immediate user feedback while maintaining data persistence and cross-device synchronization.

### **Architecture Components**

#### **1. Server-Side Rendering (`app/page.tsx`)**

- **Purpose**: Consistent initial page render
- **Data Source**: Supabase only (no localStorage to avoid SSR issues)
- **Output**: Passes `serverTemplate` to client wrapper
- **SEO**: Ensures search engines see consistent content

#### **2. Client-Side Enhancement (`ClientTemplateWrapper.tsx`)**

- **Purpose**: Override server template with localStorage data
- **Timing**: After React hydration to avoid mismatch
- **Logic**:
  ```typescript
  const finalTemplate = localStorage.template || serverTemplate
  ```
- **Transitions**: 50ms smooth loading state when switching

#### **3. Hybrid Storage (`lib/templateStorage.ts`)**

- **Immediate Update**: localStorage for instant UI changes
- **Background Sync**: Non-blocking Supabase update for persistence
- **Cross-Tab Sync**: localStorage events for tab synchronization
- **Fallback**: Graceful degradation if localStorage unavailable

#### **4. Admin Interface (`TemplateSelector.tsx`)**

- **UX**: User remains in admin panel after changes
- **Feedback**: Success message + "Preview Home" button
- **Update Flow**: localStorage → UI feedback → Background Supabase sync

### **Data Flow Diagram**

```
┌────────────────────┐
│    Admin Panel       │
│  /allset/templates   │
└─────────┬─────────┘
           │
           │ User selects template
           ↓
┌────────────────────┐
│  TemplateStorage    │
│                    │
│ 1. localStorage →   │
│ 2. Supabase sync    │
└─────────┬─────────┘
           │
           │ User visits home
           ↓
┌────────────────────┐
│     page.tsx        │
│                    │
│ Server: Supabase   │
│ Client: localStorage│
└─────────┬─────────┘
           │
           ↓
┌────────────────────┐
│   Template Render   │
│                    │
│ Main, Main2, etc.  │
└────────────────────┘
```

### **Benefits of Hybrid Approach**

✅ **Immediate Updates**: localStorage provides instant UI feedback  
✅ **SSR Compatibility**: Server renders consistent content for SEO  
✅ **Cross-Device Sync**: Supabase ensures persistence across sessions  
✅ **Cross-Tab Sync**: localStorage events synchronize open tabs  
✅ **Fallback Resilient**: Works even if localStorage is unavailable  
✅ **Admin UX**: No page refreshes or loss of admin context

### **Performance Characteristics**

- **Initial Load**: Fast server rendering from Supabase
- **Template Switch**: <50ms localStorage update + smooth transition
- **Background Sync**: Non-blocking Supabase persistence
- **Cross-Tab**: Instant propagation via storage events
- **Memory Usage**: Minimal (single template ID in localStorage)

---

## Main Modules & Flows

### 1. Landing Page Generation (AI-powered)

- **Location**: `app/api/allset/`, templates/
- Dynamic, JSON-driven page structure (sections, CTAs, pricing, testimonials, FAQ, etc.)
- Modular content blocks: easily rearranged, extended, or generated via AI
- Animations and micro-interactions powered by GSAP, respecting accessibility
- Multi-language and theme support
- **Templates**: Main.tsx, Main2-6.tsx with different layouts

### 2. Blog Post Generation (AI-powered)

- **Location**: `data/blog/`, lib/llm/
- Automated, SEO-optimized content creation
- Modular blog structure (title, tags, content, images, CTAs)
- AI-assisted content review, structure, and optimization
- **Content Management**: Contentlayer/MDX integration

### 3. Lead Reception & Analytics

- **Location**: `app/api/email/`, `app/api/newsletter/`
- Real-time lead capture, analytics, and notifications
- Supabase integration for persistent storage
- Integrations for email, CRM, or custom workflows
- Configurable lead forms and tracking across landing pages

### 4. Admin Panel

- **Location**: `app/allset/`
- User and role management
- Template and configuration management
- AI-powered content and workflow management
- Dashboard for analytics, content, and configuration

### 5. Configuration & Extensibility

- **Location**: `lib/config.ts`, `data/config/`
- **Persistence**: Supabase-first, SQLite fallback
- Cloud-agnostic: deployable on Vercel, Netlify, Railway, or custom cloud
- LLM connector for AI (OpenAI, Google, Azure, Ollama, etc.)
- Modular dashboard and plugin system
- Starter templates and theme system

---

## Technical Stack Implementation

### Frontend Layer

- **Framework**: Next.js 15+ (App Router, Server Components)
- **Styling**: Tailwind CSS 4+ with custom golden theme
- **Animations**: GSAP for micro-interactions
- **Components**: Modular component system in `components/`
- **Layouts**: Flexible layout system in `layouts/`

### Backend Layer

- **API Routes**: Next.js API routes in `app/api/`
- **Database**: Supabase (primary), SQLite (development)
- **Email**: Nodemailer integration
- **AI Integration**: Multiple LLM providers in `lib/llm/`

### Content Management

- **Blog System**: Contentlayer/MDX for content processing
- **Static Content**: JSON-driven configuration
- **Internationalization**: Bilingual ES/EN support
- **Media**: Next.js Image optimization

### Development & Testing

- **Language**: TypeScript with strict type checking
- **Testing**: Jest (unit), Playwright (E2E)
- **Code Quality**: ESLint, Prettier, Husky
- **Analytics**: Vercel Analytics integration

---

## Key Architecture Patterns

### 1. **Configuration-Driven Design**

- All templates and themes configured via JSON
- Supabase as single source of truth for configuration
- Runtime template switching without deployment

### 2. **AI-First Content Generation**

- Pluggable LLM providers for flexibility
- Structured content generation (JSON + Markdown)
- AI-assisted optimization and testing

### 3. **Mobile-First Responsive**

- Tailwind CSS utility-first approach
- GSAP animations with accessibility considerations
- Progressive enhancement pattern

### 4. **Cloud-Native Persistence**

- Serverless-compatible data layer
- No filesystem writes in production
- Supabase for scalable data persistence

---

## Directory Structure Overview

```
bcLanding/
├── app/                    # Next.js App Router
│   ├── api/               # API endpoints
│   │   ├── allset/        # Admin/config APIs
│   │   ├── email/         # Email processing
│   │   ├── newsletter/    # Subscription management
│   │   └── templates/     # Template APIs
│   ├── Main.tsx          # Main page templates
│   ├── Main2-6.tsx       # Additional templates
│   └── layout.tsx        # Root layout
├── components/            # Reusable UI components
├── lib/                   # Core business logic
│   ├── config.ts         # Configuration management
│   ├── supabaseClient.ts # Database client
│   ├── llm/              # AI integration
│   ├── email/            # Email utilities
│   └── providers/        # External service providers
├── data/                  # Static content and config
│   ├── config/           # Site configuration
│   ├── blog/             # Blog content
│   └── landingContent.json # Page content
├── memory-bank/           # Project documentation
│   ├── ripperFive-Universal.mdc # Development protocol
│   ├── architecture.md   # This file
│   └── progress.md       # Development progress
└── templates/            # Page templates
```

---

## Integration Points

### External Services

- **Supabase**: Primary database and real-time features
- **Vercel**: Deployment and analytics
- **AI APIs**: OpenAI, Google Gemini for content generation
- **Email Service**: Nodemailer for transactional emails

### Internal Modules

- **Theme System**: Dynamic light/dark mode switching
- **Template Engine**: JSON-driven page generation
- **Content Pipeline**: AI → JSON → Components → Pages
- **Lead Pipeline**: Forms → Validation → Storage → Notifications

---

## Extensibility & Future-Proofing

- **Plugin Architecture**: Modular component system
- **Multi-Cloud Support**: Cloud-agnostic design patterns
- **Multi-LLM Support**: Pluggable AI provider system
- **Template Marketplace**: Extensible template system
- **Open Source Ready**: CLI and documentation for community

---

> **Updated**: 2025-06-25 - This architecture overview is the single source of truth for system-level decisions. Any new feature or architectural change must be reflected here and in the related technical documentation. Mermaid diagrams provide visual representation of system architecture and folder structure.
