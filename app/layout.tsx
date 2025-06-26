import 'css/tailwind.css'
import 'pliny/search/algolia.css'
import 'remark-github-blockquote-alert/alert.css'
import 'css/theme-override.css'

import { Space_Grotesk } from 'next/font/google'
import { Analytics, AnalyticsConfig } from 'pliny/analytics'
import { Analytics as VercelAnalytics } from '@vercel/analytics/next'
import { SearchProvider, SearchConfig } from 'pliny/search'
import Header from '@/components/Header'
import { createClient } from '@supabase/supabase-js'
import { LandingContent } from './allset/landing-content/types' // Import LandingContent type
import Footer from '@/components/Footer'
import siteMetadata from '@/data/siteMetadata'
import { DarkThemeProvider } from './theme-providers'
import { ThemeProvider } from './contexts/ThemeContext'
import AdminLayoutWrapper from './admin-layout-wrapper'
import { getThemeSettings } from './lib/get-theme'
import { Metadata } from 'next'

const space_grotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-grotesk',
})

// Supabase client for server-side fetching in RootLayout
const supabaseServerClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function getLandingContentForHeader(slug: string): Promise<LandingContent | null> {
  try {
    const { data: pageData, error: pageError } = await supabaseServerClient
      .from('landing_pages')
      .select('id, page_type')
      .eq('slug', slug)
      .single()

    if (pageError) {
      console.error(`Header: Error fetching landing page for slug ${slug}:`, pageError.message)
      return null
    }

    const { data: sectionsData, error: sectionsError } = await supabaseServerClient
      .from('page_content')
      .select('section_slug, content')
      .eq('page_id', pageData.id)
      .order('display_order', { ascending: true })

    if (sectionsError) {
      console.error(`Header: Error fetching page content for page_id ${pageData.id}:`, sectionsError.message)
      return null
    }

    const reconstructedContent: { [key: string]: any } = {
      pageType: pageData.page_type,
    }
    sectionsData.forEach((section) => {
      reconstructedContent[section.section_slug] = section.content
    })
    return reconstructedContent as LandingContent
  } catch (error) {
    console.error(`Header: Unexpected error fetching landing content for slug ${slug}:`, error)
    return null
  }
}

export const metadata: Metadata = {
  metadataBase: new URL(siteMetadata.siteUrl),
  title: {
    default: siteMetadata.title,
    template: `%s | ${siteMetadata.title}`,
  },
  description: siteMetadata.description,
  openGraph: {
    title: siteMetadata.title,
    description: siteMetadata.description,
    url: './',
    siteName: siteMetadata.title,
    images: [siteMetadata.socialBanner],
    locale: 'en_US',
    type: 'website',
  },
  alternates: {
    canonical: './',
    types: {
      'application/rss+xml': `${siteMetadata.siteUrl}/feed.xml`,
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  twitter: {
    title: siteMetadata.title,
    card: 'summary_large_image',
    images: [siteMetadata.socialBanner],
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Fetch dynamic settings from Supabase for site metadata
  const { data: dynamicSettings } = await supabaseServerClient
    .from('site_settings')
    .select('site_name, logo_url')
    .eq('id', 1) // Assuming 'id' 1 is the global settings row
    .single()

  const finalSiteMetadata = {
    ...siteMetadata,
    title: dynamicSettings?.site_name || siteMetadata.title,
    headerTitle: dynamicSettings?.site_name || siteMetadata.headerTitle,
    logoUrl: dynamicSettings?.logo_url || siteMetadata.siteLogo, // Use logo_url from DB
    stickyNav: siteMetadata.stickyNav,
  }

  // Fetch landing content for the header, using a default slug
  const headerLandingContent = await getLandingContentForHeader('main-landing')

  const basePath = process.env.BASE_PATH || ''
  const themeSettings = await getThemeSettings()
  const initialColor = themeSettings.primaryColor

  return (
    <html
      lang={siteMetadata.language}
      className={`${space_grotesk.variable} scroll-smooth`}
      suppressHydrationWarning
      data-theme-color={initialColor}
    >
      <link rel="apple76" sizes="76x76" href={`${basePath}/static/favicons/apple76.png`} />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href={`${basePath}/static/favicons/favicon32.png`}
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href={`${basePath}/static/favicons/favicon16.png`}
      />
      <link rel="manifest" href={`${basePath}/static/favicons/site.webmanifest`} />
      <link rel="mask-icon" href={`${basePath}/static/favicons/safari.svg`} color="#0F172A" />
      <meta name="msapplication-TileColor" content="#000000" />
      <meta name="theme-color" media="(prefers-color-scheme: light)" content="#fff" />
      <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#000" />
      <link rel="alternate" type="application/rss+xml" href={`${basePath}/feed.xml`} />
      <body className="bg-slate-100 text-slate-800 antialiased dark:bg-slate-900 dark:text-slate-200">
        <DarkThemeProvider>
          <ThemeProvider initialColor={initialColor}>
            <AdminLayoutWrapper
              regularContent={
                <>
                  <VercelAnalytics />
                  <Analytics analyticsConfig={siteMetadata.analytics as AnalyticsConfig} />
                  <SearchProvider searchConfig={siteMetadata.search as SearchConfig}>
                    {/* Pass fetched landingContent to Header */}
                    <Header siteMetadata={finalSiteMetadata} landingContent={headerLandingContent} />
                    <main className="mb-auto">{children}</main>
                  </SearchProvider>
                  <Footer />
                </>
              }
            >
              {children}
            </AdminLayoutWrapper>
          </ThemeProvider>
        </DarkThemeProvider>
      </body>
    </html>
  )
}
