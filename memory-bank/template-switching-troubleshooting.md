# Template Switching Troubleshooting Guide

Esta guía proporciona soluciones específicas para problemas comunes con el sistema de template switching híbrido.

---

## 🚨 Problemas Comunes y Soluciones

### 1. Template No Se Actualiza en Home Page

#### **Síntomas:**

- Admin panel muestra template cambiado exitosamente
- Home page (`/`) sigue mostrando template anterior
- No errors en console

#### **Debugging Steps:**

**Step 1: Verificar localStorage**

```javascript
// En browser console de home page:
console.log('localStorage template:', localStorage.getItem('activeTemplate'))
console.log('All localStorage:', { ...localStorage })
```

**Step 2: Verificar Server Template**

```javascript
// Buscar en server console logs:
[SERVER] Template from Supabase: [templateName]
```

**Step 3: Verificar Client Override**

```javascript
// Buscar en browser console:
[CLIENT] localStorage template: X overriding server template: Y
[CLIENT] Rendering template: X isClient: true transitioning: false
```

#### **Soluciones:**

**Si localStorage está vacío:**

```javascript
// Manually set in console to test:
localStorage.setItem('activeTemplate', 'Main2')
// Then refresh page
```

**Si server template es incorrecto:**

- Check Supabase `site_config` table
- Verify API endpoint `/api/allset/templates/update` is working
- Check network tab for failed API calls

**Si client override no funciona:**

```javascript
// Force re-render ClientTemplateWrapper:
// Add key prop to force remount
<ClientTemplateWrapper key={Date.now()} serverTemplate={serverTemplate} />
```

---

### 2. Infinite API Loops en Admin Panel

#### **Síntomas:**

- Network tab muestra múltiples calls a `/api/allset/templates`
- Page se vuelve lento/unresponsive
- Console logs repetidos

#### **Debugging Steps:**

**Step 1: Check useEffect Dependencies**

```typescript
// ❌ INCORRECTO - causa infinite loops:
useEffect(() => {
  fetchTemplates()
  // setup cross-tab
}, [templates]) // ← templates array dependency

// ✅ CORRECTO:
useEffect(() => {
  fetchTemplates()
}, []) // Solo al montar

useEffect(() => {
  // cross-tab setup
}, [templates.length]) // Solo cuando length cambia
```

**Step 2: Verificar State Updates**

```typescript
// Buscar por state updates no necesarios:
const handleTemplateChange = async (templateId: string) => {
  // ❌ No llamar fetchTemplates() después de update exitoso
  // await fetchTemplates()

  // ✅ Solo update local state:
  setActiveTemplate(templateId)
}
```

#### **Soluciones:**

**Fix Dependencies:**

```typescript
// Separar effects por responsabilidad:
useEffect(() => {
  fetchTemplates()
}, []) // Initial fetch only

useEffect(() => {
  if (templates.length === 0) return
  const cleanup = TemplateStorage.setupCrossTabSync(/* ... */)
  return cleanup
}, [templates.length]) // Only when array length changes
```

**Add Request Deduplication:**

```typescript
const [isLoading, setIsLoading] = useState(false)

async function fetchTemplates() {
  if (isLoading) return // Prevent concurrent calls

  try {
    setIsLoading(true)
    // ... fetch logic
  } finally {
    setIsLoading(false)
  }
}
```

---

### 3. Cross-Tab Sync No Funciona

#### **Síntomas:**

- Template change en un tab no se refleja en otros tabs
- No console logs de cross-tab events
- Storage events no firing

#### **Debugging Steps:**

**Step 1: Test Manual Storage Event**

```javascript
// En tab 1:
localStorage.setItem('activeTemplate', 'TestValue')

// En tab 2, check console for:
[STORAGE] Template changed in another tab: TestValue
```

**Step 2: Verify Event Listeners**

```javascript
// Check if event listeners are registered:
getEventListeners(window) // En Chrome DevTools
// Look for 'storage' events
```

**Step 3: Check Storage Event Dispatch**

```javascript
// Verify manual dispatch is working:
window.dispatchEvent(
  new StorageEvent('storage', {
    key: 'activeTemplate',
    newValue: 'TestValue',
    storageArea: localStorage,
  })
)
```

#### **Soluciones:**

**Fix Event Listener Setup:**

```typescript
// Ensure proper cleanup and re-setup:
useEffect(() => {
  if (typeof window === 'undefined') return

  const cleanup = TemplateStorage.setupCrossTabSync((newTemplateId) => {
    console.log('[CROSS-TAB] Received:', newTemplateId)
    setActiveTemplate(newTemplateId)
  })

  return cleanup // Important: always return cleanup
}, [templates.length])
```

**Fix Storage Event Dispatch:**

```typescript
// Ensure manual dispatch for same-origin changes:
localStorage.setItem(STORAGE_KEY, templateId)

// Manual dispatch needed because same-origin changes don't auto-fire:
window.dispatchEvent(
  new StorageEvent('storage', {
    key: STORAGE_KEY,
    newValue: templateId,
    storageArea: localStorage,
  })
)
```

