import type Database from 'better-sqlite3'
import { CTAConfigInstance, ICTAConfigModel } from '../../models/ctaConfig'
import { ALLSET_CTA_CONFIG_TABLE } from '../../constants'

export class SQLiteCTAConfigProvider implements ICTAConfigModel {
  constructor(private db: Database) {}

  async getAll(): Promise<CTAConfigInstance[]> {
    return this.db.all<CTAConfigInstance>(
      `SELECT * FROM ${ALLSET_CTA_CONFIG_TABLE} ORDER BY id DESC`
    )
  }

  async getById(id: number): Promise<CTAConfigInstance | null> {
    const row = this.db.get<CTAConfigInstance>(
      `SELECT * FROM ${ALLSET_CTA_CONFIG_TABLE} WHERE id = ?`,
      [id]
    )
    return row || null
  }

  async getByType(cta_type: string): Promise<CTAConfigInstance | null> {
    const row = this.db.get<CTAConfigInstance>(
      `SELECT * FROM ${ALLSET_CTA_CONFIG_TABLE} WHERE cta_type = ? ORDER BY updated_at DESC LIMIT 1`,
      [cta_type]
    )
    return row || null
  }

  async insert(instance: Omit<CTAConfigInstance, 'id' | 'updated_at'>): Promise<number> {
    const stmt = this.db.prepare(
      `INSERT INTO ${ALLSET_CTA_CONFIG_TABLE} (cta_type, template_data_id, newsletter_frequency, updated_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP)`
    )
    const info = stmt.run(
      instance.cta_type,
      instance.template_data_id,
      instance.newsletter_frequency ?? null
    )
    return info.lastInsertRowid as number
  }

  async update(
    id: number,
    updates: Partial<Omit<CTAConfigInstance, 'id' | 'updated_at'>>
  ): Promise<void> {
    const fields: string[] = []
    const values: unknown[] = []
    if (typeof updates.cta_type !== 'undefined') {
      fields.push('cta_type = ?')
      values.push(updates.cta_type)
    }
    if (typeof updates.template_data_id !== 'undefined') {
      fields.push('template_data_id = ?')
      values.push(updates.template_data_id)
    }
    if (typeof updates.newsletter_frequency !== 'undefined') {
      fields.push('newsletter_frequency = ?')
      values.push(updates.newsletter_frequency)
    }
    if (fields.length === 0) return
    values.push(id)
    this.db
      .prepare(
        `UPDATE ${ALLSET_CTA_CONFIG_TABLE} SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`
      )
      .run(...values)
  }

  async delete(id: number): Promise<void> {
    this.db.prepare(`DELETE FROM ${ALLSET_CTA_CONFIG_TABLE} WHERE id = ?`).run(id)
  }
}
