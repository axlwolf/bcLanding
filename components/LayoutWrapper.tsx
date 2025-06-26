import { Inter } from 'next/font/google'
import SectionContainer from './SectionContainer'
import Footer from './Footer'
import { ReactNode } from 'react'
import Header from './Header'
import { createClient } from '@supabase/supabase-js'
import siteMetadata from '@/data/siteMetadata'

interface Props {
  children: ReactNode
}

const inter = Inter({
  subsets: ['latin'],
})

// This needs to be an async component to fetch data
const LayoutWrapper = async ({ children }: Props) => {
  // Initialize Supabase client for server-side fetching
  // Note: It's safe to initialize here because this is a Server Component.
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // Fetch dynamic settings from Supabase
  const { data: dynamicSettings } = await supabase
    .from('site_settings')
    .select('site_name, logo_url')
    .eq('id', 1)
    .single()

  // Merge static metadata with dynamic settings
  const finalSiteMetadata = {
    ...siteMetadata,
    title: dynamicSettings?.site_name || siteMetadata.title,
    headerTitle: dynamicSettings?.site_name || siteMetadata.headerTitle,
    logoUrl: dynamicSettings?.logo_url || siteMetadata.siteLogo,
    stickyNav: siteMetadata.stickyNav, // Explicitly include for type safety
  }

  return (
    <SectionContainer>
      <div className={`${inter.className} flex h-screen flex-col justify-between font-sans`}>
        <Header siteMetadata={finalSiteMetadata} />
        <main className="mb-auto">{children}</main>
        <Footer />
      </div>
    </SectionContainer>
  )
}

export default LayoutWrapper