**Browser Compatibility Check:**

```typescript
static setupCrossTabSync(onTemplateChange: (templateId: string) => void): () => void {
  // Add more robust browser checks:
  if (typeof window === 'undefined' ||
      typeof Storage === 'undefined' ||
      !window.addEventListener ||
      !localStorage) {
    console.warn('[STORAGE] Cross-tab sync not available')
    return () => {}
  }

  // ... rest of implementation
}
```

---

### 4. SSR/Hydration Mismatches

#### **Síntomas:**

- React hydration warnings en console
- "Text content did not match" errors
- Brief flash of wrong content

#### **Debugging Steps:**

**Step 1: Check Hydration Strategy**

```typescript
// Verify proper hydration pattern:
const templateToRender = isClient ? activeTemplate : serverTemplate

// Before hydration: always use serverTemplate
// After hydration: can use activeTemplate from localStorage
```

**Step 2: Verify isClient State**

```typescript
// Should see this pattern in console:
[CLIENT] Rendering template: X isClient: false // Initial render
[CLIENT] Rendering template: Y isClient: true  // After hydration
```

#### **Soluciones:**

**Fix Hydration Pattern:**

```typescript
// ✅ CORRECT hydration-safe pattern:
export default function ClientTemplateWrapper({ serverTemplate }) {
  const [activeTemplate, setActiveTemplate] = useState(serverTemplate) // Start with server
  const [isClient, setIsClient] = useState(false) // Start with false

  useEffect(() => {
    setIsClient(true) // Mark as client after hydration

    const localTemplate = TemplateStorage.getLocalTemplate()
    if (localTemplate && localTemplate !== serverTemplate) {
      setActiveTemplate(localTemplate) // Override after hydration
    }
  }, [serverTemplate])

  // Use server template until client hydration complete:
  const templateToRender = isClient ? activeTemplate : serverTemplate
}
```

**Add Hydration Debugging:**

```typescript
console.log('[HYDRATION]', {
  serverTemplate,
  activeTemplate,
  isClient,
  templateToRender,
})
```

---

### 5. Network/Supabase Errors

#### **Síntomas:**

- Template changes in localStorage but not in Supabase
- Error messages en admin panel
- Cross-device sync not working

#### **Debugging Steps:**

**Step 1: Check Network Tab**

- Look for failed POST to `/api/allset/templates/update`
- Check response status and error messages
- Verify request payload

**Step 2: Check Supabase Connection**

```javascript
// Test direct Supabase connection:
import { supabase } from '@/lib/supabaseClient'

const testConnection = async () => {
  const { data, error } = await supabase.from('site_config').select('*').eq('key', 'site_config')

  console.log('Supabase test:', { data, error })
}
```

**Step 3: Check API Endpoint**

```bash
# Test API endpoint directly:
curl -X POST http://localhost:3000/api/allset/templates/update \
  -H "Content-Type: application/json" \
  -d '{"templateId": "Main2"}'
```

#### **Soluciones:**

**Add Retry Logic:**

```typescript
private static async syncToSupabase(templateId: string, retries = 3): Promise<void> {
  for (let i = 0; i < retries; i++) {
    try {
      await updateActiveTemplate(templateId)
      return // Success, exit retry loop
    } catch (error) {
      console.warn(`[STORAGE] Supabase sync attempt ${i + 1} failed:`, error)

      if (i === retries - 1) {
        throw error // Last attempt failed
      }

      // Wait before retry:
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
    }
  }
}
```

**Improve Error Handling:**

```typescript
// In TemplateSelector:
catch (err) {
  const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'

  // Specific error handling:
  if (errorMessage.includes('fetch')) {
    setError('Network error. Changes saved locally but may not sync across devices.')
  } else if (errorMessage.includes('template')) {
    setError('Invalid template selected. Please try again.')
  } else {
    setError(`Template update failed: ${errorMessage}`)
  }

  console.error('[TEMPLATE] Detailed error:', {
    error: err,
    templateId,
    timestamp: new Date().toISOString()
  })
}
```

---

### 6. Performance Issues

#### **Síntomas:**

- Slow template switching
- High memory usage
- Laggy UI interactions

#### **Debugging Steps:**

**Step 1: Profile Component Renders**

```typescript
// Add render profiling:
console.time('TemplateSelector render')
// ... component logic
console.timeEnd('TemplateSelector render')
```

**Step 2: Check Memory Leaks**

```javascript
// Monitor event listeners:
console.log('Event listeners count:', getEventListeners(window).storage?.length)

// Check for cleanup:
useEffect(() => {
  const cleanup = TemplateStorage.setupCrossTabSync(/* ... */)

  return () => {
    console.log('[CLEANUP] Removing cross-tab listeners')
    cleanup()
  }
}, [])
```

#### **Soluciones:**

**Optimize State Updates:**

