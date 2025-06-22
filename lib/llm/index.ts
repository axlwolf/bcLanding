/**
 * Unified LLM service that supports multiple providers
 */

import { OpenAIProvider } from './providers/openai'
import { GoogleGenAIProvider } from './providers/google-genai'
import { LLMProvider, LLMResponse } from './types'
import { BLOG_CONTENT_PROMPT, BLOG_TITLES_PROMPT, LANDING_CONTENT_PROMPT } from '../constants'
import { generateImagesForLandingContent } from './generateLandingImages'
import { getTemplateStringForPageType } from '../utils/typeToTemplate'
import { PageType } from '../../app/allset/landing-content/types'
import { getExistingBlogTitles } from '../utils/frontmatter'
import { allBlogs } from 'contentlayer/generated'
import siteMetadata from '@/data/siteMetadata'

/**
 * LLM service that provides a unified interface for different LLM providers
 */
export class LLMService {
  private provider: LLMProvider

  constructor() {
    // Initialize the provider based on environment variables
    const providerType = process.env.LLM_API_PROVIDER || 'openai'
    const apiKey = process.env.LLM_API_KEY || 'API_KEY_NOT_SET'
    const model = process.env.LLM_MODEL || 'gpt-3.5-turbo'
    const apiUrl = process.env.LLM_API_URL || 'http://localhost:11434/v1'

    if (!apiKey) {
      throw new Error('LLM_API_KEY is required')
    }

    switch (providerType.toLowerCase()) {
      case 'openai':
        this.provider = new OpenAIProvider(apiKey, model)
        break
      case 'google-genai':
        this.provider = new GoogleGenAIProvider(apiKey, model)
        break
      // Add more providers as needed
      default:
        throw new Error(`Unsupported LLM provider: ${providerType}`)
    }
  }

  /**
   * Generate landing content based on user input
   * @param businessDescription Description of the business or SaaS product
   * @param language The language code to generate content in (defaults to 'en-us')
   * @param pageType The type of landing page to generate (product, youtube, etc.)
   * @returns Generated landing content as JSON
   */
  async generateLandingContent(
    businessDescription: string,
    language: string = 'en-us',
    pageType: string = 'product'
  ): Promise<LLMResponse> {
    // Get language instruction or default to English if language not supported
    const languageInstruction =
      this.languageInstructions[language] || this.languageInstructions['en-us']

    // Generate dynamic template string based on page type
    const template = getTemplateStringForPageType(pageType as PageType)

    // Add page type instruction to the prompt
    const pageTypeInstruction = `\nCreate content for a "${pageType}" type landing page following this structure:`

    // Add language instruction to the prompt
    const promptWithLanguage = `${languageInstruction}\n\nGenerate the landing page content in ${language === 'es-mx' ? 'Spanish' : 'English'}.${pageTypeInstruction}\n\n${LANDING_CONTENT_PROMPT}\n${template}\n\nBusiness description: ${businessDescription}`

    // Step 1: Generate landing content JSON
    const initialResponse = await this.provider.generateContent(promptWithLanguage)
    if (!initialResponse.content) return initialResponse

    let landingContentObj: Record<string, unknown> | unknown[]
    try {
      landingContentObj =
        typeof initialResponse.content === 'string'
          ? JSON.parse(initialResponse.content)
          : initialResponse.content
    } catch (err) {
      return {
        error: 'Failed to parse landing content JSON',
        content: initialResponse.content,
      }
    }

    // Step 2: Generate images for all imagePrompt fields
    await generateImagesForLandingContent(landingContentObj)

    // Step 3: Return the updated content
    return initialResponse
  }

  /**
   * Generate SEO blog titles based on landing page content
   * @param landingContent The landing page content JSON
   * @param language The language code to generate titles in (defaults to 'en-us')
   * @returns Generated blog titles as JSON array
   */
  async generateBlogTitles(
    landingContent: string,
    language: string = 'en-us'
  ): Promise<LLMResponse> {
    // Get language instruction or default to English if language not supported
    const languageInstruction =
      this.languageInstructions[language] || this.languageInstructions['en-us']

    // Get existing blog titles to avoid repetition
    const existingBlogTitles = getExistingBlogTitles()
    const existingTitlesText =
      existingBlogTitles.length > 0
        ? `\n\nEXISTING BLOG TITLES (DO NOT REPEAT THESE):\n${existingBlogTitles.map((blog) => `- "${blog.title}"`).join('\n')}`
        : ''

    // Add language instruction and existing titles to the prompt
    const promptWithLanguage = `${languageInstruction}\n\n${BLOG_TITLES_PROMPT}${existingTitlesText}\n\n${landingContent}`

    return this.provider.generateContent(promptWithLanguage)
  }

  /**
   * Language instructions map for multilingual content generation
   * This can be easily extended with more languages in the future
   */
  private languageInstructions: Record<string, string> = {
    'en-us': 'Write this blog post in English (US). Use American English spelling and expressions.',
    'es-mx':
      'Write this blog post in Spanish (Mexican dialect). Ensure all content, including headings, lists, and tables are in Spanish. Use expressions and terminology common in Mexico.',
    // Add more languages as needed, for example:
    // 'fr-fr': 'Write this blog post in French (France). Ensure all content is in French...',
    // 'pt-br': 'Write this blog post in Portuguese (Brazilian). Ensure all content is in Brazilian Portuguese...',
  }

