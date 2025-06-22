'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { HiOutlineSparkles } from 'react-icons/hi'
import Link from 'next/link'
import Image from 'next/image'
import { containerVariants, itemVariants } from './AnimationVariants'
import { MainFeature, HeroSection as HeroSectionType } from 'app/allset/landing-content/types'
import { FiEye } from 'react-icons/fi'
import FeatureIcon from '@/components/FeatureIcon'

interface HeroSectionProps {
  hero: HeroSectionType
  mainFeatures: MainFeature[]
}

const HeroSection: React.FC<HeroSectionProps> = ({ hero, mainFeatures }) => {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-32">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="bg-primary-500 animate-blob absolute -top-40 -right-40 h-96 w-96 rounded-full opacity-10 blur-3xl filter"></div>
        <div className="animate-blob animation-delay-2000 absolute top-40 -left-20 h-96 w-96 rounded-full bg-purple-500 opacity-10 blur-3xl filter"></div>
        <div className="animate-blob animation-delay-4000 absolute right-20 bottom-40 h-96 w-96 rounded-full bg-blue-500 opacity-10 blur-3xl filter"></div>

        {/* Decorative grid pattern */}
        <div className="bg-grid-pattern absolute inset-0 opacity-5"></div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="mx-auto max-w-3xl"
        >
          <motion.div
            variants={itemVariants}
            className="from-primary-50 dark:from-primary-900/30 text-primary-600 dark:text-primary-400 mb-6 inline-flex items-center justify-center rounded-full bg-gradient-to-r to-purple-50 px-4 py-2 text-sm font-medium shadow-sm dark:to-purple-900/30"
          >
            <HiOutlineSparkles className="mr-2 h-4 w-4" />
            {hero.title.split(' ')[0]}
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="via-primary-800 dark:via-primary-300 mb-6 bg-gradient-to-r from-gray-900 to-purple-900 bg-clip-text text-4xl leading-tight font-extrabold text-transparent sm:text-5xl md:text-6xl dark:from-white dark:to-purple-300"
          >
            {hero.title}
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mx-auto mb-10 max-w-2xl text-xl text-gray-600 dark:text-gray-400"
          >
            {hero.description}
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col justify-center gap-4 sm:flex-row"
          >
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                href={hero.primaryCta.link}
                className="from-primary-500 hover:from-primary-600 shadow-primary-500/20 inline-block rounded-lg bg-gradient-to-r to-purple-600 px-8 py-3 text-center font-medium text-white shadow-md hover:to-purple-700"
              >
                {hero.primaryCta.text}
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                href={hero.secondaryCta.link}
                className="text-primary-600 dark:text-primary-400 border-primary-200 dark:border-primary-800 hover:bg-primary-50 dark:hover:bg-primary-900/20 inline-block rounded-lg border px-8 py-3 text-center font-medium transition-colors"
              >
                {hero.secondaryCta.text}
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Enhanced Hero Image */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="relative mx-auto mt-16 max-w-5xl"
        >
          <div className="from-primary-500/30 rounded-2xl bg-gradient-to-r to-purple-500/30 p-1 shadow-2xl">
            <div className="relative overflow-hidden rounded-xl bg-white dark:bg-gray-800">
              <div className="flex h-10 items-center space-x-2 bg-gray-100 px-4 dark:bg-gray-700">
                <div className="h-3 w-3 rounded-full bg-red-500"></div>
                <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
                <div className="ml-4 text-xs text-gray-500 dark:text-gray-400">{hero.title}</div>
              </div>
              <div className="relative p-6">
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-3 border-r border-gray-200 pr-4 dark:border-gray-700">
                    <div className="bg-primary-100 dark:bg-primary-900/30 mb-4 h-8 w-24 rounded-lg"></div>
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="mb-3 h-6 w-full rounded-lg bg-gray-100 dark:bg-gray-700"
                      ></div>
                    ))}
                  </div>
                  <div className="col-span-9">
                    <div className="bg-primary-50 dark:bg-primary-900/20 mb-6 h-10 w-40 rounded-lg"></div>
                    <div className="mb-6 grid grid-cols-2 gap-4">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-24 rounded-lg bg-gray-50 dark:bg-gray-700"></div>
                      ))}
                    </div>
                    <div className="mb-4 h-32 rounded-lg bg-gray-100 dark:bg-gray-700"></div>
                    <div className="bg-primary-100 dark:bg-primary-900/30 h-8 w-32 rounded-lg"></div>
                  </div>
                </div>

                {/* Animated cursor */}
                <motion.div
                  className="bg-primary-500 absolute h-3 w-3 rounded-full"
                  animate={{
                    x: [200, 300, 250, 400],
                    y: [50, 120, 180, 100],
                    scale: [1, 1.2, 0.8, 1],
                  }}
                  transition={{
                    duration: 4,
                    ease: 'easeInOut',
                    repeat: Infinity,
                    repeatType: 'reverse',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Decorative elements */}
          <motion.div
            className="bg-primary-100 dark:bg-primary-900/20 absolute -right-10 -bottom-10 h-24 w-24 rounded-lg"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          />
          <div className="absolute -top-5 -left-5 h-16 w-16 -rotate-12 transform rounded-lg bg-purple-100 dark:bg-purple-900/20"></div>

          {/* Floating badges for main features */}
          {mainFeatures.map((feature, index) => {
            // Calculate position for each badge
            const positions = [
              { className: 'absolute -right-5 top-1/4', x: 20, delay: 1.0 },
              { className: 'absolute -left-5 bottom-1/4', x: -20, delay: 1.3 },
              { className: 'absolute right-1/4 -bottom-5', y: 20, delay: 1.6 },
              { className: 'absolute left-1/4 -top-5', y: -20, delay: 1.9 },
              { className: 'absolute -right-5 bottom-1/3', x: 20, delay: 2.2 },
              { className: 'absolute -left-5 top-1/3', x: -20, delay: 2.5 },
            ]

            // Use modulo to cycle through positions if there are more features than positions
            const position = positions[index % positions.length]

            return (
              <motion.div
                key={index}
                className={`${position.className} z-10 flex items-center space-x-1 rounded-full bg-white px-3 py-1 shadow-lg dark:bg-gray-800`}
                initial={{
                  x: position.x || 0,
                  y: position.y || 0,
                  opacity: 0,
                }}
                animate={{
                  x: 0,
                  y: 0,
                  opacity: 1,
                }}
                transition={{
                  delay: position.delay,
                  duration: 0.5,
                }}
              >
                <div className="text-primary-500 h-4 w-4">
                  <FeatureIcon icon={feature.icon} size="4" />
                </div>
                <span className="text-xs font-medium">{feature.title}</span>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

export default HeroSection
