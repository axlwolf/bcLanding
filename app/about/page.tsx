import { Authors, allAuthors } from 'contentlayer/generated'
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import AuthorLayout from '@/layouts/AuthorLayout'
import { coreContent } from 'pliny/utils/contentlayer'
import { genPageMetadata } from 'app/seo'
import siteMetadata from '@/data/siteMetadata'

export const metadata = genPageMetadata({ title: 'About', author: siteMetadata.author })

export default function Page() {
  // Find the author by slug from siteMetadata, fallback to 'default' if not found
  const author =
    allAuthors.find((p) => p.slug === siteMetadata.author) ||
    allAuthors.find((p) => p.slug === 'default')

  // Ensure we have a valid author before proceeding
  if (!author) {
    throw new Error(`Author with slug '${siteMetadata.author}' or 'default' not found`)
  }

  const mainContent = coreContent(author as Authors)

  return (
    <>
      <AuthorLayout content={mainContent}>
        <MDXLayoutRenderer code={author.body.code} />
      </AuthorLayout>
    </>
  )
}
