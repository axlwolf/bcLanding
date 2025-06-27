// Hybrid approach: Server gets template from Supabase, Client can override with localStorage
import { getSiteConfigFromSupabase } from '../lib/config' // Ensure this path is correct
import ClientTemplateWrapper from './ClientTemplateWrapper'
import Main from './Main'
import Main2 from './Main2'
import Main3 from './Main3'
import Main4 from './Main4'
import Main5 from './Main5'
import Main6 from './Main6'
import { sortPosts, allCoreContent } from 'pliny/utils/contentlayer' // For preparing posts
import { allBlogs } from 'contentlayer/generated' // For preparing posts

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function HomePage() {
  const config = await getSiteConfigFromSupabase()
  const serverTemplate = config?.activeTemplate || 'Main'

  console.log('[SERVER] Rendering HomePage with serverTemplate from Supabase:', serverTemplate)

  // Prepare posts data here in the Server Component
  const sortedPosts = sortPosts(allBlogs)
  const posts = allCoreContent(sortedPosts)

  // Pass posts to each Main* component.
  // Each Main* component will need to be updated to accept a 'posts' prop if it uses BlogPostsSection.
  const components = {
    Main: <Main posts={posts} />, // Pass posts
    Main2: <Main2 posts={posts} />, // Pass posts (if Main2 uses BlogPostsSection)
    Main3: <Main3 posts={posts} />, // etc.
    Main4: <Main4 posts={posts} />,
    Main5: <Main5 posts={posts} />,
    Main6: <Main6 posts={posts} />, // Main6 is YouTube, might not use 'posts' in the same way
  }

  const defaultComponent = <Main posts={posts} />;

  return (
    <ClientTemplateWrapper
      serverTemplate={serverTemplate}
      components={components}
      defaultComponent={defaultComponent}
    />
  )
}
