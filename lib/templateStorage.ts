import { updateActiveTemplate } from './config'

const STORAGE_KEY = 'activeTemplate'

/**
 * Simple localStorage utility for template management
 * Client-side only, with background Supabase sync
 */
export class TemplateStorage {
  /**
   * Get template from localStorage (client-side only)
   */
  static getLocalTemplate(): string | null {
    try {
      if (typeof window !== 'undefined' && typeof Storage !== 'undefined' && localStorage) {
        return localStorage.getItem(STORAGE_KEY)
      }
    } catch (error) {
      console.warn('[STORAGE] localStorage not available:', error)
    }
    return null
  }

  /**
   * Set active template with immediate localStorage update + background Supabase sync
   */
  static async setActiveTemplate(templateId: string): Promise<{
    immediate: boolean
    synced: boolean
  }> {
    const result = {
      immediate: false,
      synced: false,
    }

    // 1. Immediate localStorage update
    try {
      if (typeof window !== 'undefined' && typeof Storage !== 'undefined' && localStorage) {
        localStorage.setItem(STORAGE_KEY, templateId)
        result.immediate = true
        console.log('[STORAGE] Template updated in localStorage:', templateId)

        // Dispatch storage event for cross-tab sync
        window.dispatchEvent(
          new StorageEvent('storage', {
            key: STORAGE_KEY,
            newValue: templateId,
            storageArea: localStorage,
          })
        )
      }
    } catch (error) {
      console.warn('[STORAGE] localStorage update failed:', error)
    }

    // 2. Background Supabase sync (non-blocking)
    this.syncToSupabase(templateId)
      .then(() => {
        result.synced = true
        console.log('[STORAGE] Template synced to Supabase:', templateId)
      })
      .catch((error) => {
        console.error('[STORAGE] Supabase sync failed:', error)
      })

    return result
  }

  /**
   * Background sync to Supabase (non-blocking)
   */
  private static async syncToSupabase(templateId: string): Promise<void> {
    try {
      await updateActiveTemplate(templateId)
    } catch (error) {
      console.error('[STORAGE] Background sync to Supabase failed:', error)
      throw error
    }
  }

  /**
   * Setup cross-tab synchronization
   */
  static setupCrossTabSync(onTemplateChange: (templateId: string) => void): () => void {
    if (typeof window === 'undefined' || typeof Storage === 'undefined') {
      return () => {} // No-op in SSR or unsupported browsers
    }

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY && event.newValue) {
        console.log('[STORAGE] Template changed in another tab:', event.newValue)
        onTemplateChange(event.newValue)
      }
    }

    window.addEventListener('storage', handleStorageChange)

    // Return cleanup function
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }

  /**
   * Clear template from localStorage (useful for testing/debugging)
   */
  static clearLocalTemplate(): void {
    try {
      if (typeof window !== 'undefined' && typeof Storage !== 'undefined' && localStorage) {
        localStorage.removeItem(STORAGE_KEY)
        console.log('[STORAGE] Cleared localStorage template')
      }
    } catch (error) {
      console.warn('[STORAGE] Could not clear localStorage:', error)
    }
  }
}
