import { Inter } from 'next/font/google'
import SectionContainer from './SectionContainer'
import Footer from './Footer'
import { ReactNode } from 'react'
import Header from './Header'
import { createClient } from '@supabase/supabase-js'
import siteMetadata from '@/data/siteMetadata'
import { LandingContent } from 'app/allset/landing-content/types' // Import the main type

interface Props {
  children: ReactNode
}

const inter = Inter({
  subsets: ['latin'],
})

// Helper function to fetch landing content for the header
// (Similar to the one in Main.tsx, etc., but might fetch a specific 'header' slug or default)
async function getHeaderLandingContent(slug: string): Promise<LandingContent | null> {
  try {
    // Changed to relative path for server-side fetching within the same app
    const res = await fetch(`/api/allset/landing-content?slug=${slug}`, {
      cache: 'no-store', // Or 'force-cache' with revalidate if appropriate for header
    })
    if (!res.ok) {
      console.error(
        `Header: Failed to fetch landing content for slug ${slug}: ${res.status} ${res.statusText}`
      )
      return null
    }
    const data = await res.json()
    return data as LandingContent // Cast to the main LandingContent union type
  } catch (error) {
    console.error(`Header: Error fetching landing content for slug ${slug}:`, error)
    return null
  }
}

// This needs to be an async component to fetch data
const LayoutWrapper = async ({ children }: Props) => {
  // Initialize Supabase client for server-side fetching
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  let dynamicSettings: { site_name: any; logo_url: any } | null = null
  let headerLandingContent: LandingContent | null = null

  if (supabaseUrl && supabaseAnonKey) {
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    // Fetch dynamic settings from Supabase
    const { data: settings } = await supabase
      .from('site_settings')
      .select('site_name, logo_url')
      .eq('id', 1)
      .single()
    dynamicSettings = settings

    // Fetch landing content for the header (e.g., for nav links)
    // Using 'main-landing' as the default slug for header content. Adjust if a different slug is used.
    headerLandingContent = await getHeaderLandingContent('main-landing')
  } else {
    console.warn(
      'Supabase URL or Anon Key is not defined. Skipping dynamic settings and header content fetch.'
    )
  }

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
        <Header siteMetadata={finalSiteMetadata} landingContent={headerLandingContent} />
        <main className="mb-auto">{children}</main>
        <Footer />
      </div>
    </SectionContainer>
  )
}

export default LayoutWrapper
