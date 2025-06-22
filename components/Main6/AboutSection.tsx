'use client'

import React from 'react'
import { YouTubeLandingContent } from 'app/allset/landing-content/types'

interface AboutSectionProps {
  about: NonNullable<YouTubeLandingContent['about']>
}

const AboutSection: React.FC<AboutSectionProps> = ({ about }) => {
  return (
    <section className="bg-black py-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-8 text-center text-3xl font-bold">{about.title}</h2>

          {/* Stats Grid */}
          <div className="mb-12 grid grid-cols-2 gap-6 md:grid-cols-4">
            {about.stats.map((stat, index) => (
              <div
                key={index}
                className="rounded-xl bg-gray-800 p-6 text-center transition-colors hover:bg-gray-700"
              >
                <div className="mb-2 text-2xl font-bold text-red-500 md:text-3xl">{stat.value}</div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* About Content */}
          <div className="rounded-xl bg-gray-800 p-8">
            <div className="prose prose-invert max-w-none">
              {about.content.split('\n\n').map((paragraph, index) => (
                <p key={index} className="mb-4 leading-relaxed text-gray-300">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutSection
