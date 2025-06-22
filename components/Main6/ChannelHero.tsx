'use client'

import React from 'react'
import Image from 'next/image'
import { FaTwitter, FaInstagram, FaYoutube, FaTiktok, FaFacebook } from 'react-icons/fa'
import { YouTubeLandingContent } from 'app/allset/landing-content/types'

// Map platform names to icons
const platformIcons: Record<string, React.ReactNode> = {
  Twitter: <FaTwitter className="h-5 w-5" />,
  Instagram: <FaInstagram className="h-5 w-5" />,
  YouTube: <FaYoutube className="h-5 w-5" />,
  TikTok: <FaTiktok className="h-5 w-5" />,
  Facebook: <FaFacebook className="h-5 w-5" />,
}

interface ChannelHeroProps {
  channelInfo: YouTubeLandingContent['channelInfo']
}

const ChannelHero: React.FC<ChannelHeroProps> = ({ channelInfo }) => {
  return (
    <section className="relative">
      {/* Banner Image */}
      <div className="relative h-64 w-full overflow-hidden sm:h-80 lg:h-96">
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-transparent to-black/70"></div>
        <Image
          src={channelInfo.bannerImage}
          alt={`${channelInfo.name} banner`}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Channel Info */}
      <div className="relative z-20 container mx-auto -mt-24 px-4 pb-12">
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-end">
          {/* Profile Image */}
          <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-white shadow-lg">
            <Image
              src={channelInfo.profileImage}
              alt={channelInfo.name}
              fill
              className="object-cover"
            />
          </div>

          {/* Channel Details */}
          <div className="flex-1">
            <h1 className="mb-2 text-3xl font-bold text-white">{channelInfo.name}</h1>
            <div className="mb-4 flex flex-wrap items-center gap-4 text-gray-300">
              <span className="font-semibold">{channelInfo.subscriberCount} subscribers</span>
              <span>•</span>
              <span>{channelInfo.totalViews} views</span>
              <span>•</span>
              <span>Joined {channelInfo.joinDate}</span>
            </div>
            <p className="mb-6 max-w-2xl text-gray-200">{channelInfo.description}</p>

            {/* Social Links */}
            <div className="flex flex-wrap gap-3">
              {channelInfo.links.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-full bg-gray-800 px-4 py-2 text-sm transition-colors hover:bg-gray-700"
                >
                  {platformIcons[link.platform] || link.platform}
                  <span>{link.platform}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ChannelHero
