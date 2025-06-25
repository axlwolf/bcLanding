import { NextResponse } from 'next/server'
import { getSiteConfigFromSupabase } from '@/lib/config'

// For static export, we need to handle this differently
export const dynamic = 'error'

export async function GET() {
  try {
    const config = await getSiteConfigFromSupabase()

    return NextResponse.json({
      success: true,
      activeTemplate: config.activeTemplate,
      availableTemplates: config.availableTemplates,
    })
  } catch (error) {
    console.error('Error getting templates:', error)
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'An error occurred' },
      { status: 500 }
    )
  }
}
