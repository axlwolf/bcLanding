// Database provider interface for scalable, swappable DB backends
import type { EmailTemplateDataInstance } from './models/emailTemplateData'
import type { CTAConfigInstance } from './models/ctaConfig'

export interface IDatabaseProvider {
  getAllEmails(): Promise<{ id: number; email: string; created_at: string }[]>
  insertEmail(email: string): Promise<void>
  deleteEmail(id: number): Promise<void>
  getSubscriptionCount(): Promise<number>

  getAllContactSubmissions(): Promise<
    { id: number; name: string; email: string; message: string; created_at: string }[]
  >
  insertContactSubmission(
    data: Omit<{ name: string; email: string; message: string }, 'id' | 'created_at'>
  ): Promise<void>

  // Template Data Methods
  insertTemplateData(
    instance: Omit<EmailTemplateDataInstance, 'id' | 'created_at' | 'updated_at'>
  ): Promise<number>
  getTemplateDataByTemplate(template: string): Promise<EmailTemplateDataInstance[]>
  getAllTemplateData(): Promise<EmailTemplateDataInstance[]>

  updateTemplateData(
    id: number,
    updates: Partial<Omit<EmailTemplateDataInstance, 'id' | 'created_at' | 'updated_at'>>
  ): Promise<void>
  deleteTemplateData(id: number): Promise<void>

  // CTA Config Methods
  getAllCTAConfig(): Promise<CTAConfigInstance[]>
  getCTAConfigById(id: number): Promise<CTAConfigInstance | null>
  getCTAConfigByType(cta_type: string): Promise<CTAConfigInstance | null>
  insertCTAConfig(instance: Omit<CTAConfigInstance, 'id' | 'updated_at'>): Promise<number>
  updateCTAConfig(
    id: number,
    updates: Partial<Omit<CTAConfigInstance, 'id' | 'updated_at'>>
  ): Promise<void>
  deleteCTAConfig(id: number): Promise<void>
}
