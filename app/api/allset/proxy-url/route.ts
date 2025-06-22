import { NextRequest, NextResponse } from 'next/server'
import * as cheerio from 'cheerio'

/**
 * API route to proxy URL requests and extract main content
 */
export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ message: 'URL is required' }, { status: 400 })
    }

    // Fetch the URL content
    const response = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    })

    if (!response.ok) {
      return NextResponse.json(
        { message: `Failed to fetch URL: ${response.status}` },
        { status: response.status }
      )
    }

    const html = await response.text()

    // Extract main content using cheerio
    const extractedContent = extractMainContent(html)
    console.log('Extracted content:', extractedContent)

    return NextResponse.json({
      content: extractedContent,
      url,
    })
  } catch (error) {
    console.error('Error proxying URL:', error)
    return NextResponse.json(
      {
        message:
          'Failed to proxy URL: ' + (error instanceof Error ? error.message : 'Unknown error'),
      },
      { status: 500 }
    )
  }
}

/**
 * Extract main content from HTML
 * @param html HTML content
 * @returns Extracted main text
 */
function extractMainContent(html: string): string {
  try {
    const $ = cheerio.load(html)

    // Remove script, style, nav, footer, and other non-content elements
    $(
      'script, style, nav, footer, header, aside, .sidebar, .comments, .ad, .advertisement, .banner'
    ).remove()

    // Extract title
    const title = $('title').text() || $('h1').first().text()

    // Extract meta description
    const metaDescription = $('meta[name="description"]').attr('content') || ''

    // Try to find main content
    let mainContent = ''

    // Look for common content containers
    const contentSelectors = [
      'article',
      'main',
      '.content',
      '.post-content',
      '.entry-content',
      '.article-content',
      '#content',
      '.post',
    ]

    // Try each selector until we find content
    for (const selector of contentSelectors) {
      const element = $(selector)
      if (element.length > 0) {
        mainContent = element.text()
        break
      }
    }

    // If no content found with selectors, use body text
    if (!mainContent) {
      mainContent = $('body').text()
    }

    // Clean up the text
    mainContent = cleanText(mainContent)

    // Combine all the extracted content
    return `Title: ${title}\n\nDescription: ${metaDescription}\n\nContent:\n${mainContent}`
  } catch (error) {
    console.error('Error extracting content:', error)
    return 'Failed to extract content from the webpage.'
  }
}

/**
 * Clean up extracted text
 * @param text Text to clean
 * @returns Cleaned text
 */
function cleanText(text: string): string {
  return text
    .replace(/\\n/g, '\n')
    .replace(/\\t/g, ' ')
    .replace(/\\r/g, '')
    .replace(/\s+/g, ' ')
    .replace(/\n\s*\n\s*\n/g, '\n\n') // Remove excessive line breaks
    .trim()
}