  /**
   * Generate blog content based on title and description
   * @param title The blog post title
   * @param description Brief description of the blog post
   * @param existingPosts Information about existing blog posts for internal linking
   * @param language - The language code to generate content in (defaults to 'en-us')
   */
  async generateBlogContent(
    title: string,
    description: string,
    existingPostsInfo: string,
    language: string = 'en-us'
  ) {
    // Get language instruction or default to English if language not supported
    const languageInstruction =
      this.languageInstructions[language] || this.languageInstructions['en-us']

    const prompt = BLOG_CONTENT_PROMPT.replace('{{title}}', title)
      .replace('{{description}}', description)
      .replace('{{existingPosts}}', existingPostsInfo)

    // Add language instruction to the prompt
    const promptWithLanguage = `${languageInstruction}\n\n${prompt}`

    const result = await this.provider.generateContent(promptWithLanguage)

    return result
  }

  /**
   * Generate blog content from source text (URL, PDF, or pasted text)
   * @param sourceText The source text to generate content from
   * @param language The language code to generate content in (defaults to 'en-us')
   * @returns Generated blog post with title, summary, content, and tags
   */
  async generateContentFromSource(
    sourceText: string,
    language: string = 'en-us'
  ): Promise<LLMResponse> {
    // Get language instruction or default to English if language not supported
    const languageInstruction =
      this.languageInstructions[language] || this.languageInstructions['en-us']

    // Truncate text if it's too long (most LLMs have token limits)
    const truncatedText =
      sourceText.length > 10000 ? sourceText.substring(0, 10000) + '...' : sourceText

    // Step 1: Generate a blog title and description based on the source text
    // Get existing blog titles to avoid repetition
    const existingBlogTitles = getExistingBlogTitles()
    const existingTitlesText =
      existingBlogTitles.length > 0
        ? `\n\nEXISTING BLOG TITLES (DO NOT REPEAT THESE):\n${existingBlogTitles.map((blog) => `- "${blog.title}"`).join('\n')}`
        : ''

    // Generate only 1 blog title
    const modifiedBlogTitlesPrompt = BLOG_TITLES_PROMPT.replace(
      'generate 5 blog post titles',
      'generate 1 blog post title'
    )

    // Add the source text and brand info to the prompt
    const brandInfo = `ABOUT OUR BRAND:\nBrand Name: ${siteMetadata.title}\nDescription: ${siteMetadata.description}\n`

    // Add language instruction, brand info, and existing titles to the prompt
    const titlePrompt = `${languageInstruction}\n\n${brandInfo}\n${modifiedBlogTitlesPrompt}${existingTitlesText}\n\nSOURCE CONTENT:\n${truncatedText}\n\nBased on this source content, create a title that aligns with our brand. Do not mention other brands or businesses in the title.`

    const titleResponse = await this.provider.generateContent(titlePrompt)

    if (titleResponse.error) {
      return titleResponse
    }

    // Parse the title response
    let titleData
    try {
      titleData =
        typeof titleResponse.content === 'string'
          ? JSON.parse(titleResponse.content)
          : titleResponse.content

      // Make sure we have an array with at least one item
      if (!Array.isArray(titleData) || titleData.length === 0) {
        throw new Error('Invalid title data format')
      }
    } catch (error) {
      console.error('Error parsing title data:', error)
      return {
        error: 'Failed to generate blog title',
        content: '',
      }
    }

    // Get the first title suggestion
    const titleSuggestion = titleData[0]

    // Step 2: Generate the blog content using the title, description AND source text
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

    // Create a custom prompt that includes the source text
    const customContentPrompt = BLOG_CONTENT_PROMPT.replace('{{title}}', titleSuggestion.title)
      .replace('{{description}}', titleSuggestion.description)
      .replace('{{existingPosts}}', existingPostsInfo)

    const contentPromptWithSource = `${languageInstruction}\n\n${brandInfo}\n${customContentPrompt}\n\nSOURCE CONTENT TO USE AS REFERENCE:\n${truncatedText}\n\nUse the above source content to inform and enrich your blog post. Extract key information, quotes, data points, and insights from the source to create a comprehensive and informative article that aligns with our brand. Do not mention other brands or businesses by name - reframe the content to be about our brand and our offerings. If the source mentions competitors or other solutions, present our brand as the solution instead.`

    // Generate content using the custom prompt with source text
    const contentResponse = await this.provider.generateContent(contentPromptWithSource)

    if (contentResponse.error) {
      return contentResponse
    }

    // Parse the content response
    let contentData
    try {
      contentData =
        typeof contentResponse.content === 'string'
          ? JSON.parse(contentResponse.content)
          : contentResponse.content
    } catch (error) {
      console.error('Error parsing content data:', error)
      return {
        error: 'Failed to generate blog content',
        content: '',
      }
    }

    // Combine the title and content data
    const result = {
      title: titleSuggestion.title,
      summary: titleSuggestion.description,
      content: contentData.content || '',
      tags: titleSuggestion.tags,
      coverImagePrompt: contentData.coverImagePrompt || '',
      inlineImagePrompts: contentData.inlineImagePrompts || [],
    }

    return {
      content: JSON.stringify(result),
      error: undefined,
    }
  }
}

// Export a singleton instance
export const llmService = new LLMService()
