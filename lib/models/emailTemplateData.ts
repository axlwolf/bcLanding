// Email Template model interface and exports for provider use only
// NOTE: Use centralized constants from lib/constants.ts for DB and schema paths if needed.

export interface EmailTemplateDataInstance {
  id: number
  template: string
  data: string // JSON stringified template data
  created_at: string
  updated_at: string
}

export interface IEmailTemplateDataModel {
  getAll(): Promise<EmailTemplateDataInstance[]>
  getById(id: number): Promise<EmailTemplateDataInstance | null>
  getByTemplate(template: string): Promise<EmailTemplateDataInstance[]>
  insert(
    instance: Omit<EmailTemplateDataInstance, 'id' | 'created_at' | 'updated_at'>
  ): Promise<number>
  update(
    id: number,
    updates: Partial<Omit<EmailTemplateDataInstance, 'id' | 'created_at' | 'updated_at'>>
  ): Promise<void>
  delete(id: number): Promise<void>
}

export { SQLiteEmailTemplateDataProvider } from '../providers/sqlite/emailTemplateDataModel'
export { SupabaseEmailTemplateDataProvider } from '../providers/supabase/emailTemplateDataModel'
