import db from './db'
import type { EmailTemplateDataInstance } from './models/emailTemplateData'

export async function getAllTemplateData(): Promise<EmailTemplateDataInstance[]> {
  return db.getAllTemplateData()
}

export async function getTemplateDataByTemplate(
  template: string
): Promise<EmailTemplateDataInstance[]> {
  return db.getTemplateDataByTemplate(template)
}

export async function insertTemplateData(
  instance: Omit<EmailTemplateDataInstance, 'id' | 'created_at' | 'updated_at'>
): Promise<number> {
  return db.insertTemplateData(instance)
}

export async function updateTemplateData(
  id: number,
  updates: Partial<Omit<EmailTemplateDataInstance, 'id' | 'created_at' | 'updated_at'>>
): Promise<void> {
  return db.updateTemplateData(id, updates)
}

export async function deleteTemplateData(id: number): Promise<void> {
  return db.deleteTemplateData(id)
}
