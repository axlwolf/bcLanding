'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { FaCheck } from 'react-icons/fa'
import { containerVariants, itemVariants, fadeInUpVariants } from './AnimationVariants'
import { FeaturesSection as FeaturesSectionType } from 'app/allset/landing-content/types'
import FeatureIcon from '@/components/FeatureIcon'

interface FeaturesSectionProps {
  features: FeaturesSectionType
}

const FeaturesSection: React.FC<FeaturesSectionProps> = ({ features }) => {
  return (
    <section className="bg-gray-50 py-24 dark:bg-gray-900" id="features">
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
            <FaCheck className="mr-2 h-3 w-3" />
            Packed with features
          </motion.div>

          <motion.h2 variants={itemVariants} className="mb-4 text-3xl font-bold md:text-4xl">
            {features.title.split(' ').slice(0, -2).join(' ')}{' '}
            <span className="text-primary-400">
              {features.title.split(' ').slice(-2).join(' ')}
            </span>
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="mx-auto max-w-3xl text-xl text-gray-600 dark:text-gray-400"
          >
            {features.description}
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={containerVariants}
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {features.items.map((feature, index) => (
            <motion.div
              key={index}
              variants={fadeInUpVariants}
              custom={index}
              className="group hover:border-primary-500 dark:hover:border-primary-500 flex items-start space-x-4 rounded-xl border border-gray-100 bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl dark:border-gray-700 dark:bg-gray-800"
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="from-primary-50 dark:from-primary-900/20 group-hover:bg-primary-500 dark:group-hover:bg-primary-500 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br to-white transition-colors duration-300 dark:to-gray-800">
                <FeatureIcon icon={feature.icon} />
              </div>
              <div>
                <h3 className="hover:text-primary-500 mb-2 text-lg font-bold transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default FeaturesSection
