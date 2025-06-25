# BoothieCall - Vercel Deployment Errors and Solutions (June 2025)

## 🐛 Production Errors Fixed

### 1. 401 Unauthorized - site.webmanifest

```
GET https://bc-landing-74sv2l93y-axlwolfs-projects.vercel.app/static/favicons/site.webmanifest 401 (Unauthorized)
Manifest fetch from https://bc-landing-74sv2l93y-axlwolfs-projects.vercel.app/static/favicons/site.webmanifest failed, code 401
```

**Root Cause:**

- Middleware blocking access to static public files
- Missing explicit public path configuration

**Solution Applied:**

1. **Updated middleware.ts** to whitelist public paths:

```typescript
const publicPaths = [
  '/static',
  '/images',
  '/_next',
  '/favicon',
  '/robots.txt',
  '/sitemap.xml',
  '/manifest.json',
  '/site.webmanifest',
]

// Check if path is public
const isPublicPath = publicPaths.some((path) => pathname.startsWith(path))
if (isPublicPath) {
  return NextResponse.next()
}
```

2. **Created vercel.json** with proper headers:

```json
{
  "headers": [
    {
      "source": "/static/favicons/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        },
        {
          "key": "Access-Control-Allow-Origin",
          "value": "*"
        }
      ]
    }
  ]
}
```

---

### 2. 500 Internal Server Error - Template Update API

```
POST https://bc-landing-74sv2l93y-axlwolfs-projects.vercel.app/api/allset/templates/update 500 (Internal Server Error)
```

**Root Cause:**

- Missing Supabase environment variables in Vercel
- Table `site_config` not created in Supabase
- No error handling for missing configuration

**Solution Applied:**

1. **Enhanced API error handling** in `/app/api/allset/templates/update/route.ts`:

```typescript
// Check environment variables
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.error('[API] Supabase environment variables not configured')
  return NextResponse.json(
    {
      success: false,
      message: 'Database configuration error. Please check Supabase environment variables.',
      error: 'SUPABASE_CONFIG_ERROR',
    },
    { status: 500 }
  )
}

// Specific error handling
if (errorMessage.includes('does not exist')) {
  return NextResponse.json(
    {
      success: false,
      message: 'Database table "site_config" does not exist. Please run the database setup.',
      error: 'TABLE_NOT_FOUND',
      details: errorMessage,
    },
    { status: 500 }
  )
}
```

2. **Added runtime configuration** with dynamic mode:

```typescript
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
```

3. **Created verification script** `scripts/verify-supabase.mjs`:

```bash
npm run verify-supabase
```

---

### 3. Build Error - supabaseUrl is required

```
Error: supabaseUrl is required
    at createClient (./node_modules/@supabase/supabase-js/dist/main/index.js:35:15)
```

**Root Cause:**

- Environment variables not available during build time
- No fallback for missing configuration

**Solution Applied:**

1. **Updated lib/supabaseClient.ts** with graceful handling:

```typescript
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Only throw in production if missing
if (!supabaseUrl && process.env.NODE_ENV === 'production') {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL is required in production')
}

// Use placeholders for build time
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key'
)
```

2. **Added fallback handling** in lib/config.ts:

```typescript
function checkSupabaseConfig() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase configuration missing. Please check environment variables.')
  }
}

// Use fallback if Supabase not configured
try {
  checkSupabaseConfig()
} catch (error) {
  console.warn('[CONFIG] Supabase not configured, using fallback')
  return {
    activeTemplate: 'Main',
    availableTemplates: [
      /* default templates */
    ],
  }
}
```

---

## 📋 Required Environment Variables in Vercel

Add these in Vercel Dashboard → Settings → Environment Variables:

```bash
# Supabase Configuration (Required)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Admin Panel (Required)
ADMIN_USERNAME=your-admin-username
ADMIN_PASSWORD=your-admin-password

# Optional but recommended
DB_PROVIDER=supabase
```

---

## 🗄️ Database Setup

Create the `site_config` table in Supabase SQL Editor:

```sql
-- Create table site_config
CREATE TABLE IF NOT EXISTS site_config (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Insert initial configuration
INSERT INTO site_config (key, value)
VALUES (
  'site_config',
  '{
    "activeTemplate": "Main",
    "availableTemplates": [
      {
        "id": "Main",
        "name": "Default Template",
        "description": "The default layout with standard spacing and container widths"
      },
      {
        "id": "Main2",
        "name": "Alternative Template",
        "description": "Alternative layout option"
      }
    ]
  }'::jsonb
) ON CONFLICT (key) DO NOTHING;

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_site_config_updated_at
BEFORE UPDATE ON site_config
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
```

---

## 🛠️ Debugging Tools

### 1. Verify Supabase Connection Locally

```bash
npm run verify-supabase
```

### 2. Check Vercel Function Logs

- Go to Vercel Dashboard → Functions
- Look for logs in `/api/allset/templates/update`

### 3. Test API Endpoint

```bash
curl -X POST https://your-app.vercel.app/api/allset/templates/update \
  -H "Content-Type: application/json" \
  -d '{"templateId": "Main"}'
```

### 4. Browser Console Commands

```javascript
// Check if environment variables are available
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log('Supabase Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Not set')

// Test template storage
const storage = await import('/lib/templateStorage')
const currentTemplate = await storage.getCurrentTemplate()
console.log('Current template:', currentTemplate)
```

---

## 🚀 Prevention Strategies

1. **Always set environment variables** in Vercel before deploying
2. **Run database setup SQL** before using features that depend on it
3. **Use the verification script** to test connections before deployment
4. **Check middleware configuration** when adding new public assets
5. **Monitor Vercel Function logs** for runtime errors

---

## 📚 Related Documentation

- [TROUBLESHOOTING_VERCEL.md](../TROUBLESHOOTING_VERCEL.md) - Detailed troubleshooting guide
- [VERCEL_SETUP.md](../VERCEL_SETUP.md) - Complete deployment setup guide
- [template-switching-troubleshooting.md](./template-switching-troubleshooting.md) - Template-specific issues
- [progress.md](./progress.md) - Complete development history

---

## 🔍 Common Error Patterns

### Network Errors

- `fetch failed` - Check Supabase project status
- `ECONNREFUSED` - Verify environment variables
- `timeout` - Check Vercel function duration limits

### Configuration Errors

- `supabaseUrl is required` - Missing environment variable
- `Table does not exist` - Run database setup SQL
- `Unauthorized` - Check middleware public paths

### Build Errors

- `Cannot find module` - Check imports and dependencies
- `Type error` - Verify TypeScript types match Supabase schema
- `Build failed` - Check logs for specific error messages
