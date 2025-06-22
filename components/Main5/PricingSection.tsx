'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { FaCheck } from 'react-icons/fa'
import { HiOutlineGlobeAlt } from 'react-icons/hi'
import Link from 'next/link'
import { containerVariants, itemVariants, fadeInUpVariants } from './AnimationVariants'
import { PricingSection as PricingSectionType } from 'app/allset/landing-content/types'

interface PricingSectionProps {
  pricing: PricingSectionType
}

const PricingSection: React.FC<PricingSectionProps> = ({ pricing }) => {
  return (
    <section className="bg-gray-50 py-24 dark:bg-gray-900" id="pricing">
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
            <HiOutlineGlobeAlt className="mr-2 h-4 w-4" />
            {pricing.title.split(' ')[0]}
          </motion.div>

          <motion.h2 variants={itemVariants} className="mb-4 text-3xl font-bold md:text-4xl">
            {pricing.title}
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="mx-auto max-w-3xl text-xl text-gray-600 dark:text-gray-400"
          >
            {pricing.description}
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={containerVariants}
          className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3"
        >
          {pricing.plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              variants={fadeInUpVariants}
              custom={index}
              className={`rounded-xl bg-white dark:bg-gray-800 ${plan.highlighted ? 'border-primary-200 dark:border-primary-800 transform border-2 shadow-xl md:scale-105' : 'border border-gray-200 shadow-lg dark:border-gray-700'} relative overflow-hidden`}
            >
              {plan.highlighted && (
                <div className="bg-primary-500 absolute top-0 right-0 px-3 py-1 text-xs font-bold tracking-wider text-white uppercase">
                  Popular
                </div>
              )}

              <div className={`p-8 ${plan.highlighted ? 'pt-10' : ''}`}>
                <h3 className="mb-2 text-xl font-bold">{plan.name}</h3>
                <p className="mb-6 text-gray-600 dark:text-gray-400">{plan.description}</p>
                <div className="mb-8 flex items-baseline">
                  <span className="text-4xl font-bold">{plan.price}</span>
                </div>

                <ul className="mb-8 space-y-4">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <FaCheck className="mt-1 mr-3 flex-shrink-0 text-green-500" />
                      <span className="text-gray-600 dark:text-gray-400">{feature.text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="px-8 pb-8">
                <Link href={plan.cta.link}>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className={`w-full rounded-lg py-3 ${plan.highlighted ? 'from-primary-500 hover:from-primary-600 shadow-primary-500/20 bg-gradient-to-r to-purple-600 text-white shadow-md hover:to-purple-700' : 'text-primary-600 dark:text-primary-400 border-primary-200 dark:border-primary-800 hover:bg-primary-50 dark:hover:bg-primary-900/20 border'} font-medium transition-colors`}
                  >
                    {plan.cta.text}
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default PricingSection
