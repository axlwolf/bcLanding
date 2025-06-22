'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaQuoteLeft, FaStar, FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { containerVariants, itemVariants, fadeInUpVariants } from './AnimationVariants'
import { TestimonialSection } from 'app/allset/landing-content/types'

interface TestimonialsSectionProps {
  testimonials: TestimonialSection
}

const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ testimonials }) => {
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const [isHovering, setIsHovering] = useState(false)

  // Auto-scrolling testimonials with pause on hover
  useEffect(() => {
    if (isHovering) return

    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isHovering, testimonials.testimonials.length])

  return (
    <section className="bg-white py-24 dark:bg-gray-800" id="testimonials">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={containerVariants}
          className="mb-16 text-center"
        >
          <motion.div
            variants={itemVariants}
            className="bg-primary-100 dark:bg-primary-900/30 mb-4 inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium text-slate-50"
          >
            <FaStar className="mr-2 h-3 w-3" />
            From our users
          </motion.div>

          <motion.h2 variants={itemVariants} className="mb-4 text-3xl font-bold md:text-4xl">
            {testimonials.title}
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="mx-auto max-w-3xl text-xl text-gray-600 dark:text-gray-400"
          >
            {testimonials.description}
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={fadeInUpVariants}
          className="relative"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <div className="from-primary-50 border-primary-100 dark:border-primary-900/30 relative overflow-hidden rounded-2xl border bg-gradient-to-br to-white p-8 shadow-xl md:p-12 dark:from-gray-900 dark:to-gray-800">
            <div className="bg-primary-100 dark:bg-primary-900/30 absolute right-0 bottom-0 z-0 h-40 w-40 rounded-tl-3xl"></div>

            <div className="relative z-10">
              <div className="mb-8 flex items-center justify-between">
                <FaQuoteLeft className="text-primary-300 dark:text-primary-700 text-4xl" />

                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar key={star} className="h-5 w-5 text-yellow-400" />
                  ))}
                </div>
              </div>

              <div className="relative overflow-hidden" style={{ height: '240px' }}>
                <AnimatePresence initial={false} mode="wait">
                  <motion.div
                    key={activeTestimonial}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0"
                  >
                    <div className="mx-auto max-w-3xl">
                      <p className="mb-8 text-xl leading-relaxed text-gray-700 italic md:text-2xl dark:text-gray-300">
                        "{testimonials.testimonials[activeTestimonial].quote}"
                      </p>
                      <div className="flex flex-col items-center">
                        <div className="border-primary-200 dark:border-primary-800 mb-4 h-16 w-16 overflow-hidden rounded-full border-2 bg-gray-200 dark:bg-gray-700">
                          {/* Placeholder for avatar */}
                          <div className="text-primary-500 flex h-full w-full items-center justify-center">
                            {testimonials.testimonials[activeTestimonial].name.charAt(0)}
                          </div>
                        </div>
                        <h4 className="text-lg font-bold">
                          {testimonials.testimonials[activeTestimonial].name}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400">
                          {testimonials.testimonials[activeTestimonial].title}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="mt-8 flex items-center justify-center space-x-6">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() =>
                    setActiveTestimonial(
                      (prev) =>
                        (prev - 1 + testimonials.testimonials.length) %
                        testimonials.testimonials.length
                    )
                  }
                  className="hover:text-primary-500 dark:hover:text-primary-400 flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-700 shadow-md transition-colors dark:bg-gray-700 dark:text-gray-300"
                >
                  <FaChevronLeft className="h-4 w-4" />
                </motion.button>

                <div className="flex space-x-2">
                  {testimonials.testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveTestimonial(index)}
                      className={`h-3 w-3 rounded-full transition-all duration-300 ${
                        index === activeTestimonial
                          ? 'bg-primary-500 scale-125'
                          : 'hover:bg-primary-300 dark:hover:bg-primary-700 bg-gray-300 dark:bg-gray-600'
                      }`}
                      aria-label={`View testimonial ${index + 1}`}
                    />
                  ))}
                </div>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() =>
                    setActiveTestimonial((prev) => (prev + 1) % testimonials.testimonials.length)
                  }
                  className="hover:text-primary-500 dark:hover:text-primary-400 flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-700 shadow-md transition-colors dark:bg-gray-700 dark:text-gray-300"
                >
                  <FaChevronRight className="h-4 w-4" />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default TestimonialsSection
