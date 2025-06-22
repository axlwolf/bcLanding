/**
 * Test script to verify the dynamic template generation utility
 */
import { getTemplateStringForPageType } from './lib/utils/typeToTemplate'
import { PageType } from './app/allset/landing-content/types'
import { LANDING_CONTENT_PROMPT } from './lib/constants'

// Test generating templates for different page types
const productTemplate = getTemplateStringForPageType('product' as PageType)
const youtubeTemplate = getTemplateStringForPageType('youtube' as PageType)

console.log('=== LANDING CONTENT PROMPT ===')
console.log(LANDING_CONTENT_PROMPT)
console.log('\n\n=== PRODUCT TEMPLATE ===')
console.log(productTemplate)
console.log('\n\n=== YOUTUBE TEMPLATE ===')
console.log(youtubeTemplate)

// Simulate the prompt construction as done in LLMService
const businessDescription =
  'A SaaS product that helps businesses automate their marketing workflows.'
const language = 'en-us'
const pageType = 'product'

const languageInstruction = 'Generate content in English that is clear, professional, and engaging.'
const template = getTemplateStringForPageType(pageType as PageType)
const pageTypeInstruction = `\nCreate content for a "${pageType}" type landing page following this structure:`

const promptWithLanguage = `${languageInstruction}\n\nGenerate the landing page content in English.${pageTypeInstruction}\n\n${LANDING_CONTENT_PROMPT}\n${template}\n\nBusiness description: ${businessDescription}`

console.log('\n\n=== FINAL PROMPT ===')
console.log(promptWithLanguage)
