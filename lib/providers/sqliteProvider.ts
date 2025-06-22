import Database from 'better-sqlite3'
import fs from 'fs'
import { IDatabaseProvider } from '../dbProvider'
import { SQLiteEmailModel } from './sqlite/emailModel'
import { SQLiteEmailTemplateDataProvider } from './sqlite/emailTemplateDataModel'
import { SQLITE_DB_PATH, SQLITE_SCHEMA_FILE } from '../constants'
import { ContactSubmission, SQLiteContactModel } from '../models/contact'
import type { EmailTemplateDataInstance } from '../models/emailTemplateData'
import { CTAConfigInstance, SQLiteCTAConfigProvider } from '../models/ctaConfig'

type Email = { id: number; email: string; created_at: string }

export class SQLiteProvider implements IDatabaseProvider {
  private db: Database.Database
  private emailModel: SQLiteEmailModel
  private contactModel: SQLiteContactModel
  private emailTemplateDataModel: SQLiteEmailTemplateDataProvider
  private ctaConfigModel: SQLiteCTAConfigProvider

  constructor(dbPath: string = SQLITE_DB_PATH, schemaPath: string = SQLITE_SCHEMA_FILE) {
    this.db = new Database(dbPath)
    const schema = fs.readFileSync(schemaPath, 'utf-8')
    this.db.exec(schema)
    this.emailModel = new SQLiteEmailModel(this.db)
    this.contactModel = new SQLiteContactModel(this.db)
    this.emailTemplateDataModel = new SQLiteEmailTemplateDataProvider(this.db)
    this.ctaConfigModel = new SQLiteCTAConfigProvider(this.db)
  }

  async getAllEmails(): Promise<Email[]> {
    return this.emailModel.getAll()
  }
  async insertEmail(email: string): Promise<void> {
    this.emailModel.insert(email)
  }
  async deleteEmail(id: number): Promise<void> {
    return this.emailModel.deleteEmail(id)
  }
  async getSubscriptionCount(): Promise<number> {
    return this.emailModel.getCount()
  }

  async getAllContactSubmissions(): Promise<ContactSubmission[]> {
    return this.contactModel.getAll()
  }

  async insertContactSubmission(data: Omit<ContactSubmission, 'id' | 'created_at'>): Promise<void> {
    this.contactModel.insert(data)
  }

  // Email Template Data Methods
  async getAllTemplateData(): Promise<EmailTemplateDataInstance[]> {
    return this.emailTemplateDataModel.getAll()
  }

  async getTemplateDataById(id: number): Promise<EmailTemplateDataInstance | null> {
    return this.emailTemplateDataModel.getById(id)
  }

  async getTemplateDataByTemplate(template: string): Promise<EmailTemplateDataInstance[]> {
    return this.emailTemplateDataModel.getByTemplate(template)
  }

  async insertTemplateData(
    instance: Omit<EmailTemplateDataInstance, 'id' | 'created_at' | 'updated_at'>
  ): Promise<number> {
    return this.emailTemplateDataModel.insert(instance)
  }

  async updateTemplateData(
    id: number,
    updates: Partial<Omit<EmailTemplateDataInstance, 'id' | 'created_at' | 'updated_at'>>
  ): Promise<void> {
    return this.emailTemplateDataModel.update(id, updates)
  }

  async deleteTemplateData(id: number): Promise<void> {
    return this.emailTemplateDataModel.delete(id)
  }

  // CTA Config Methods
  async getAllCTAConfig(): Promise<CTAConfigInstance[]> {
    return this.ctaConfigModel.getAll()
  }
  async getCTAConfigById(id: number): Promise<CTAConfigInstance | null> {
    return this.ctaConfigModel.getById(id)
  }
  async getCTAConfigByType(cta_type: string): Promise<CTAConfigInstance | null> {
    return this.ctaConfigModel.getByType(cta_type)
  }
  async insertCTAConfig(instance: Omit<CTAConfigInstance, 'id' | 'updated_at'>): Promise<number> {
    return this.ctaConfigModel.insert(instance)
  }
  async updateCTAConfig(
    id: number,
    updates: Partial<Omit<CTAConfigInstance, 'id' | 'updated_at'>>
  ): Promise<void> {
    return this.ctaConfigModel.update(id, updates)
  }
  async deleteCTAConfig(id: number): Promise<void> {
    return this.ctaConfigModel.delete(id)
  }
}
