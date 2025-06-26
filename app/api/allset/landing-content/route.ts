import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient' // Assuming supabase client is in lib

// Ensure dynamic behavior for database operations
export const dynamic = 'force-dynamic'
export const revalidate = 0 // Disable caching for this route

// Define an interface for the objects being pushed into sectionsToUpsert
// This should match the structure of the page_content table rows for upserting
interface PageContentSectionUpsert {
  page_id: string | number // Assuming pageData.id could be string or number
  section_slug: string
  content: any // Content can be any JSON structure
  display_order: number
  is_active: boolean
}

const DEFAULT_LANDING_PAGE_SLUG = 'main-landing'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug') || DEFAULT_LANDING_PAGE_SLUG

  console.log(`GET /api/allset/landing-content - Loading content for slug: ${slug}`)

  try {
    // 1. Fetch the landing page entry
    const { data: pageData, error: pageError } = await supabase
      .from('landing_pages')
      .select('id, page_type')
      .eq('slug', slug)
      .single()

    if (pageError) {
      if (pageError.code === 'PGRST116') {
        // Not found
        return NextResponse.json(
          { message: `Landing page with slug '${slug}' not found.` },
          { status: 404 }
        )
      }
      console.error(`Error fetching landing page for slug ${slug}:`, pageError)
      throw pageError
    }

    // 2. Fetch its content sections
    const { data: sectionsData, error: sectionsError } = await supabase
      .from('page_content')
      .select('section_slug, content')
      .eq('page_id', pageData.id)
      .order('display_order', { ascending: true })

    if (sectionsError) {
      console.error(`Error fetching page content for page_id ${pageData.id}:`, sectionsError)
      throw sectionsError
    }

    // 3. Reconstruct the JSON object
    const reconstructedContent: { [key: string]: any } = {
      pageType: pageData.page_type,
    }
    sectionsData.forEach((section) => {
      reconstructedContent[section.section_slug] = section.content
    })

    return NextResponse.json(reconstructedContent)
  } catch (error: any) {
    console.error('Error in GET /api/allset/landing-content:', error.message)
    return NextResponse.json(
      { success: false, message: 'Failed to load landing content' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  // For now, assume a default slug or expect it in the body/query for multi-page support
  const slug = searchParams.get('slug') || DEFAULT_LANDING_PAGE_SLUG

  console.log(`POST /api/allset/landing-content - Saving content for slug: ${slug}`)

  try {
    const contentData = await request.json()

    if (!contentData || typeof contentData !== 'object') {
      return NextResponse.json({ message: 'Invalid content data provided.' }, { status: 400 })
    }

    // 1. Fetch the landing page entry to get its ID and current page_type
    const { data: pageData, error: pageFetchError } = await supabase
      .from('landing_pages')
      .select('id, page_type')
      .eq('slug', slug)
      .single()

    if (pageFetchError) {
      if (pageFetchError.code === 'PGRST116') {
        return NextResponse.json(
          { message: `Landing page with slug '${slug}' not found. Cannot save content.` },
          { status: 404 }
        )
      }
      console.error(`Error fetching landing page for slug ${slug}:`, pageFetchError)
      throw pageFetchError
    }

    const pageId = pageData.id
    const currentPageType = pageData.page_type
    const newPageType = contentData.pageType

    // Start a transaction
    // Note: Supabase JS client doesn't directly support transactions like SQL.
    // Operations are atomic individually. For multi-step operations needing rollback,
    // you'd typically use a Supabase Edge Function (database function).
    // Here, we'll perform operations sequentially and handle errors.

    // 2. Update page_type in landing_pages if it has changed
    if (newPageType && newPageType !== currentPageType) {
      const { error: updatePageTypeError } = await supabase
        .from('landing_pages')
        .update({ page_type: newPageType, updated_at: new Date().toISOString() })
        .eq('id', pageId)
      if (updatePageTypeError) {
        console.error(`Error updating page_type for pageId ${pageId}:`, updatePageTypeError)
        throw updatePageTypeError
      }
      console.log(`Updated page_type to '${newPageType}' for pageId ${pageId}`)
    }

    // 3. Upsert sections into page_content
    const sectionsToUpsert: PageContentSectionUpsert[] = []
    let displayOrder = 0
    for (const sectionSlug in contentData) {
      if (sectionSlug === 'pageType') {
        continue
      }
      if (Object.prototype.hasOwnProperty.call(contentData, sectionSlug)) {
        sectionsToUpsert.push({
          page_id: pageId,
          section_slug: sectionSlug,
          content: contentData[sectionSlug],
          display_order: displayOrder++,
          is_active: true,
          // updated_at will be set by the trigger
        })
      }
    }

    if (sectionsToUpsert.length > 0) {
      // To perform an upsert that updates existing records and inserts new ones,
      // we specify the conflict target. If a row with the same page_id and section_slug
      // exists, it will be updated. Otherwise, a new row is inserted.
      const { error: upsertError } = await supabase.from('page_content').upsert(sectionsToUpsert, {
        onConflict: 'page_id,section_slug',
        // defaultToNull: false, // Keep existing values for columns not specified in the upsert, if applicable
      })

      if (upsertError) {
        console.error(`Error upserting page content for pageId ${pageId}:`, upsertError)
        throw upsertError
      }
      console.log(`Successfully upserted ${sectionsToUpsert.length} sections for pageId ${pageId}.`)
    }

    // Optionally, update the landing_page's updated_at timestamp if not handled by page_type update
    if (!(newPageType && newPageType !== currentPageType) && sectionsToUpsert.length > 0) {
      const { error: updatePageTimestampError } = await supabase
        .from('landing_pages')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', pageId)
      if (updatePageTimestampError) {
        // Log this error but don't necessarily fail the whole operation if content was saved
        console.warn(
          `Could not update landing_pages.updated_at for pageId ${pageId}:`,
          updatePageTimestampError
        )
      }
    }

    return NextResponse.json({ success: true, message: 'Landing content saved successfully.' })
  } catch (error: any) {
    console.error('Landing content update error:', error.message)
    return NextResponse.json(
      { success: false, message: 'An error occurred while updating landing content' },
      { status: 500 }
    )
  }
}
