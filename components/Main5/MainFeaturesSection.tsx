'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { FiArrowRight } from 'react-icons/fi'
import { containerVariants, itemVariants, fadeInUpVariants } from './AnimationVariants'
import FeatureIcon from '@/components/FeatureIcon'
import { MainFeaturesSection as MainFeaturesSectionType } from 'app/allset/landing-content/types'

const MainFeaturesSection = ({ mainFeatures }: { mainFeatures: MainFeaturesSectionType }) => {
  return (
    <section className="bg-white py-24 dark:bg-gray-800" id="main-features">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={containerVariants}
          className="mb-16 text-center"
        >
          <motion.h2 variants={itemVariants} className="mb-4 text-3xl font-bold md:text-4xl">
            {mainFeatures.title}
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="mx-auto max-w-3xl text-xl text-gray-600 dark:text-gray-400"
          >
            {mainFeatures.description}
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={containerVariants}
          className="grid gap-8 md:grid-cols-3"
        >
          {mainFeatures.items.map((feature) => (
            <motion.div
              key={feature.id}
              variants={fadeInUpVariants}
              className="group hover:border-primary-100 dark:hover:border-primary-900/30 rounded-xl border border-gray-100 bg-gradient-to-br from-gray-50 to-white p-8 shadow-lg transition-all duration-300 hover:shadow-xl dark:border-gray-700 dark:from-gray-900 dark:to-gray-800"
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
            >
              <div className="from-primary-100 to-primary-50 dark:from-primary-900/40 dark:to-primary-900/20 mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br transition-transform duration-300 group-hover:scale-110">
                <FeatureIcon icon={feature.icon} />
              </div>
              <h3 className="group-hover:text-primary-500 mb-3 text-xl font-bold transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>

              <div className="mt-6 flex items-center border-t border-gray-100 pt-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:border-gray-700">
                <span className="text-primary-500 dark:text-primary-400 font-medium">
                  Learn more
                </span>
                <FiArrowRight className="text-primary-500 dark:text-primary-400 ml-2" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default MainFeaturesSection
