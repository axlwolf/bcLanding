'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { containerVariants, fadeInUpVariants } from './AnimationVariants'

interface StatItem {
  value: string
  label: string
}

interface StatsSectionProps {
  stats: StatItem[]
}

const StatsSection: React.FC<StatsSectionProps> = ({ stats }) => {
  return (
    <section className="border-y border-gray-200 bg-white py-12 dark:border-gray-700 dark:bg-gray-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={containerVariants}
          className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-12"
        >
          {stats.map((stat, index) => (
            <motion.div key={index} variants={fadeInUpVariants} className="text-center">
              <h3 className="text-primary-500 dark:text-primary-400 mb-2 text-3xl font-bold md:text-4xl">
                {stat.value}
              </h3>
              <p className="font-medium text-gray-600 dark:text-gray-400">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default StatsSection
