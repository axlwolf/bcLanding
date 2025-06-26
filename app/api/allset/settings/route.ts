import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

// Initialize Supabase client
// Ensure you have these environment variables set in your .env.local file
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const siteName = formData.get('siteName') as string
    const siteDescription = formData.get('siteDescription') as string
    const adminEmail = formData.get('adminEmail') as string
    const logoFile = formData.get('logo') as File | null

    let logoUrl: string | null = null

    // 1. Handle logo upload if a new logo is provided
    if (logoFile && logoFile.size > 0) {
      const filePath = `public/${Date.now()}-${logoFile.name}`
      const { error: uploadError } = await supabase.storage
        .from('siteassets') // IMPORTANT: Ensure 'siteassets' bucket exists in your Supabase project
        .upload(filePath, logoFile)

      if (uploadError) {
        throw new Error(`Logo upload failed: ${uploadError.message}`)
      }

      const { data: publicUrlData } = supabase.storage.from('siteassets').getPublicUrl(filePath)

      logoUrl = publicUrlData.publicUrl
    }

    // 2. Prepare data for site_config update
    interface SiteConfigUpdates {
      site_name: string
      site_description: string
      admin_email: string
      updated_at: Date
      logo_url?: string
    }

    const updates: SiteConfigUpdates = {
      site_name: siteName,
      site_description: siteDescription,
      admin_email: adminEmail,
      updated_at: new Date(),
    }

    if (logoUrl) {
      updates.logo_url = logoUrl
    }

    // 3. Update the site_config table
    // This assumes you have a single row in your site_config table to store global settings.
    // We'll update the row with a specific, known ID (e.g., id = 1).
    const { error: updateError } = await supabase.from('site_settings').update(updates).eq('id', 1) // IMPORTANT: This assumes your global config row has id = 1

    if (updateError) {
      throw new Error(`Failed to update settings in database: ${updateError.message}`)
    }

    return NextResponse.json({
      success: true,
      message: 'Settings updated successfully!',
      newLogoUrl: logoUrl,
    })
  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 })
  }
}
