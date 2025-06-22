/**
 * Injects a hero image markdown after the frontmatter in an MDX/Markdown string.
 * @param mdx The full MDX/Markdown content (with frontmatter)
 * @param imagePath The image path to inject (e.g., /static/images/blogs/slug-hero.png)
 * @param altText The alt text for the image (default: 'Hero Image')
 * @returns The MDX with the hero image injected after frontmatter
 */
export function injectHeroImage(
  mdx: string,
  imagePath: string,
  altText: string = 'Hero Image'
): string {
  // Find the end of the frontmatter (--- on its own line, twice)
  const frontmatterEnd = mdx.indexOf('---', 3)
  if (mdx.startsWith('---') && frontmatterEnd !== -1) {
    const afterFrontmatter = mdx.slice(frontmatterEnd + 3).replace(/^\s+/, '')
    return (
      mdx.slice(0, frontmatterEnd + 3) +
      '\n\n' +
      `![${altText}](${imagePath})` +
      '\n' +
      afterFrontmatter
    )
  }
  // If no frontmatter, just prepend
  return `![${altText}](${imagePath})\n` + mdx
}
