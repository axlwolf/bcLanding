import { supabase } from './supabaseClient'

export interface Template {
  id: string
  name: string
  description: string
}

export interface SiteConfig {
  activeTemplate: string
  availableTemplates: Template[]
}

/**
 * Get the site configuration from Supabase
 */
export async function getSiteConfigFromSupabase(): Promise<SiteConfig> {
  const { data, error } = await supabase
    .from('site_config')
    .select('value')
    .eq('key', 'site_config')
    .single()

  if (error) {
    console.error('Error fetching site config from Supabase:', error)
    // Fallback to default config if error
    return {
      activeTemplate: 'Main',
      availableTemplates: [
        {
          id: 'Main',
          name: 'Default Template',
          description: 'The default layout with standard spacing and container widths',
        },
      ],
    }
  }

  // value is stored as JSONB
  return data.value as SiteConfig
}

/**
 * Update the site configuration in Supabase
 */
export async function updateSiteConfigInSupabase(config: Partial<SiteConfig>): Promise<SiteConfig> {
  // Read current config from Supabase
  const currentConfig = await getSiteConfigFromSupabase()
  const updatedConfig = {
    ...currentConfig,
    ...config,
  }

  const { error } = await supabase.from('site_config').upsert(
    [
      {
        key: 'site_config',
        value: updatedConfig,
        updated_at: new Date().toISOString(),
      },
    ],
    { onConflict: 'key' }
  )

  if (error) {
    console.error('Error updating site config in Supabase:', error)
    throw new Error('Failed to update site configuration in Supabase')
  }

  return updatedConfig
}

/**
 * Update the active template
 */
export async function updateActiveTemplate(templateId: string): Promise<SiteConfig> {
  const config = await getSiteConfigFromSupabase()

  // Verify the template exists
  const templateExists = config.availableTemplates.some((t) => t.id === templateId)
  if (!templateExists) {
    throw new Error(`Template with ID "${templateId}" does not exist`)
  }

  return updateSiteConfigInSupabase({ activeTemplate: templateId })
}

/**
 * Add a new template to the available templates
 */
export async function addTemplate(template: Template): Promise<SiteConfig> {
  const config = await getSiteConfigFromSupabase()

  // Check if template with this ID already exists
  if (config.availableTemplates.some((t) => t.id === template.id)) {
    throw new Error(`Template with ID "${template.id}" already exists`)
  }

  const updatedTemplates = [...config.availableTemplates, template]
  return updateSiteConfigInSupabase({ availableTemplates: updatedTemplates })
}
