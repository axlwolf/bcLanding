import type Database from 'better-sqlite3'
import { EmailTemplateDataInstance, IEmailTemplateDataModel } from '../../models/emailTemplateData'
import { ALLSET_EMAIL_TEMPLATE_DATA_TABLE } from '../../constants'

export class SQLiteEmailTemplateDataProvider implements IEmailTemplateDataModel {
  constructor(private db: Database) {}

  async getAll(): Promise<EmailTemplateDataInstance[]> {
    return this.db.all<EmailTemplateDataInstance>(
      `SELECT * FROM ${ALLSET_EMAIL_TEMPLATE_DATA_TABLE} ORDER BY id DESC`
    )
  }

  async getById(id: number): Promise<EmailTemplateDataInstance | null> {
    const row = this.db.get<EmailTemplateDataInstance>(
      `SELECT * FROM ${ALLSET_EMAIL_TEMPLATE_DATA_TABLE} WHERE id = ?`,
      [id]
    )
    return row || null
  }

  async getByTemplate(template: string): Promise<EmailTemplateDataInstance[]> {
    return this.db.all<EmailTemplateDataInstance>(
      `SELECT * FROM ${ALLSET_EMAIL_TEMPLATE_DATA_TABLE} WHERE template = ? ORDER BY id DESC`,
      [template]
    )
  }

  async insert(
    instance: Omit<EmailTemplateDataInstance, 'id' | 'created_at' | 'updated_at'>
  ): Promise<number> {
    const stmt = this.db.prepare(
      `INSERT INTO ${ALLSET_EMAIL_TEMPLATE_DATA_TABLE} (template, data, created_at, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`
    )
    const info = stmt.run(instance.template, instance.data)
    return info.lastInsertRowid as number
  }

  async update(
    id: number,
    updates: Partial<Omit<EmailTemplateDataInstance, 'id' | 'created_at' | 'updated_at'>>
  ): Promise<void> {
    const fields: string[] = []
    const values: unknown[] = []
    // values is used for SQLite parameter binding; type is unknown[] for safety
    if (typeof updates.template !== 'undefined') {
      fields.push('template = ?')
      values.push(updates.template)
    }
    if (typeof updates.data !== 'undefined') {
      fields.push('data = ?')
      values.push(updates.data)
    }
    if (fields.length === 0) return
    values.push(id)
    this.db
      .prepare(
        `UPDATE ${ALLSET_EMAIL_TEMPLATE_DATA_TABLE} SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`
      )
      .run(...values)
  }

  async delete(id: number): Promise<void> {
    this.db.prepare(`DELETE FROM ${ALLSET_EMAIL_TEMPLATE_DATA_TABLE} WHERE id = ?`).run(id)
  }
}
