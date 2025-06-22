import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

/**
 * Utility functions for handling YAML frontmatter in MDX files
 */

/**
 * Format a string for YAML frontmatter, handling special characters
 *
 * @param str The string to format
 * @returns Properly formatted string for YAML
 */
export const formatYamlString = (str: string): string => {
  // Check if the string contains characters that need special handling
  const hasSpecialChars =
    str.includes(':') ||
    str.includes("'") ||
    str.includes('"') ||
    str.includes('\n') ||
    str.includes('#') ||
    str.includes('&')

  if (!hasSpecialChars) {
    // Simple case - no special characters
    return `'${str}'`
  }

  // If string has single quotes, use double quotes and escape any double quotes in the content
  if (str.includes("'")) {
    return `"${str.replace(/"/g, '\\"')}"`
  }

  // Default to single quotes with proper escaping
  return `'${str.replace(/'/g, "''")}'`
}

/**
 * Format a summary for YAML frontmatter, handling special characters
 *
 * @param summary The summary text
 * @returns Properly formatted summary for YAML
 */
export const formatSummary = (summary: string): string => {
  // If summary contains newlines or special characters, use block scalar
  if (
    summary.includes('\n') ||
    summary.includes(':') ||
    summary.includes("'") ||
    summary.includes('"')
  ) {
    return `summary: |\n  ${summary.replace(/\n/g, '\n  ')}`
  }
  return `summary: ${formatYamlString(summary)}`
}

/**
 * Format an array of strings for YAML frontmatter
 *
 * @param items Array of strings to format
 * @returns Properly formatted array for YAML
 */
export const formatYamlArray = (items: string[]): string => {
  if (!items || items.length === 0) return '[]'

  return `[${items.map((item) => formatYamlString(item.trim())).join(', ')}]`
}

/**
 * Generate complete frontmatter for a blog post
 *
 * @param postData The blog post data
 * @returns Formatted frontmatter string
 */
export const generateFrontmatter = (postData: {
  title: string
  date: string
  slug: string
  tags?: string[]
  authors?: string[]
  draft?: boolean
  summary: string
}): string => {
  const frontmatter = [
    '---',
    `title: ${formatYamlString(postData.title)}`,
    `date: '${postData.date}'`,
    `slug: '${postData.slug}'`,
    postData.tags && postData.tags.length > 0 ? `tags: ${formatYamlArray(postData.tags)}` : null,
    postData.authors && postData.authors.length > 0
      ? `authors: ${formatYamlArray(postData.authors)}`
      : null,
    postData.draft ? 'draft: true' : 'draft: false',
    formatSummary(postData.summary),
    '---',
  ]
    .filter(Boolean)
    .join('\n')

  return frontmatter
}

/**
 * Get existing blog titles from the data/blog directory
 * @returns Array of existing blog titles and their slugs
 */
export const getExistingBlogTitles = (): { title: string; slug: string }[] => {
  try {
    const blogDir = path.join(process.cwd(), 'data/blog')
    if (!fs.existsSync(blogDir)) {
      console.warn('Blog directory not found:', blogDir)
      return []
    }

    const files = fs.readdirSync(blogDir)
    const mdxFiles = files.filter((file) => file.endsWith('.mdx') || file.endsWith('.md'))

    return mdxFiles.map((file) => {
      const filePath = path.join(blogDir, file)
      const fileContent = fs.readFileSync(filePath, 'utf8')
      const { data } = matter(fileContent)
      return {
        title: data.title || '',
        slug: file.replace(/\.(mdx|md)$/, ''),
      }
    })
  } catch (error) {
    console.error('Error reading blog titles:', error)
    return []
  }
}
