/**
 * Injects inline images into markdown content after specified section headings or unique phrases.
 * @param mdx The markdown content
 * @param images Array of { imagePath, altText, section } to insert
 * @returns The markdown with images injected
 */
export function injectInlineImages(
  mdx: string,
  images: Array<{ imagePath: string; altText: string; section: string }>
): string {
  let updated = mdx
  images.forEach(({ imagePath, altText, section }) => {
    // Find the section heading or unique phrase
    const sectionRegex = new RegExp(`(^|\n)(${escapeRegExp(section)})(\n|$)`, 'm')
    const match = updated.match(sectionRegex)
    if (match && match.index !== undefined) {
      // Insert image markdown after the section heading/phrase
      const insertPos = match.index + match[0].length
      updated =
        updated.slice(0, insertPos) +
        `\n\n<img src="${imagePath}" alt="${altText.replace(/"/g, '&quot;')}" className="blog-image" />\n` +
        updated.slice(insertPos)
    } else {
      // If not found, append to the end
      updated += `\n\n<img src="${imagePath}" alt="${altText.replace(/"/g, '&quot;')}" className="blog-image" />\n`
    }
  })
  return updated
}

function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
