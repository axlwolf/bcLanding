'use client'

import React from 'react'
import { YouTubeLandingContent } from 'app/allset/landing-content/types'
import { FaYoutube, FaPatreon, FaTwitch, FaDiscord } from 'react-icons/fa'

// Map platform names to icons
const platformIcons: Record<string, React.ReactNode> = {
  Patreon: <FaPatreon className="h-5 w-5" />,
  Discord: <FaDiscord className="h-5 w-5" />,
  Twitch: <FaTwitch className="h-5 w-5" />,
}

interface ChannelCtaProps {
  cta: YouTubeLandingContent['cta']
}

const ChannelCta: React.FC<ChannelCtaProps> = ({ cta }) => {
  return (
    <section className="bg-gradient-to-br from-red-600 to-red-900 py-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-10 flex flex-col items-center">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white">
              <FaYoutube className="h-12 w-12 text-red-600" />
            </div>
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">Join Our Community</h2>
            <p className="max-w-2xl text-xl text-white/80">
              Subscribe to get notified about new videos and exclusive content
            </p>
          </div>

          <div className="mb-12 flex flex-col justify-center gap-6 md:flex-row">
            {/* Subscribe Button */}
            <a
              href={cta.subscribeLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-lg bg-white px-8 py-4 text-lg font-bold text-red-600 transition-colors hover:bg-gray-100"
            >
              <FaYoutube className="h-6 w-6" />
              {cta.subscribeText}
            </a>

            {/* Join Button */}
            <a
              href={cta.joinLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-lg border-2 border-white/30 bg-black/30 px-8 py-4 text-lg font-bold text-white backdrop-blur-sm transition-colors hover:bg-black/50"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              {cta.joinText}
            </a>
          </div>

          {/* Social Links */}
          {cta.socialLinks && cta.socialLinks.length > 0 && (
            <div className="flex flex-wrap justify-center gap-4">
              {cta.socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-full bg-white/10 px-6 py-3 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
                >
                  {platformIcons[link.platform] || link.platform}
                  <span>Join on {link.platform}</span>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default ChannelCta
