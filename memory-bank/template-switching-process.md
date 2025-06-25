# Template Switching Process - Technical Deep Dive

Esta documentación describe el proceso técnico completo del sistema de template switching híbrido implementado en BoothieCall.

## Overview del Proceso

El template switching utiliza una arquitectura híbrida que combina localStorage para respuesta inmediata con Supabase para persistencia a largo plazo. El proceso está diseñado para ser **no-bloqueante** y **resiliente a errores**.

---

## Fase 1: User Action (Admin Panel)

### Ubicación: `/allset/templates`

### Componente: `TemplateSelector.tsx`

### Timing: Inmediato (0ms)

```typescript
// User clicks template button
const handleTemplateChange = async (templateId: string) => {
  setUpdating(true)     // Disable button immediately
  setError('')          // Clear previous errors
  setSuccess('')        // Clear previous success messages

  console.log('[TEMPLATE] Changing to:', templateId)
```

**Key Points:**

- Button se deshabilita inmediatamente para prevenir double-clicks
- UI feedback inmediato sin esperar API calls
- Console logging para debugging

---

## Fase 2: localStorage Update (Immediate Response)

### Timing: 0-10ms

### Componente: `TemplateStorage.setActiveTemplate()`

```typescript
// 1. IMMEDIATE: Update localStorage and UI state
const storageResult = await TemplateStorage.setActiveTemplate(templateId)

// Inside TemplateStorage.setActiveTemplate():
static async setActiveTemplate(templateId: string) {
  const result = { immediate: false, synced: false }

  // Immediate localStorage update
  try {
    if (typeof window !== 'undefined' && localStorage) {
      localStorage.setItem(STORAGE_KEY, templateId)
      result.immediate = true
      console.log('[STORAGE] Template updated in localStorage:', templateId)

      // Dispatch storage event for cross-tab sync
      window.dispatchEvent(new StorageEvent('storage', {
        key: STORAGE_KEY,
        newValue: templateId,
        storageArea: localStorage
      }))
    }
  } catch (error) {
    console.warn('[STORAGE] localStorage update failed:', error)
  }

  return result
}
```

**Critical Implementation Details:**

### ✅ Browser Compatibility Check

```typescript
typeof window !== 'undefined' && localStorage
```

- Prevents SSR errors
- Handles browsers with localStorage disabled
- Graceful degradation

### ✅ Cross-Tab Event Dispatch

```typescript
window.dispatchEvent(
  new StorageEvent('storage', {
    key: STORAGE_KEY,
    newValue: templateId,
    storageArea: localStorage,
  })
)
```

