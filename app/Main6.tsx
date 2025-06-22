'use client'

import React from 'react'
import { YouTubeLandingContent } from './allset/landing-content/types'
import dataLandingContent from '@/data/landingContent.json'
import {
  ChannelHero,
  FeaturedVideos,
  PlaylistsSection,
  AboutSection,
  ChannelCta,
  ContactSection,
} from '../components/Main6'

const landingContent = dataLandingContent as unknown as YouTubeLandingContent

const Main6 = () => {
  const { channelInfo, featuredVideos, playlists, cta, about, contact, seo } = landingContent

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Channel Banner and Info */}
      <ChannelHero channelInfo={channelInfo} />

      {/* Featured Videos Section */}
      <FeaturedVideos videos={featuredVideos} />

      {/* Playlists Section */}
      {playlists && playlists.length > 0 && <PlaylistsSection playlists={playlists} />}

      {/* About Section */}
      {about && <AboutSection about={about} />}

      {/* Channel CTA Section */}
      <ChannelCta cta={cta} />

      {/* Contact Section */}
      {contact && <ContactSection contact={contact} />}
    </div>
  )
}

export default Main6
