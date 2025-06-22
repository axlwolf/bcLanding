import { NextRequest, NextResponse } from 'next/server'
import { llmService } from '@/lib/llm'
import siteMetadata from '@/data/siteMetadata'

export const maxDuration = 60 // Set max duration to 60 seconds for long-running operations

/**
 * API route to generate blog content from various sources (text, URL, PDF)
 */
export async function POST(request: NextRequest) {
  try {
    // Handle JSON request (text or URL)
    const body = await request.json()
    const { sourceType, content, url } = body

    if (sourceType === 'text' && content) {
      console.log('(route:generate-from-source)Generating content from text:', content)
      // Generate content from provided text
      const generatedContent = await generateContentFromText(content)
      return NextResponse.json(generatedContent)
    } else if (sourceType === 'url' && url) {
      console.log('(route:generate-from-source)Generating content from URL:', url)
      // Fetch content from URL and generate content
      let proxyUrl = '/api/allset/proxy-url'
      if (typeof window === 'undefined') {
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
        proxyUrl = baseUrl + '/api/allset/proxy-url'
      }
      const response = await fetch(proxyUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: url }),
      })
      const proxyResult = await response.json()
      if (!proxyResult.content) {
        throw new Error('No content extracted from URL')
      }
      const generatedContent = await generateContentFromText(proxyResult.content)
      return NextResponse.json(generatedContent)
    } else {
      return NextResponse.json(
        { message: 'Invalid request. Required fields missing.' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Error generating content from source:', error)
    return NextResponse.json(
      {
        message:
          'Failed to generate content: ' +
          (error instanceof Error ? error.message : 'Unknown error'),
      },
      { status: 500 }
    )
  }
}

/**
 * Generate blog content from text using LLM service
 * @param text The source text to generate content from
 * @returns Generated blog content
 */
async function generateContentFromText(text: string) {
  // Helper to attempt generation and parsing
  async function attemptGeneration(attempt: number) {
    // Use the site's language setting
    const contentLanguage = siteMetadata.language
    console.log(
      `API: Generating blog content from source in site language: ${contentLanguage} (attempt ${attempt})`
    )

    // Use the LLM service to generate content
    const result = await llmService.generateContentFromSource(text, contentLanguage)

    if (result.error) {
      throw new Error(result.error)
    }

    const raw = typeof result.content === 'string' ? result.content : JSON.stringify(result.content)
    // Try to extract the first JSON object from the string
    const jsonMatch = raw.match(/{[\s\S]*}/)
    if (!jsonMatch) {
      throw new Error('No JSON object found in LLM response')
    }
    const jsonString = jsonMatch[0]
    try {
      const parsedContent = JSON.parse(jsonString)
      return parsedContent
    } catch (error) {
      console.error(`[Attempt ${attempt}] JSON parse error:`, error, 'Raw:', jsonString)
      throw new Error('Failed to parse LLM JSON output')
    }
  }

  // Try once, then retry if failure
  try {
    return await attemptGeneration(1)
  } catch (err1) {
    console.warn('First attempt to generate content failed, retrying...')
    try {
      return await attemptGeneration(2)
    } catch (err2) {
      // Compose a more verbal error for the frontend
      const errorMessage =
        'Sorry, the blog content could not be generated automatically. This may be due to an unexpected response from the AI service. Please try again in a few minutes, or edit your input and try again.'
      console.error('Second attempt failed:', err2)
      throw new Error(errorMessage)
    }
  }
}