- Manual event dispatch (needed because same-origin changes don't auto-fire)
- Ensures cross-tab synchronization works reliably

---

## Fase 3: UI Feedback (Immediate)

### Timing: 10-20ms

### Componente: `TemplateSelector.tsx`

```typescript
if (storageResult.immediate) {
  // Update local state immediately for UI feedback
  setActiveTemplate(templateId)
  const templateName = templates.find((t) => t.id === templateId)?.name
  setSuccess(`Template changed to "${templateName}". Changes will be visible on the home page.`)

  console.log('[TEMPLATE] Template updated successfully. User remains in admin panel.')
}
```

**Key Features:**

- **Immediate visual feedback**: Button state changes instantly
- **Clear messaging**: User knows exactly what happened
- **Context preservation**: User stays in admin panel
- **Actionable UI**: "Preview Home" button becomes available

### Preview Button Implementation

```typescript
<button
  onClick={() => window.open('/', '_blank')}
  className="ml-4 rounded-md bg-green-100 px-3 py-1 text-xs font-medium text-green-800 hover:bg-green-200"
>
  Preview Home ↗️
</button>
```

---

## Fase 4: Background Supabase Sync (Non-Blocking)

### Timing: 50-500ms (parallel)

### Componente: `TemplateStorage.syncToSupabase()`

```typescript
// 2. Background Supabase sync (non-blocking)
this.syncToSupabase(templateId)
  .then(() => {
    result.synced = true
    console.log('[STORAGE] Template synced to Supabase:', templateId)
  })
  .catch((error) => {
    console.error('[STORAGE] Supabase sync failed:', error)
  })

// Implementation:
private static async syncToSupabase(templateId: string): Promise<void> {
  try {
    await updateActiveTemplate(templateId)
  } catch (error) {
    console.error('[STORAGE] Background sync to Supabase failed:', error)
    throw error
  }
}
```

**Critical Design Decisions:**

### ✅ Non-Blocking Pattern

- UI update happens immediately
- Supabase sync happens in background
- User doesn't wait for network calls

### ✅ Error Isolation

- Supabase errors don't affect UI feedback
- Errors are logged for debugging
- User experience remains smooth

### ✅ Promise Chain

- Async/await for clean error handling
- Results are tracked but don't block UI

---

## Fase 5: Cross-Tab Synchronization

### Timing: 20-50ms (parallel)

### Componente: `TemplateStorage.setupCrossTabSync()`

```typescript
// Setup in TemplateSelector.tsx useEffect:
useEffect(() => {
  if (templates.length === 0) return // Wait for templates to load

  const cleanup = TemplateStorage.setupCrossTabSync((newTemplateId) => {
    console.log('[TEMPLATE] Template changed in another tab:', newTemplateId)
    setActiveTemplate(newTemplateId)
    const templateName = templates.find((t) => t.id === newTemplateId)?.name || newTemplateId
    setSuccess(`Template synchronized from another tab: "${templateName}"`)
  })

  return cleanup
}, [templates.length])

// Implementation in TemplateStorage:
static setupCrossTabSync(onTemplateChange: (templateId: string) => void): () => void {
  if (typeof window === 'undefined' || typeof Storage === 'undefined') {
    return () => {} // No-op in SSR
  }

  const handleStorageChange = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY && event.newValue) {
      console.log('[STORAGE] Template changed in another tab:', event.newValue)
      onTemplateChange(event.newValue)
    }
  }

  window.addEventListener('storage', handleStorageChange)

  return () => {
    window.removeEventListener('storage', handleStorageChange)
  }
}
```

**Implementation Notes:**

### ✅ Event Cleanup

- Returns cleanup function for useEffect
- Prevents memory leaks
- Proper component lifecycle management

### ✅ Tab Coordination

- All open admin tabs update simultaneously
- Consistent state across browser tabs
- Real-time synchronization

---

## Fase 6: Home Page Visit (Hybrid Rendering)

### Server-Side Rendering

#### File: `app/page.tsx`

```typescript
export default async function Page() {
  // Server-side: Get template from Supabase (always reliable)
  const config = await getSiteConfigFromSupabase()
  const serverTemplate = config.activeTemplate

  console.log('[SERVER] Template from Supabase:', serverTemplate)

  // Pass server template to client wrapper
  return <ClientTemplateWrapper serverTemplate={serverTemplate} />
}
```

### Client-Side Enhancement

#### File: `app/ClientTemplateWrapper.tsx`

```typescript
export default function ClientTemplateWrapper({ serverTemplate }: ClientTemplateWrapperProps) {
  const [activeTemplate, setActiveTemplate] = useState(serverTemplate)
  const [isClient, setIsClient] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    setIsClient(true) // Mark as client-side after hydration

    // Check localStorage for more recent template
    const localTemplate = TemplateStorage.getLocalTemplate()

    if (localTemplate && localTemplate !== serverTemplate) {
      console.log('[CLIENT] localStorage template:', localTemplate, 'overriding server template:', serverTemplate)

      // Smooth transition when overriding server template
      setIsTransitioning(true)
      setTimeout(() => {
        setActiveTemplate(localTemplate)
        setIsTransitioning(false)
      }, 50)
    }
  }, [serverTemplate])

  // Before hydration, always show server template to avoid mismatch
  const templateToRender = isClient ? activeTemplate : serverTemplate

  // Show loading during transition
  if (isTransitioning) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
      </div>
    )
  }

  // Render appropriate template
  switch (templateToRender) {
    case 'Main2': return <Main2 />
    case 'Main3': return <Main3 />
    // ... etc
    default: return <Main />
  }
}
```

**Critical Hydration Strategy:**

### ✅ Hydration Safety

```typescript
const templateToRender = isClient ? activeTemplate : serverTemplate
```

- Server always renders Supabase template
- Client can override after hydration
- No hydration mismatches

### ✅ Smooth Transitions

```typescript
setIsTransitioning(true)
setTimeout(() => {
  setActiveTemplate(localTemplate)
  setIsTransitioning(false)
}, 50)
```

- 50ms loading state prevents jarring changes
- Smooth user experience
- Visual feedback during transitions

---

## Error Handling & Fallbacks

### localStorage Unavailable

```typescript
// Fallback to API-only approach if localStorage failed
console.log('[TEMPLATE] localStorage failed, using API-only approach...')
await fallbackToApiUpdate(templateId)

const fallbackToApiUpdate = async (templateId: string) => {
  const response = await fetch('/api/allset/templates/update', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ templateId }),
  })

  if (response.ok) {
    const data = await response.json()
    setActiveTemplate(data.activeTemplate)
    setSuccess(`Template changed via fallback method.`)
  }
}
```

### Network Errors

```typescript
catch (err) {
  console.error('[TEMPLATE] Error updating template:', err)
  setError(err instanceof Error ? err.message : 'An error occurred')
} finally {
  setUpdating(false) // Always re-enable button
}
```

### Invalid Template IDs

```typescript
// Verify the template exists
const templateExists = config.availableTemplates.some((t) => t.id === templateId)
if (!templateExists) {
  throw new Error(`Template with ID "${templateId}" does not exist`)
}
```

---

## Performance Characteristics

### Timing Breakdown

- **User Click → UI Feedback**: 0-20ms
- **localStorage Update**: 0-10ms
- **Cross-tab Sync**: 20-50ms
- **Supabase Sync**: 50-500ms (background)
- **Home Page Override**: 50ms transition

### Memory Usage

- **localStorage**: ~50 bytes (single template ID)
- **Component State**: Minimal (string + booleans)
- **Event Listeners**: Single storage listener per component

### Network Usage

- **Template Change**: 1 background API call to Supabase
- **Home Page Load**: 1 server-side Supabase query
- **No Polling**: Event-driven updates only

---

## Debugging Guide

### Console Log Patterns

#### Successful Template Change

```
[TEMPLATE] Changing to: Main2
[STORAGE] Template updated in localStorage: Main2
[TEMPLATE] Template updated successfully. User remains in admin panel.
[STORAGE] Template synced to Supabase: Main2
```

#### Home Page Override

```
[SERVER] Template from Supabase: Main
[CLIENT] localStorage template: Main2 overriding server template: Main
[CLIENT] Rendering template: Main2 isClient: true transitioning: false
```

#### Cross-Tab Sync

```
[STORAGE] Template changed in another tab: Main3
[TEMPLATE] Template changed in another tab: Main3
```

### Common Issues & Solutions

#### Issue: Templates not updating on home page

**Check:**

1. localStorage value: `localStorage.getItem('activeTemplate')`
2. Server template: Check server console logs
3. Client override: Check browser console for ClientTemplateWrapper logs

#### Issue: Cross-tab sync not working

**Check:**

1. Event listeners: Check if cleanup functions are being called
2. Storage events: Manually trigger `localStorage.setItem('activeTemplate', 'test')`
3. Browser compatibility: Some browsers block storage events in private mode

#### Issue: Infinite re-renders

**Check:**

1. useEffect dependencies: Should be `[templates.length]` not `[templates]`
2. Callback functions: Ensure stable references with useCallback if needed
3. State updates: Check for unnecessary state updates in useEffect

---

## Testing Scenarios

### Manual Testing Checklist

#### ✅ Basic Functionality

- [ ] Change template in admin panel → UI updates immediately
- [ ] Visit home page → Correct template shows
- [ ] Refresh home page → Template persists

#### ✅ Cross-Tab Sync

- [ ] Open admin in two tabs → Change in one updates the other
- [ ] Open home + admin → Change in admin reflects on home

#### ✅ Error Scenarios

- [ ] Disable localStorage → Fallback API mode works
- [ ] Network error → Error message shows, button re-enables
- [ ] Invalid template ID → Error handled gracefully

#### ✅ Performance

- [ ] No infinite API calls in network tab
- [ ] Template change feels instant (<100ms perceived)
- [ ] Home page loads with correct template immediately

---

## Architecture Benefits

### ✅ **User Experience**

- Instant feedback on template changes
- No waiting for API calls
- Clear success messaging
- Admin workflow preservation

### ✅ **Technical Robustness**

- Graceful fallbacks for edge cases
- No hydration mismatches
- Cross-tab synchronization
- Error isolation

### ✅ **Performance**

- Non-blocking background sync
- Minimal network usage
- Efficient state management
- Optimized rendering

### ✅ **Maintainability**

- Clear separation of concerns
- Comprehensive logging
- Modular architecture
- Documented error paths

---

_This technical documentation serves as the definitive guide for understanding, debugging, and maintaining the template switching system in BoothieCall._
