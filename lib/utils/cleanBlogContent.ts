// Utility to clean blog content as in app/api/allset/generate-blog-content/route.ts
// DO NOT MODIFY LOGIC, just extract as a function

export function cleanBlogContent(resultContent: string): string {
  let cleanContent = resultContent
  try {
    const trimmedContent = cleanContent.trim()

    // First, check if content is a JSON array (like in your example)
    if (trimmedContent.startsWith('[') && trimmedContent.endsWith(']')) {
      try {
        const parsedArray = JSON.parse(trimmedContent)

        // Check if it's an array with objects that have blog_post field
        if (Array.isArray(parsedArray) && parsedArray.length > 0) {
          // Case 1: Array with objects that have blog_post field
          if (parsedArray[0] && typeof parsedArray[0] === 'object' && parsedArray[0].blog_post) {
            cleanContent = parsedArray[0].blog_post
            return cleanContent
          }
          // Case 2: Array with a single string
          else if (typeof parsedArray[0] === 'string') {
            cleanContent = parsedArray[0]
            return cleanContent
          }
        }
      } catch (arrayError) {
        // If JSON parsing fails, try regex extraction for the common array format
        const arrayObjectPattern = /\[\s*{\s*"blog_post"\s*:\s*"([\s\S]+?)"\s*}\s*\]/
        const arrayObjectMatch = trimmedContent.match(arrayObjectPattern)

        if (arrayObjectMatch && arrayObjectMatch[1]) {
          cleanContent = arrayObjectMatch[1]
            .replace(/\\n/g, '\n')
            .replace(/\\r/g, '')
            .replace(/\\"([^"]*)\\"/g, '"$1"')
          return cleanContent
        }
      }
    }

    // Check if the content looks like a JSON object
    if (trimmedContent.startsWith('{')) {
      try {
        // Try to parse as JSON
        const parsedContent = JSON.parse(trimmedContent)

        // Look for common content field names
        const contentField =
          parsedContent.blog_post ||
          parsedContent.content ||
          parsedContent.markdown ||
          parsedContent.text ||
          parsedContent.body ||
          parsedContent.post

        if (contentField) {
          cleanContent = contentField
        } else {
          // If no known field found, check all fields for markdown-like content
          for (const key in parsedContent) {
            const value = parsedContent[key]
            if (
              typeof value === 'string' &&
              (value.includes('#') ||
                value.includes('##') ||
                value.includes('*') ||
                value.includes('-'))
            ) {
              cleanContent = value
              break
            }
          }
        }
      } catch (jsonError) {
        // If JSON parsing fails, try regex extraction
        // First try to extract from array format
        const arrayPattern = /\[\s*{\s*"blog_post"\s*:\s*"([\s\S]+?)"\s*}\s*\]/
        const arrayMatch = trimmedContent.match(arrayPattern)

        if (arrayMatch && arrayMatch[1]) {
          cleanContent = arrayMatch[1]
            .trim()
            .replace(/\\n/g, '\n')
            .replace(/\\r/g, '')
            .replace(/\\\\n/g, '\n')
            .replace(/\\\\r/g, '')
            .replace(/\\"([^"]*)\\"/g, '"$1"')
        } else {
          // Try other field names with regex
          const fieldNames = ['blog_post', 'content', 'markdown', 'text', 'body', 'post']

          for (const field of fieldNames) {
            const pattern1 = new RegExp(`"${field}"\\s*:\\s*"([\\s\\S]+?)"(?=\\s*[,}])`)
            const pattern2 = new RegExp(`"${field}"\\s*:\\s*([\\s\\S]+?)(?=\\s*[,}])`)

            const match1 = trimmedContent.match(pattern1)
            const match2 = trimmedContent.match(pattern2)
            const contentMatch = match1 || match2

            if (contentMatch && contentMatch[1]) {
              cleanContent = contentMatch[1]
                .trim()
                .replace(/^"(.*)"$/g, '$1')
                .replace(/\\n/g, '\n')
                .replace(/\\r/g, '')
                .replace(/\\\\n/g, '\n')
                .replace(/\\\\r/g, '')
                .replace(/\\"([^"]*)\\"/g, '"$1"')
              break
            }
          }
        }
      }
    }
  } catch (error) {
    // If cleaning fails, return original
  }
  return cleanContent
}
