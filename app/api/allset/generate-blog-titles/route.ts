import { NextRequest, NextResponse } from 'next/server'
import { llmService } from '@/lib/llm'
import { BlogTitleSuggestion } from '@/lib/llm/types'
import siteMetadata from '@/data/siteMetadata'
import { supabase } from '@/lib/supabaseClient'

export const dynamic = 'force-dynamic' // Allow dynamic operations
export const revalidate = 0

const DEFAULT_LANDING_PAGE_SLUG = 'main-landing'

async function fetchLandingContentFromSupabase(slug: string) {
  // 1. Fetch the landing page entry
  const { data: pageData, error: pageError } = await supabase
    .from('landing_pages')
    .select('id, page_type')
    .eq('slug', slug)
    .single()

  if (pageError) {
    if (pageError.code === 'PGRST116') { // Not found
      console.error(`Landing page with slug '${slug}' not found for blog title generation.`)
      throw new Error(`Landing page with slug '${slug}' not found.`)
    }
    console.error(`Error fetching landing page for slug ${slug} (blog titles):`, pageError)
    throw pageError
  }

  // 2. Fetch its content sections
  const { data: sectionsData, error: sectionsError } = await supabase
    .from('page_content')
    .select('section_slug, content')
    .eq('page_id', pageData.id)
    .order('display_order', { ascending: true })

  if (sectionsError) {
    console.error(`Error fetching page content for page_id ${pageData.id} (blog titles):`, sectionsError)
    throw sectionsError
  }

  // 3. Reconstruct the JSON object
  const reconstructedContent: { [key: string]: any } = {
    pageType: pageData.page_type,
  }
  sectionsData.forEach((section) => {
    reconstructedContent[section.section_slug] = section.content
  })
  return reconstructedContent
}

export async function POST(request: NextRequest) { // POST request seems more appropriate if it's initiating an action
  try {
    // Expect a targetSlug in the request body, or use default
    // const { targetSlug } = await request.json(); // If you want to specify via request body
    // For simplicity, using default or query param for now
    const { searchParams } = new URL(request.url)
    const slugToUse = searchParams.get('slug') || DEFAULT_LANDING_PAGE_SLUG

    console.log(`API: Fetching landing content for slug '${slugToUse}' to generate blog titles.`)
    const landingContentJson = await fetchLandingContentFromSupabase(slugToUse)
    const landingContentString = JSON.stringify(landingContentJson)

    const contentLanguage = siteMetadata.language
    console.log(`API: Generating blog titles in site language: ${contentLanguage}`)

    const result = await llmService.generateBlogTitles(landingContentString, contentLanguage)

    if (result.error) {
      return NextResponse.json({ success: false, message: result.error }, { status: 500 })
    }

    let titleSuggestions: BlogTitleSuggestion[]
    try {
      titleSuggestions = JSON.parse(result.content) as BlogTitleSuggestion[]
    } catch (error) {
      console.error('Error parsing generated blog titles:', error)
      return NextResponse.json(
        { success: false, message: 'Failed to parse generated blog titles' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      titles: titleSuggestions,
    })
  } catch (error: unknown) {
    console.error('Error generating blog titles:', error)
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : 'An error occurred while generating blog titles',
      },
      { status: 500 }
    )
  }
}
