// Removed 'use client' to make it a Server Component

import React from 'react'
import { YouTubeLandingContent } from './allset/landing-content/types'
import {
  ChannelHero,
  FeaturedVideos,
  PlaylistsSection,
  AboutSection,
  ChannelCta,
  ContactSection,
} from '../components/Main6'

// Helper function to fetch landing content
async function getLandingContentData(slug: string): Promise<YouTubeLandingContent | null> {
  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const res = await fetch(`${appUrl}/api/allset/landing-content?slug=${slug}`, {
      cache: 'no-store', // Or configure revalidation as needed
    })
    if (!res.ok) {
      console.error(
        `Failed to fetch landing content for slug ${slug}: ${res.status} ${res.statusText}`
      )
      return null
    }
    const data = await res.json()
    // Add validation if necessary, e.g., check data.pageType
    if (data.pageType !== 'youtube') {
      // Assuming 'youtube' is the pageType for this content
      console.warn(
        `Fetched content for slug ${slug} for Main6 is not of type youtube. PageType: ${data.pageType}`
      )
      // Potentially return null or a default structure if type mismatch is critical
    }
    return data as YouTubeLandingContent // Cast to YouTubeLandingContent
  } catch (error) {
    console.error(`Error fetching landing content for slug ${slug} in Main6:`, error)
    return null
  }
}

const Main6 = async () => {
  // Using 'youtube-landing' as a potential slug, this might need adjustment
  const landingContent = await getLandingContentData('youtube-landing')

  if (!landingContent) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-900 to-black text-white">
        <p className="text-lg text-red-500">Failed to load page content. Please try again later.</p>
      </div>
    )
  }

  const { channelInfo, featuredVideos, playlists, cta, about, contact, seo } = landingContent

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Channel Banner and Info */}
      {channelInfo && <ChannelHero channelInfo={channelInfo} />}

      {/* Featured Videos Section */}
      {featuredVideos && <FeaturedVideos videos={featuredVideos} />}

      {/* Playlists Section */}
      {playlists && playlists.length > 0 && <PlaylistsSection playlists={playlists} />}

      {/* About Section */}
      {about && <AboutSection about={about} />}

      {/* Channel CTA Section */}
      {cta && <ChannelCta cta={cta} />}

      {/* Contact Section */}
      {contact && <ContactSection contact={contact} />}
    </div>
  )
}

export default Main6
