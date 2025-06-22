// CTA Config model interface and exports for provider use only
// NOTE: Use centralized constants from lib/constants.ts for DB and schema paths if needed.

export interface CTAConfigInstance {
  id: number
  cta_type: string // 'ebook-delivery', 'newsletter', 'downloadable-item', or 'welcome'
  template_data_id: number // FK to EmailTemplateDataInstance
  newsletter_frequency?: string | null // 'daily', 'weekly', 'monthly', or null
  updated_at: string
}

export interface ICTAConfigModel {
  getAll(): Promise<CTAConfigInstance[]>
  getById(id: number): Promise<CTAConfigInstance | null>
  getByType(cta_type: string): Promise<CTAConfigInstance | null>
  insert(instance: Omit<CTAConfigInstance, 'id' | 'updated_at'>): Promise<number>
  update(id: number, updates: Partial<Omit<CTAConfigInstance, 'id' | 'updated_at'>>): Promise<void>
  delete(id: number): Promise<void>
}

export { SQLiteCTAConfigProvider } from '../providers/sqlite/ctaConfigModel'
export { SupabaseCTAConfigProvider } from '../providers/supabase/ctaConfigModel'
