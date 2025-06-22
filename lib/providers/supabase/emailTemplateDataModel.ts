import { SupabaseClient } from '@supabase/supabase-js'
import { EmailTemplateDataInstance, IEmailTemplateDataModel } from '../../models/emailTemplateData'
import { ALLSET_EMAIL_TEMPLATE_DATA_TABLE } from '../../constants'

export class SupabaseEmailTemplateDataProvider implements IEmailTemplateDataModel {
  private client: SupabaseClient
  constructor(client: SupabaseClient) {
    this.client = client
  }

  async getAll(): Promise<EmailTemplateDataInstance[]> {
    const { data, error } = await this.client
      .from(ALLSET_EMAIL_TEMPLATE_DATA_TABLE)
      .select('*')
      .order('id', { ascending: false })
    if (error) throw error
    return data as EmailTemplateDataInstance[]
  }

  async getById(id: number): Promise<EmailTemplateDataInstance | null> {
    const { data, error } = await this.client
      .from(ALLSET_EMAIL_TEMPLATE_DATA_TABLE)
      .select('*')
      .eq('id', id)
      .single()
    if (error) return null
    return data as EmailTemplateDataInstance
  }

  async getByTemplate(template: string): Promise<EmailTemplateDataInstance[]> {
    const { data, error } = await this.client
      .from(ALLSET_EMAIL_TEMPLATE_DATA_TABLE)
      .select('*')
      .eq('template', template)
      .order('id', { ascending: false })
    if (error) throw error
    return data as EmailTemplateDataInstance[]
  }

  async insert(
    instance: Omit<EmailTemplateDataInstance, 'id' | 'created_at' | 'updated_at'>
  ): Promise<number> {
    const { data, error } = await this.client
      .from(ALLSET_EMAIL_TEMPLATE_DATA_TABLE)
      .insert([
        {
          template: instance.template,
          data: instance.data,
        },
      ])
      .select('id')
      .single()
    if (error) throw error
    return data.id
  }

  async update(
    id: number,
    updates: Partial<Omit<EmailTemplateDataInstance, 'id' | 'created_at' | 'updated_at'>>
  ): Promise<void> {
    const { error } = await this.client
      .from(ALLSET_EMAIL_TEMPLATE_DATA_TABLE)
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
    if (error) throw error
  }

  async delete(id: number): Promise<void> {
    const { error } = await this.client.from(ALLSET_EMAIL_TEMPLATE_DATA_TABLE).delete().eq('id', id)
    if (error) throw error
  }
}
