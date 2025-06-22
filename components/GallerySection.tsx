'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import type {
  GalleryImage,
  GallerySection as GallerySectionType,
} from '../app/allset/landing-content/types'

interface GallerySectionProps {
  gallery: GallerySectionType
  variant?: 'light' | 'dark'
}

const GallerySection: React.FC<GallerySectionProps> = ({ gallery, variant = 'light' }) => {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)

  const openModal = (image: GalleryImage) => {
    setSelectedImage(image)
    document.body.style.overflow = 'hidden' // Prevent scrolling when modal is open
  }

  const closeModal = () => {
    setSelectedImage(null)
    document.body.style.overflow = 'auto' // Re-enable scrolling
  }

  // Close modal when Escape key is pressed
  React.useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeModal()
      }
    }

    if (selectedImage) {
      window.addEventListener('keydown', handleEscKey)
    }

    return () => {
      window.removeEventListener('keydown', handleEscKey)
    }
  }, [selectedImage])

  const isDark = variant === 'dark'

  return (
    <section
      id="gallery"
      aria-labelledby="gallery-title"
      className={`relative overflow-hidden py-20 sm:py-32 ${
        isDark ? 'bg-slate-900 text-white' : 'border-t border-slate-200 dark:border-slate-800'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2
            id="gallery-title"
            className={`font-display text-3xl tracking-tight sm:text-4xl ${
              isDark ? 'text-white' : 'text-slate-900 dark:text-slate-200'
            }`}
          >
            {gallery.title}
          </h2>
          <p
            className={`mt-4 text-lg ${
              isDark ? 'text-slate-400' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            {gallery.description}
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:mt-20 sm:grid-cols-2 lg:max-w-none lg:grid-cols-3">
          {gallery.images.map((image, index) => (
            <div
              key={index}
              className={`group relative cursor-pointer overflow-hidden rounded-xl shadow-md transition-all hover:shadow-lg ${
                isDark ? 'bg-slate-800' : 'bg-slate-100 dark:bg-slate-800'
              }`}
              onClick={() => openModal(image)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  openModal(image)
                }
              }}
              tabIndex={0}
              role="button"
              aria-label={`View ${image.alt} in large mode`}
            >
              <div className="aspect-[4/3] w-full overflow-hidden">
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={600}
                  height={450}
                  className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <p
                  className={`text-center font-medium ${
                    isDark ? 'text-white' : 'text-slate-900 dark:text-slate-200'
                  }`}
                >
                  {image.caption}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex h-full w-full items-center justify-center p-0 sm:p-4">
          {/* Backdrop - clickable area */}
          <button
            type="button"
            className="fixed inset-0 h-full w-full cursor-default bg-black/90"
            onClick={closeModal}
            aria-label="Close modal"
          />

          {/* Modal content */}
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            className={`relative flex h-full w-full flex-col ${
              isDark ? 'bg-slate-800' : 'bg-white dark:bg-slate-800'
            } sm:max-h-[90vh] sm:max-w-[90vw] sm:rounded-lg`}
          >
            <button
              className={`absolute top-2 right-2 z-10 flex h-10 w-10 items-center justify-center rounded-full text-2xl font-bold shadow-md transition-all hover:scale-110 ${
                isDark
                  ? 'bg-slate-700/90 text-white hover:bg-slate-600'
                  : 'bg-white/90 text-black hover:bg-gray-200 dark:bg-slate-700/90 dark:text-white dark:hover:bg-slate-600'
              }`}
              onClick={closeModal}
              aria-label="Close modal"
            >
              &times;
            </button>
            <div className="flex h-[calc(100%-60px)] w-full items-center justify-center overflow-auto p-0 sm:p-4">
              <div className="relative flex h-full w-full items-center justify-center">
                <Image
                  src={selectedImage.src}
                  alt={selectedImage.alt}
                  width={1200}
                  height={900}
                  className="h-auto w-full object-contain sm:max-h-full sm:w-auto"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    width: 'auto',
                    height: 'auto',
                  }}
                  priority
                />
              </div>
            </div>
            {selectedImage.caption && (
              <div
                className={`absolute right-0 bottom-0 left-0 border-t p-3 text-center backdrop-blur-sm sm:relative sm:bg-transparent sm:p-4 ${
                  isDark
                    ? 'border-slate-700 bg-slate-800/90 text-white'
                    : 'border-slate-200 bg-white/90 text-slate-900 dark:border-slate-700 dark:bg-slate-800/90 dark:text-slate-200'
                }`}
              >
                <p className="text-base font-medium sm:text-lg">{selectedImage.caption}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  )
}

export default GallerySection
