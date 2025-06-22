import { NextRequest, NextResponse } from 'next/server'
import { allBlogs } from 'contentlayer/generated'
import { llmService } from '@/lib/llm'
import siteMetadata from '@/data/siteMetadata'
import { cleanBlogContent } from '@/lib/utils/cleanBlogContent'
import { injectHeroImage } from '@/lib/utils/injectHeroImage'
import { llmImageService } from '@/lib/llm/imageService'
import fs from 'fs/promises'
import path from 'path'

// For static export, we need to handle this differently
export const dynamic = 'error'

export async function POST(request: NextRequest) {
  try {
    // Extract title and description from request body
    const { title, description } = await request.json()

    if (!title || !description) {
      return NextResponse.json(
        { success: false, message: 'Title and description are required' },
        { status: 400 }
      )
    }

    // Get information about existing blog posts for internal linking
    const existingPosts = allBlogs
      .filter((post) => !post.draft)
      .map((post) => ({
        title: post.title,
        slug: post.slug,
        summary: post.summary,
        tags: post.tags,
      }))
      .slice(0, 5) // Limit to 5 posts for context

    // Format existing posts information
    const existingPostsInfo =
      existingPosts.length > 0
        ? existingPosts
            .map((post) => `- "${post.title}" (slug: ${post.slug}) - ${post.summary}`)
            .join('\n')
        : 'No existing posts yet.'

    // Always use the site's language setting
    const contentLanguage = siteMetadata.language
    console.log(`API: Generating blog content in site language: ${contentLanguage}`)

    // Generate blog content using LLM service
    const result = await llmService.generateBlogContent(
      title,
      description,
      existingPostsInfo,
      contentLanguage
    )

    if (result.error) {
      console.error('Error generating blog content:', result.error)
      return NextResponse.json({ success: false, message: result.error }, { status: 500 })
    }

    // Parse the JSON returned by the LLM
    let parsed: {
      content: string
      coverImagePrompt: string
      inlineImagePrompts?: Array<{ prompt: string; section: string }>
    }
    try {
      parsed = typeof result.content === 'string' ? JSON.parse(result.content) : result.content
    } catch (err) {
      console.error('Error parsing LLM JSON output:', err)
      return NextResponse.json(
        { success: false, message: 'Failed to parse LLM JSON output', raw: result.content },
        { status: 500 }
      )
    }

    // Clean up the markdown content
    let cleanContent = cleanBlogContent(parsed.content)

    // Generate slug (same as frontmatter convention)
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '')

    // Generate hero image
    let heroImagePath = `/static/images/blogs/${slug}-hero.png`
    try {
      const imageRes = await llmImageService.generateImage({
        prompt: 'Avoid using any text in the image. ' + parsed.coverImagePrompt,
        aspectRatio: '16:9',
      })
      if (imageRes.success && imageRes.image_data) {
        const imgDir = path.join(process.cwd(), 'public/static/images/blogs')
        await fs.mkdir(imgDir, { recursive: true })
        const imgPath = path.join(imgDir, `${slug}-hero.png`)
        await fs.writeFile(imgPath, Buffer.from(imageRes.image_data, 'base64'))
      } else {
        console.warn('Image generation failed:', imageRes.error)
        heroImagePath = '/static/images/hero.jpg' // fallback
      }
    } catch (e) {
      console.error('Error generating hero image:', e)
      heroImagePath = '/static/images/hero.jpg' // fallback
    }

    // Inject hero image after frontmatter
    cleanContent = injectHeroImage(cleanContent, heroImagePath, parsed.coverImagePrompt)

    // Handle inline images
    if (Array.isArray(parsed.inlineImagePrompts)) {
      const inlineImages: Array<{ imagePath: string; altText: string; section: string }> = []
      for (let i = 0; i < parsed.inlineImagePrompts.length; i++) {
        const { prompt, section } = parsed.inlineImagePrompts[i] || {}
        if (typeof prompt === 'string' && typeof section === 'string') {
          const imagePath = `/static/images/blogs/${slug}-inline-${i + 1}.png`
          try {
            const imageRes = await llmImageService.generateImage({ prompt, aspectRatio: '16:9' })
            if (imageRes.success && imageRes.image_data) {
              const imgDir = path.join(process.cwd(), 'public/static/images/blogs')
              await fs.mkdir(imgDir, { recursive: true })
              const imgFile = path.join(imgDir, `${slug}-inline-${i + 1}.png`)
              await fs.writeFile(imgFile, Buffer.from(imageRes.image_data, 'base64'))
            } else {
              console.warn('Inline image generation failed:', imageRes.error)
            }
          } catch (e) {
            console.error('Error generating inline image:', e)
          }
          inlineImages.push({ imagePath, altText: prompt, section })
        }
      }
      // Inject all inline images
      const { injectInlineImages } = await import('@/lib/utils/injectInlineImages')
      cleanContent = injectInlineImages(cleanContent, inlineImages)
    }

    return NextResponse.json({
      success: true,
      content: cleanContent,
      slug,
      heroImage: heroImagePath,
    })
  } catch (error: unknown) {
    console.error('Error generating blog content:', error)
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'An error occurred while generating blog content',
      },
      { status: 500 }
    )
  }
}
