import { NextRequest, NextResponse } from 'next/server'
import { llmService } from '@/lib/llm'
import { LandingContent } from '@/lib/llm/types' // Assuming this type is compatible with section structures
import siteMetadata from '@/data/siteMetadata'
import { generateImagesForLandingContent } from '@/lib/llm/generateLandingImages'
import { supabase } from '@/lib/supabaseClient'

export const dynamic = 'force-dynamic' // Allow dynamic operations
export const revalidate = 0

const DEFAULT_LANDING_PAGE_SLUG = 'main-landing'

async function saveGeneratedContentToSupabase(slug: string, generatedContent: LandingContent) {
  console.log(`Saving generated content to Supabase for slug: ${slug}`)

  // 1. Fetch the landing page entry to get its ID and current page_type
  const { data: pageData, error: pageFetchError } = await supabase
    .from('landing_pages')
    .select('id, page_type')
    .eq('slug', slug)
    .single()

  if (pageFetchError) {
    if (pageFetchError.code === 'PGRST116') { // Not found
      // Optionally, create the page if it doesn't exist, or throw an error.
      // For now, let's assume it should exist if we're generating content for it.
      console.error(`Landing page with slug '${slug}' not found. Cannot save generated content.`)
      throw new Error(`Landing page with slug '${slug}' not found.`)
    }
    console.error(`Error fetching landing page for slug ${slug}:`, pageFetchError)
    throw pageFetchError
  }

  const pageId = pageData.id
  const currentPageType = pageData.page_type
  const newPageType = generatedContent.pageType // The AI generates content including a pageType

  // 2. Update page_type in landing_pages if it has changed due to generation
  if (newPageType && newPageType !== currentPageType) {
    const { error: updatePageTypeError } = await supabase
      .from('landing_pages')
      .update({ page_type: newPageType, updated_at: new Date().toISOString() })
      .eq('id', pageId)
    if (updatePageTypeError) {
      console.error(`Error updating page_type for pageId ${pageId}:`, updatePageTypeError)
      throw updatePageTypeError
    }
    console.log(`Updated page_type to '${newPageType}' for pageId ${pageId} based on generation.`)
  }

  // 3. Upsert sections into page_content
  const sectionsToUpsert = []
  let displayOrder = 0
  for (const sectionSlug in generatedContent) {
    if (sectionSlug === 'pageType') {
      continue
    }
    if (Object.prototype.hasOwnProperty.call(generatedContent, sectionSlug)) {
      sectionsToUpsert.push({
        page_id: pageId,
        section_slug: sectionSlug,
        content: (generatedContent as any)[sectionSlug],
        display_order: displayOrder++,
        is_active: true,
      })
    }
  }

  if (sectionsToUpsert.length > 0) {
      const { error: upsertError } = await supabase
          .from('page_content')
          .upsert(sectionsToUpsert, {
              onConflict: 'page_id,section_slug',
          })

      if (upsertError) {
          console.error(`Error upserting generated page content for pageId ${pageId}:`, upsertError)
          throw upsertError
      }
      console.log(`Successfully upserted ${sectionsToUpsert.length} generated sections for pageId ${pageId}.`)
  }

  // Update landing_page's updated_at timestamp
  const { error: updatePageTimestampError } = await supabase
    .from('landing_pages')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', pageId);
  if (updatePageTimestampError) {
    console.warn(`Could not update landing_pages.updated_at for pageId ${pageId} after generation:`, updatePageTimestampError);
  }
}


export async function POST(request: NextRequest) {
  try {
    const { description, pageType: requestedPageType, targetSlug } = await request.json()
    const slugToUse = targetSlug || DEFAULT_LANDING_PAGE_SLUG

    if (!description || typeof description !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Business description is required' },
        { status: 400 }
      )
    }

    if (requestedPageType && typeof requestedPageType !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Invalid page type format' },
        { status: 400 }
      )
    }

    const contentLanguage = siteMetadata.language
    console.log(`API: Generating landing content in site language: ${contentLanguage} for page type: ${requestedPageType || 'any (AI determined)'}`)

    const result = await llmService.generateLandingContent(description, contentLanguage, requestedPageType)

    if (result.error) {
      return NextResponse.json({ success: false, message: result.error }, { status: 500 })
    }

    let contentJson: LandingContent
    try {
      contentJson = JSON.parse(result.content) as LandingContent
    } catch (error) {
      console.error('Error parsing generated content:', error)
      return NextResponse.json(
        { success: false, message: 'Failed to parse generated content' },
        { status: 500 }
      )
    }

    // This function might also need updates if image URLs are to be stored in Supabase eventually
    await generateImagesForLandingContent(contentJson)

    // Save the updated content to Supabase instead of a file
    await saveGeneratedContentToSupabase(slugToUse, contentJson)

    return NextResponse.json({
      success: true,
      content: contentJson, // Return the generated content as before
    })
  } catch (error: unknown) {
    console.error('Error generating landing content:', error)
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'An error occurred while generating landing content',
      },
      { status: 500 }
    )
  }
}
