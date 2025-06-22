'use client'

import React from 'react'
import Image from 'next/image'
import { YouTubeLandingContent } from 'app/allset/landing-content/types'
import { FaPlay, FaEye, FaClock } from 'react-icons/fa'

interface FeaturedVideosProps {
  videos: YouTubeLandingContent['featuredVideos']
}

const FeaturedVideos: React.FC<FeaturedVideosProps> = ({ videos }) => {
  return (
    <section className="bg-black py-16">
      <div className="container mx-auto px-4">
        <h2 className="mb-2 text-center text-3xl font-bold">Featured Videos</h2>
        <p className="mx-auto mb-12 max-w-2xl text-center text-gray-400">
          Check out some of our most popular and trending content
        </p>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {videos.map((video) => (
            <div key={video.id} className="group">
              <a href={video.url} target="_blank" rel="noopener noreferrer" className="block">
                {/* Thumbnail with overlay */}
                <div className="relative mb-4 aspect-video overflow-hidden rounded-xl">
                  <Image
                    src={video.thumbnail}
                    alt={video.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition-colors group-hover:bg-black/10">
                    <div className="flex h-14 w-14 transform items-center justify-center rounded-full bg-red-600 transition-transform group-hover:scale-110">
                      <FaPlay className="ml-1 h-6 w-6 text-white" />
                    </div>
                  </div>

                  {/* Duration badge */}
                  <div className="absolute right-3 bottom-3 flex items-center rounded bg-black/80 px-2 py-1 text-sm font-medium text-white">
                    <FaClock className="mr-1 h-3 w-3" />
                    {video.duration}
                  </div>
                </div>
              </a>

              {/* Video info */}
              <h3 className="mb-2 line-clamp-2 text-lg font-bold transition-colors group-hover:text-red-500">
                {video.title}
              </h3>
              <p className="mb-3 line-clamp-2 text-sm text-gray-400">{video.description}</p>
              <div className="flex items-center text-sm text-gray-500">
                <FaEye className="mr-1" />
                <span>{video.viewCount} views</span>
                <span className="mx-2">•</span>
                <span>{video.publishedAt}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturedVideos
