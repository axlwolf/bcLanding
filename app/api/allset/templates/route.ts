import { NextResponse } from 'next/server'
import { getSiteConfigFromSupabase } from '@/lib/config'

// Enable dynamic behavior for API routes
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error('[API] Supabase environment variables not configured')
      return NextResponse.json(
        {
          success: false,
          message: 'Supabase not configured. Please check environment variables.',
          error: 'MISSING_SUPABASE_CONFIG',
        },
        { status: 500 }
      )
    }

    const config = await getSiteConfigFromSupabase()

    return NextResponse.json({
      success: true,
      activeTemplate: config.activeTemplate,
      availableTemplates: config.availableTemplates,
    })
  } catch (error) {
    console.error('[API] Error fetching templates:', error)

    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'

    // Check for Supabase-specific connection errors
    if (
      errorMessage.toLowerCase().includes('supabase') ||
      errorMessage.toLowerCase().includes('fetch failed')
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            'Database connection error. Please verify your Supabase configuration and network status.',
          error: 'SUPABASE_CONNECTION_ERROR',
          details: errorMessage,
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        message: 'An internal server error occurred.',
        error: 'GENERAL_ERROR',
        details: errorMessage,
      },
      { status: 500 }
    )
  }
}
