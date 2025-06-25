# 📸 BoothieCall – Premium AI Landing Pages

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT 'MIT License')
![GitHub repo size](https://img.shields.io/github/repo-size/axlwolf/boothiecall)
[![Active](http://img.shields.io/badge/Status-Active-green.svg)](https://github.com/axlwolf/boothiecall)
[![Generic badge](https://img.shields.io/badge/lang-typescript-blue.svg)](https://www.typescriptlang.org/)
[![Generic badge](https://img.shields.io/badge/framework-next.js%2014+-black.svg)](https://nextjs.org/)
[![Generic badge](https://img.shields.io/badge/styles-tailwind%20css%203.4+-teal.svg)](https://tailwindcss.com/)
[![Generic badge](https://img.shields.io/badge/ai-powered-yes-purple.svg)](https://github.com/axlwolf/boothiecall)
[![Generic badge](https://img.shields.io/badge/last%20updated-06--2025-blue)](https://github.com/axlwolf/boothiecall)

![BoothieCall Logo](public/logo.svg)

BoothieCall es una landing page premium para renta de photo booth, enfocada en eventos de lujo y experiencia de usuario excepcional. Esta nueva versión está construida 100% en Next.js, integrando IA, microinteracciones avanzadas y las mejores prácticas de frontend moderno.

> **Nota:** La documentación oficial y fuente de verdad vive en la carpeta `memory-bank`. El README es solo referencia rápida; cualquier cambio relevante debe reflejarse primero en los `.mdc` y `.md` de `memory-bank`.

---

## 🚀 Features

- **Landing Page Modular:** Hero, features, galería, precios, testimonios, contacto
- **Generación de contenido AI:** Textos y blogs SEO optimizados vía OpenAI, Gemini, Deepseek, Ollama
- **Blog System:** Generación y edición de posts en MDX
- **Panel Admin Ready:** Estructura para dashboard y gestión futura
- **Animaciones premium:** Microinteracciones GSAP, scroll y hover, respetando accesibilidad
- **Temas:** Light/dark y soporte para custom themes
- **Mobile-first & Responsive:** Experiencia perfecta en cualquier dispositivo
- **SEO avanzado:** Meta tags automáticos, performance óptima
- **Internacionalización:** Español e inglés listos, adaptable a más idiomas
- **Integraciones:** Analytics, email, CRM, newsletter

---

## 🏛️ Arquitectura

BoothieCall es modular, extensible y AI-powered. Toda decisión arquitectónica se documenta en `memory-bank/architecture.md`.

- **Next.js 14+**: App Router, server components, API routes
- **Tailwind CSS**: Tematización rápida y consistente
- **GSAP**: Animaciones y microinteracciones avanzadas
- **Contentlayer/MDX**: Gestión de contenido y blog
- **React Context/Zustand**: Estado global
- **Jest, Playwright, Testing Library**: Testing robusto
- **Supabase (futuro)**: Backend, auth y realtime
- **Vercel**: Deploy principal, con Netlify/Railway como alternativas

### Flujos principales

- **Generación landing (AI):** Estructura JSON modular, bloques rearrangables, animaciones GSAP
- **Blog AI:** Creación automática de posts SEO, estructura modular
- **Recepción de leads y analítica:** Captura en tiempo real, notificaciones, integración con CRM/email
- **Admin Panel:** Gestión de usuarios, roles, contenido y analítica
- **Extensibilidad:** CLI, dashboard, plugins, multi-cloud y multi-LLM

---

## 🗂️ Estructura del Proyecto

```
project-root/
├── app/                     # App Router de Next.js
│   ├── (landing)/           # Secciones principales (Hero, Features, Gallery...)
│   ├── (blog)/              # Blog y posts MDX
│   ├── (admin)/             # Panel admin (futuro)
│   ├── api/                 # API routes (leads, emails, etc)
│   └── layout.tsx           # Layout global
├── components/              # Componentes UI reutilizables
├── lib/                     # Utilidades, hooks, helpers, gsapUtils.ts
├── public/                  # Assets estáticos (logo, imágenes, fuentes)
├── styles/                  # Tailwind config, temas, CSS global
├── memory-bank/             # 📚 Fuente de verdad (documentación viva)
│   ├── activeContext.md
│   ├── architecture.md
│   ├── productContext.md
│   ├── progress.md
│   ├── projectbrief.md
│   ├── systemPatterns.md
│   ├── techContext.md
│   └── ...
├── tests/                   # Pruebas unitarias y E2E
├── .env*                    # Variables de entorno
├── package.json             # Dependencias y scripts
└── README.md                # Esta referencia
```

---

## 📚 Documentación y Fuente de Verdad

La carpeta `memory-bank/` contiene:

- **projectbrief.md:** Resumen y objetivos
- **productContext.md:** Justificación, user journey, UX goals
- **architecture.md:** Arquitectura modular y flujos
- **techContext.md:** Stack y decisiones técnicas
- **systemPatterns.md:** Patrones de desarrollo y batching
- **progress.md:** Roadmap y milestones
- **activeContext.md:** Estado actual del desarrollo

> **Toda decisión relevante debe documentarse aquí antes de reflejarse en el código o el README.**

---

## 🛠️ Stack Tecnológico

- **Next.js 14+** (App Router, SSR/SSG, API routes)
- **React 18**
- **TypeScript**
- **Tailwind CSS 3.4+**
- **GSAP 3.12+** (microinteracciones, animaciones scroll/hover)
- **Contentlayer/MDX** (blog y contenido)
- **Zustand / React Context** (estado global)
- **Jest, Playwright, Testing Library** (testing)
- **Supabase** (futuro backend, auth, realtime)
- **Vercel** (deploy principal)

---

## ⚡ Getting Started

### Prerequisitos

- Node.js 18+
- npm o bun
- API keys para proveedor LLM (OpenAI, Gemini, etc)

### Instalación

1. Clona el repositorio:
   ```bash
   git clone https://github.com/axlwolf/boothiecall.git
   cd boothiecall
   ```
2. Instala dependencias:
   ```bash
   npm install
   # o
   bun install
   ```
3. Copia el archivo de entorno:
   ```bash
   cp .env.example .env.local
   ```
4. Configura tus variables de entorno:
   ```env
   # LLM Providers
   OPENAI_API_KEY=your_key_here
   OPENAI_MODEL=gpt-4-turbo-preview
   GEMINI_API_KEY=your_key_here
   GEMINI_MODEL=gemini-pro
   NEXT_PUBLIC_SITE_URL=your_site_url
   ```
5. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   # o
   bun run dev
   ```

---

## 🎨 Temas y Microinteracciones

- Soporte light/dark y temas personalizados (ver ThemeProvider y systemPatterns.md)
- Animaciones GSAP en todas las secciones (Hero, Why, Gallery, Pricing, Testimonials, Contact, FAQ)
- Hover effects y smooth scrolling
- Todas las animaciones respetan `prefers-reduced-motion`

---

## 🧪 Testing

- **Unit tests:** Jest + @testing-library/react
- **E2E tests:** Playwright
- **Visual regression:** (futuro)
- **Patrón de batching:** Seguir systemPatterns.md para batches y pruebas
- **Documentación:** Ver `memory-bank/progress.md` y `systemPatterns.md`

---

## 🚀 Deployment

### Vercel

- Root: raíz del repo (donde está package.json y app/)
- Output: `.next` (detectado automáticamente)
- public/: solo assets estáticos
- Ventajas: deploy automático, CDN global, serverless, previews, analytics

### Alternativas

- **Netlify:** Ideal para sitios estáticos
- **Railway:** Full-stack, base de datos incluida
- **DigitalOcean App Platform:** Más control y configuración

---

## 📅 Roadmap

1. **Fase 1:** Implementación Next.js (actual)
2. **Fase 2:** Refactor admin dashboard y booking avanzado
3. **Fase 3:** Headless CMS para edición rápida
4. **Fase 4:** Optimización avanzada, internacionalización, AI features

---

## 🏷️ Licencia

MIT. Ver LICENSE para detalles.

A Next.js-based landing page generator that uses AI to create compelling content for your business or product. Generate landing pages and SEO-optimized blog posts with minimal effort.

## Features

### Landing Page Generation

- 2-3 pre-designed, professional templates
- AI-powered content generation based on your business description
- Customizable color schemes and font presets
- Dynamic content rendering from JSON structure
- Mobile-responsive designs

### Blog Generation

- AI-generated SEO-optimized blog posts
- Basic CMS functionality (draft/publish, delete)
- MDX file format for manual editing
- Automated meta tags for SEO

### Admin Panel

- User-friendly interface for content generation
- Template selection and customization
- Blog post management
- Analytics integration

### AI Integration

Supported LLM Providers:

- OpenAI (and compatible: Deepseek, Ollama)
- Google Gemini

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- MDX for blog content
- Content Layer for MDX processing

## Getting Started

### Prerequisites

- Node.js 18+
- NPM package manager o Bun package manager
- API keys for chosen LLM provider

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/project-name.git
```

2. Install dependencies:

```bash
npm install
```

```bash
bun install
```

3. Copy the example environment file:

```bash
cp .env.example .env.local
```

4. Configure your environment variables:

```env
# OpenAI and Compatible Providers
OPENAI_API_KEY=your_key_here
OPENAI_MODEL=gpt-4-turbo-preview

# Google Gemini
GEMINI_API_KEY=your_key_here
GEMINI_MODEL=gemini-pro

# Other Configuration
NEXT_PUBLIC_SITE_URL=your_site_url
```

5. Start the development server:

```bash
npm run dev
```

```bash
bun run dev
```

### Configuration

#### LLM Providers

Configure your preferred LLM provider in `.env.local`. The system supports:

- OpenAI (and compatible):
  - OpenAI
  - Deepseek
  - Ollama
- Google Gemini

#### Analytics

Analytics configuration can be modified in `data/siteMetadata.js`. Supported providers:

- Umami Analytics
- Plausible
- Simple Analytics
- PostHog
- Google Analytics

## Usage

1. Access the admin panel at `/admin`
2. Input your business/product description
3. Choose a template
4. Generate landing page content
5. Customize colors and fonts
6. Generate complementary blog posts
7. Publish your content

## Directory Structure

```
├── app/                  # Next.js app directory
├── components/          # React components
├── data/               # MDX blog posts and site metadata
├── public/             # Static assets
├── styles/            # Tailwind CSS styles
├── lib/               # Utility functions and LLM interfaces
└── admin/             # Admin panel pages
```

## License

This is commercial software. The use of this template is subject to the purchase
of a commercial license. Unauthorized copying, modification, distribution, or use
of this software is strictly prohibited.

### License Terms

- One license per production website
- 12 months of updates and support
- Documentation access
- Private source code access

# Supabase Setup

If you want to use Supabase as your database backend, follow these steps:

## 1. Set Environment Variables

In your `.env.local` file, set:

```
DB_PROVIDER=supabase
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
```

## 2. Supabase Database Setup

### Create the Emails Table in Supabase

You can do this via the Supabase web UI, or run the following SQL in the Supabase SQL Editor:

```sql
create table if not exists allset_emails (
  id bigint generated by default as identity primary key,
  email text unique not null,
  created_at timestamp with time zone default now()
);
```

### Create the Email Template Data Table in Supabase

To store dynamic email template data, create the following table (via the Supabase SQL Editor or web UI):

```sql
create table if not exists allset_email_template_data (
  id bigint generated by default as identity primary key,
  template text not null,
  data text not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
```

- `id`: Primary key
- `template`: Name of the template (required)
- `data`: JSON stringified template data (required)
- `created_at`: Timestamp of creation
- `updated_at`: Timestamp of last update

### Create the CTA Configuration Table in Supabase

To store the CTA (Call To Action) configuration for the signup flow, run the following SQL in the Supabase SQL Editor or web UI:

```sql
create table if not exists allset_cta_config (
  id bigint generated by default as identity primary key,
  cta_type text not null, -- 'ebook-delivery', 'newsletter', or 'welcome'
  template_data_id bigint not null references allset_email_template_data(id),
  newsletter_frequency text, -- 'daily', 'weekly', 'monthly' (nullable)
  updated_at timestamp with time zone default now()
);
```

- `id`: Primary key
- `cta_type`: Type of CTA: 'ebook-delivery', 'newsletter', or 'welcome' (required)
- `template_data_id`: Foreign key to `allset_email_template_data(id)` (required)
- `newsletter_frequency`: Frequency for newsletter: 'daily', 'weekly', 'monthly' (nullable/optional)
- `updated_at`: Timestamp when config was last updated

### Create the Contact Submissions Table in Supabase

To store contact form submissions, create the following table (via the Supabase SQL Editor or web UI):

```sql
create table if not exists allset_contact_submissions (
  id bigint generated by default as identity primary key,
  name text,
  email text not null,
  message text not null,
  created_at timestamp with time zone default now()
);
```

- `id`: Primary key
- `name`: Name of the user (optional)
- `email`: Email address (required)
- `message`: Message from the user (required)
- `created_at`: Timestamp of submission

### (Optional) Add RLS Policy for Emails and Contact Submissions

To allow unrestricted access for development, run:

```sql
-- Enable RLS
alter table allset_emails enable row level security;
-- Allow all (development only)
create policy "Allow all" on allset_emails for all using (true);
```

```sql
-- Enable RLS
alter table allset_contact_submissions enable row level security;
-- Allow all (development only)
create policy "Allow all" on allset_contact_submissions for all using (true);
```

For production, restrict access as needed.

---

**Now your project will use Supabase for all email operations!**

If you add more tables, follow this pattern for each new table.

## Actualización: Gestión de Posts y Generador de Títulos (junio 2025)

### Nueva página de gestión de posts

- Se ha añadido la página `/allset/posts` para la gestión de entradas de blog.
- Permite ver, editar, eliminar y crear nuevos posts desde una interfaz amigable.
- Incluye confirmación visual y mensajes de éxito/error al eliminar posts.
- El borrado de posts se realiza mediante una llamada a `/api/allset/posts/delete`.

### Generador de títulos de blog

- Se integra el componente `BlogTitleGenerator` en la página de gestión de posts.
- Permite generar títulos sugeridos para nuevas entradas de blog usando IA.

### Rutas relevantes

- `/allset/posts` — Listado y gestión de posts.
- `/allset/posts/new` — Crear nuevo post.
- `/allset/posts/edit?slug=...` — Editar post existente.

# Guía de Deployment en Vercel

## Pasos para deployar tu aplicación en Vercel

### 1. Crear cuenta en Vercel

- Ve a [vercel.com](https://vercel.com)
- Regístrate con tu cuenta de GitHub

### 2. Importar tu proyecto

- En el dashboard de Vercel, haz clic en "New Project"
- Selecciona "Import Git Repository"
- Busca y selecciona tu repositorio `bcLanding`
- Haz clic en "Import"

### 3. Configurar variables de entorno

En la sección "Environment Variables" de Vercel, agrega estas variables:

#### Variables obligatorias:

```
ADMIN_USERNAME=tu_usuario_admin
ADMIN_PASSWORD=tu_password_admin
LLM_API_PROVIDER=openai
LLM_API_KEY=tu_api_key_de_openai
LLM_MODEL=gpt-3.5-turbo
EMAIL_HOST=smtp.zoho.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=tu@email.com
EMAIL_PASSWORD=tu_password_de_email
EMAIL_FROM_EMAIL=tu@email.com
EMAIL_FROM_NAME=Tu Nombre
NEXT_PUBLIC_SITE_URL=https://tu-sitio.vercel.app
NEXT_PUBLIC_SITE_NAME=Tu Sitio
DB_PROVIDER=sqlite
```

#### Variables opcionales (para newsletters):

```
BUTTONDOWN_API_KEY=tu_buttondown_key
# O si usas otra plataforma de newsletter:
MAILCHIMP_API_KEY=tu_mailchimp_key
MAILCHIMP_API_SERVER=tu_servidor
MAILCHIMP_AUDIENCE_ID=tu_audience_id
```

### 4. Configuración de build

Vercel detectará automáticamente que es un proyecto Next.js y usará:

- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

### 5. Deploy

- Haz clic en "Deploy"
- Vercel construirá y desplegará tu aplicación
- Recibirás una URL como `https://bc-landing-123.vercel.app`

### 6. Configurar dominio personalizado (opcional)

- En el dashboard del proyecto en Vercel
- Ve a la pestaña "Settings" > "Domains"
- Agrega tu dominio personalizado

---

## Notas importantes sobre el deployment en Vercel

- **Root Directory**: Debe ser la raíz del repositorio, donde se encuentra tu `package.json`, la carpeta `app/`, etc. (No selecciones la carpeta `public` como root).
- **Output Directory**: Para Next.js, Vercel detecta automáticamente `.next` como directorio de salida del build. No necesitas cambiarlo manualmente.
- **Carpeta `public/`**: Solo contiene archivos estáticos (imágenes, fuentes, etc.) que se sirven tal cual. El build de la app (código compilado, páginas, serverless functions) se genera en `.next`, no en `public`.

> Si tienes dudas, deja la configuración por defecto de Vercel para proyectos Next.js: solo asegúrate de que el root apunte a la raíz del repo y no a una subcarpeta.

## Funcionalidades que estarán disponibles:

✅ **Landing page principal** - Completamente funcional
✅ **Blog posts** - Generación estática
✅ **APIs dinámicas** - Para formularios y funcionalidades admin
✅ **Panel de administración** - Con autenticación
✅ **Generación de contenido IA** - Si configuras las API keys
✅ **Sistema de emails** - Para formularios de contacto
✅ **Newsletter** - Si configuras el proveedor

## Alternativas a Vercel:

### Netlify

- Similar a Vercel, gratis para proyectos personales
- Mejor para sitios estáticos, menos optimizado para APIs

### Railway

- Ideal para aplicaciones full-stack
- Base de datos incluida
- Plan gratuito con límites generosos

### DigitalOcean App Platform

- Más control y configuración
- Ideal para aplicaciones complejas

## Ventajas de Vercel para tu proyecto:

1. **Optimizado para Next.js** - Es del mismo equipo
2. **Deploy automático** - Cada push a main despliega automáticamente
3. **Gratis** - Hasta 100 deployments por mes
4. **CDN global** - Carga rápida mundial
5. **Funciones serverless** - Tus APIs funcionarán perfectamente
6. **Preview deployments** - Cada PR crea un preview
7. **Analytics incluido** - Métricas de performance

¡Tu aplicación estará lista en minutos! 🚀
