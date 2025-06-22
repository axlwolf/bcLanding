// Centralized constants for database configuration

export const SQLITE_DB_NAME = 'allset.sqlite'
export const SQLITE_DB_DIR = 'database'
export const SQLITE_DB_PATH = `${SQLITE_DB_DIR}/${SQLITE_DB_NAME}`
export const SQLITE_SCHEMA_FILE = `${SQLITE_DB_DIR}/schema.sql`

export const ALLSET_EMAILS_TABLE = 'allset_emails'
export const CONTACT_SUBMISSIONS_TABLE = 'allset_contact_submissions'
export const ALLSET_EMAIL_TEMPLATE_DATA_TABLE = 'allset_email_template_data'
export const ALLSET_CTA_CONFIG_TABLE = 'allset_cta_config'
// The landing content prompt is now dynamic and uses templates generated from types
export const LANDING_CONTENT_PROMPT = `
You are a professional landing page content creator. Your task is to create content for a landing page based on the user's description of their business or SaaS product.

Generate a complete JSON object that follows the structure for the specified page type.
// IMPORTANT: For every object in the JSON that contains an "image" field, also include an "imagePrompt" field with a detailed description of what the image should depict. This description will be used as a prompt for an AI image generator.

Based on the user's description, create a compelling and relevant landing page content. Make sure to:
1. Use the business name in appropriate headings and titles
2. Highlight the main value proposition in the hero description
3. Create relevant feature titles and descriptions
4. Generate realistic FAQs that potential customers might ask
5. Adjust pricing plans to match the business model
6. Use appropriate icons (use react-icons names like FiUsers, FiLayers, etc.)

Return ONLY the JSON object without any additional text or explanation.
`

// Prompt for generating SEO blog titles
export const BLOG_TITLES_PROMPT = `
You are an expert SEO content strategist. Your task is to generate 5 blog post titles that would attract traffic to a website based on the provided landing page content.

The titles should:
1. Be SEO-optimized with relevant keywords
2. Be compelling and clickable
3. Address pain points or interests of the target audience
4. Be relevant to the business/product described in the landing page
5. Include a mix of how-to guides, listicles, and problem-solving content

For each blog post, also generate 3-5 relevant tags that would help with SEO and content organization. Tags should be single words or short phrases that accurately categorize the content.

Return the results as a JSON array with the following structure:
[
  {
    "title": "Blog Post Title 1",
    "description": "Brief 1-2 sentence description of what this blog post would cover",
    "tags": ["tag1", "tag2", "tag3", "tag4"]
  },
  {...}
]

Landing page content:
`
export const BLOG_CONTENT_PROMPT = `
You are an expert SEO content writer. Your task is to create a comprehensive, engaging, and SEO-optimized blog post based on the provided title and description.

The blog post should:
1. Be well-structured with clear headings and subheadings (using Markdown # for h1, ## for h2, ### for h3)
2. Include an engaging introduction that hooks the reader
3. Provide valuable, actionable information throughout the content
4. Use a mix of paragraphs, bullet points, and numbered lists for better readability
5. Include at least one table where appropriate (using Markdown table syntax)
6. Reference at least 2-3 other blog posts from the site for internal linking (I'll provide some existing posts)
7. Include suggestions for 2-3 external resources or references
8. Have a clear conclusion with a call to action
9. Be optimized for SEO with appropriate keyword usage
10. Be between 1000-1500 words in length
11. Use a conversational yet professional tone

Existing blog posts for internal linking:
{{existingPosts}}

IMPORTANT: Return a JSON object with the following fields:
- "content": The full Markdown blog post as a string (do NOT wrap it in another object or add extra fields)
- "coverImagePrompt": A detailed, vivid description for a hero image that would visually represent the blog post. The prompt should be creative, relevant to the blog title and description, and suitable for AI image generation (e.g., "A modern digital illustration of a robot writing a blog post on a laptop, vibrant colors, futuristic office, digital art").
- "inlineImagePrompts": An array of 2-3 objects. Each object should have:
    - "prompt": A vivid, relevant image description for a section of the blog.
    - "section": The exact heading (or a short excerpt of the paragraph) where the image should be inserted. Use the actual markdown heading or a unique phrase from the blog content.

Example output:
{
  "content": "# Blog Title\n\n## AI for Landing Pages\n...\n## Results\n...",
  "coverImagePrompt": "A modern digital illustration of...",
  "inlineImagePrompts": [
    {
      "prompt": "A close-up of a person designing a landing page on a tablet, digital art, bright colors.",
      "section": "## AI for Landing Pages"
    },
    {
      "prompt": "A graph showing increased conversions after using AI, digital art, blue and green palette.",
      "section": "## Results"
    }
  ]
}

Title: {{title}}
Description: {{description}}
`
