'use client'

import React from 'react'
import Image from 'next/image'
import { YouTubeLandingContent } from 'app/allset/landing-content/types'
import { FaListUl } from 'react-icons/fa'

interface PlaylistsSectionProps {
  playlists: YouTubeLandingContent['playlists']
}

const PlaylistsSection: React.FC<PlaylistsSectionProps> = ({ playlists }) => {
  if (!playlists) return null

  return (
    <section className="bg-gray-900 py-16">
      <div className="container mx-auto px-4">
        <h2 className="mb-2 text-center text-3xl font-bold">Playlists</h2>
        <p className="mx-auto mb-12 max-w-2xl text-center text-gray-400">
          Explore our curated collections of videos by topic
        </p>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {playlists.map((playlist) => (
            <div
              key={playlist.id}
              className="group overflow-hidden rounded-xl bg-gray-800 transition-shadow hover:shadow-lg hover:shadow-red-500/10"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video">
                <Image
                  src={playlist.thumbnail}
                  alt={playlist.title}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 transition-opacity group-hover:bg-black/20">
                  <div className="absolute bottom-4 left-4 flex items-center rounded-full bg-red-600 px-3 py-1 text-sm font-medium text-white">
                    <FaListUl className="mr-2" />
                    {playlist.videoCount} videos
                  </div>
                </div>
              </div>

              {/* Playlist info */}
              <div className="p-6">
                <h3 className="mb-2 text-xl font-bold transition-colors group-hover:text-red-500">
                  {playlist.title}
                </h3>
                <p className="mb-4 line-clamp-2 text-gray-400">{playlist.description}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Updated {playlist.lastUpdated}</span>
                  <button className="rounded-full bg-gray-700 px-4 py-2 text-white transition-colors hover:bg-red-600">
                    View Playlist
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default PlaylistsSection
