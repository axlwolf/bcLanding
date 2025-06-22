import type { SupabaseClient } from '@supabase/supabase-js'
import { CTAConfigInstance, ICTAConfigModel } from '../../models/ctaConfig'
import { ALLSET_CTA_CONFIG_TABLE } from '../../constants'

export class SupabaseCTAConfigProvider implements ICTAConfigModel {
  private client: SupabaseClient
  constructor(client: SupabaseClient) {
    this.client = client
  }

  async getAll(): Promise<CTAConfigInstance[]> {
    const { data, error } = await this.client
      .from(ALLSET_CTA_CONFIG_TABLE)
      .select('*')
      .order('id', { ascending: false })
    if (error) throw error
    return data as CTAConfigInstance[]
  }

  async getById(id: number): Promise<CTAConfigInstance | null> {
    const { data, error } = await this.client
      .from(ALLSET_CTA_CONFIG_TABLE)
      .select('*')
      .eq('id', id)
      .single()
    if (error) return null
    return data as CTAConfigInstance
  }

  async getByType(cta_type: string): Promise<CTAConfigInstance | null> {
    const { data, error } = await this.client
      .from(ALLSET_CTA_CONFIG_TABLE)
      .select('*')
      .eq('cta_type', cta_type)
      .order('updated_at', { ascending: false })
      .limit(1)
      .single()
    if (error) return null
    return data as CTAConfigInstance
  }

  async insert(instance: Omit<CTAConfigInstance, 'id' | 'updated_at'>): Promise<number> {
    const { data, error } = await this.client
      .from(ALLSET_CTA_CONFIG_TABLE)
      .insert([
        {
          cta_type: instance.cta_type,
          template_data_id: instance.template_data_id,
          newsletter_frequency: instance.newsletter_frequency ?? null,
          updated_at: new Date().toISOString(),
        },
      ])
      .select('id')
      .single()
    if (error) throw error
    return data.id
  }

  async update(
    id: number,
    updates: Partial<Omit<CTAConfigInstance, 'id' | 'updated_at'>>
  ): Promise<void> {
    const { error } = await this.client
      .from(ALLSET_CTA_CONFIG_TABLE)
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
    if (error) throw error
  }

  async delete(id: number): Promise<void> {
    const { error } = await this.client.from(ALLSET_CTA_CONFIG_TABLE).delete().eq('id', id)
    if (error) throw error
  }
}