```typescript
// ✅ Batch state updates:
setUpdating(false)
setError('')
setSuccess(message)

// ❌ Avoid multiple separate updates:
// setUpdating(false)
// setError('')
// setSuccess(message)
```

**Add Request Debouncing:**

```typescript
import { useCallback } from 'react'
import { debounce } from 'lodash'

const debouncedTemplateChange = useCallback(
  debounce(async (templateId: string) => {
    await handleTemplateChange(templateId)
  }, 300),
  []
)
```

**Optimize Component Structure:**

```typescript
// Memoize expensive calculations:
const sortedTemplates = useMemo(() => {
  return templates.sort((a, b) => a.name.localeCompare(b.name))
}, [templates])

// Memoize event handlers:
const handleTemplateClick = useCallback(
  (templateId: string) => {
    if (!updating) {
      handleTemplateChange(templateId)
    }
  },
  [updating, handleTemplateChange]
)
```

---

## 🔧 Development Tools

### Custom Console Commands

Add these to browser console for debugging:

```javascript
// Template switching debugging tools:
window.templateDebug = {
  // Check current state:
  getCurrentState: () => ({
    localStorage: localStorage.getItem('activeTemplate'),
    serverTemplate: 'Check server logs',
    isClient: 'Check component state',
  }),

  // Force template change:
  forceTemplate: (templateId) => {
    localStorage.setItem('activeTemplate', templateId)
    window.location.reload()
  },

  // Clear template cache:
  clearTemplate: () => {
    localStorage.removeItem('activeTemplate')
    console.log('Template cache cleared')
  },

  // Test cross-tab sync:
  testCrossTab: () => {
    const testId = 'test-' + Date.now()
    localStorage.setItem('activeTemplate', testId)
    window.dispatchEvent(
      new StorageEvent('storage', {
        key: 'activeTemplate',
        newValue: testId,
        storageArea: localStorage,
      })
    )
  },
}

// Usage:
// templateDebug.getCurrentState()
// templateDebug.forceTemplate('Main2')
// templateDebug.clearTemplate()
// templateDebug.testCrossTab()
```

### Monitoring Setup

```typescript
// Add to TemplateStorage for production monitoring:
static addMonitoring() {
  if (typeof window === 'undefined') return

  // Track template changes:
  const originalSetItem = localStorage.setItem
  localStorage.setItem = function(key, value) {
    if (key === 'activeTemplate') {
      console.log('[MONITOR] Template changed:', {
        from: localStorage.getItem(key),
        to: value,
        timestamp: new Date().toISOString()
      })
    }
    return originalSetItem.call(this, key, value)
  }
}
```

---

## 📊 Health Check Checklist

### Quick Verification (5 min)

- [ ] **Admin Panel**: Change template → Success message shows
- [ ] **localStorage**: `localStorage.getItem('activeTemplate')` returns correct value
- [ ] **Home Page**: Visit `/` → Correct template renders
- [ ] **Cross-Tab**: Open two admin tabs → Change in one updates other
- [ ] **Network**: No infinite API calls in network tab
- [ ] **Console**: No error messages or warnings
- [ ] **Performance**: Template change feels instant (<100ms)

### Deep Verification (15 min)

- [ ] **Error Scenarios**: Disable localStorage → Fallback works
- [ ] **Network Errors**: Block API calls → Error handling works
- [ ] **Invalid Data**: Set `localStorage.setItem('activeTemplate', 'invalid')` → Graceful handling
- [ ] **Server-Client Sync**: Clear localStorage → Server template loads → localStorage update → Client override works
- [ ] **Mobile**: Test on mobile browsers → Touch interactions work
- [ ] **Private Mode**: Test in incognito → Basic functionality works

---

## 🆘 Emergency Recovery

### If System Completely Broken

**Step 1: Clear All Template Data**

```javascript
// Clear localStorage:
localStorage.removeItem('activeTemplate')

// Reset Supabase (if needed):
// Update site_config table manually to default template
```

**Step 2: Force Default Template**

```typescript
// Temporarily hardcode in page.tsx:
export default async function Page() {
  // Emergency fallback:
  return <Main /> // Force default template
}
```

**Step 3: Disable Hybrid System**

```typescript
// Temporarily disable ClientTemplateWrapper:
export default async function Page() {
  const config = await getSiteConfigFromSupabase()

  // Render directly without hybrid wrapper:
  switch (config.activeTemplate) {
    case 'Main2': return <Main2 />
    default: return <Main />
  }
}
```

### Rollback Strategy

1. **Revert to pure Supabase**: Remove localStorage logic
2. **Disable cross-tab sync**: Comment out event listeners
3. **Simplify admin panel**: Remove hybrid storage calls
4. **Test basic functionality**: Ensure Supabase CRUD works
5. **Gradually re-enable features**: Add hybrid features back one by one

---

_Esta guía de troubleshooting debe actualizarse conforme se descubran nuevos problemas y soluciones en producción._
