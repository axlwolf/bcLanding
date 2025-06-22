'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { containerVariants, itemVariants } from './AnimationVariants'

const AppShowcaseSection: React.FC = () => {
  return (
    <section className="overflow-hidden bg-gradient-to-b from-gray-50 via-white to-gray-50 py-24 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={containerVariants}
          className="mb-16 text-center"
        >
          <motion.h2 variants={itemVariants} className="mb-4 text-3xl font-bold md:text-4xl">
            Beautiful, Intuitive Interface
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="mx-auto max-w-3xl text-xl text-gray-600 dark:text-gray-400"
          >
            Designed with focus and productivity in mind, Reflect helps you work the way you think.
          </motion.p>
        </motion.div>

        <div className="relative">
          {/* Background gradient circle */}
          <div className="from-primary-500/20 absolute top-1/2 left-1/2 h-full max-h-72 w-full max-w-3xl -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-gradient-to-r to-purple-500/20 blur-3xl filter"></div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative z-10 flex justify-center"
          >
            {/* Device mockup */}
            <div className="relative max-w-4xl">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                viewport={{ once: true }}
                className="relative z-20 overflow-hidden rounded-2xl border-8 border-white shadow-2xl dark:border-gray-800"
              >
                <div className="flex h-8 w-full items-center bg-gray-100 px-4 dark:bg-gray-700">
                  <div className="flex space-x-2">
                    <div className="h-3 w-3 rounded-full bg-red-500"></div>
                    <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="ml-4 h-4 w-24 rounded-full bg-gray-200 dark:bg-gray-600"></div>
                </div>
                <div className="aspect-video w-full max-w-4xl overflow-hidden bg-white dark:bg-gray-800">
                  {/* App UI mockup */}
                  <div className="flex h-full">
                    {/* Sidebar */}
                    <div className="h-full w-48 border-r border-gray-200 px-3 py-4 dark:border-gray-700">
                      <div className="bg-primary-100 dark:bg-primary-900/30 mb-6 h-8 w-32 rounded-lg"></div>
                      <div className="space-y-3">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className="flex items-center">
                            <div className="mr-3 h-4 w-4 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                            <div className="h-4 w-24 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Main content */}
                    <div className="flex-1 p-6">
                      <div className="mb-6">
                        <div className="bg-primary-100 dark:bg-primary-900/30 mb-4 h-8 w-48 rounded-lg"></div>
                        <div className="mb-2 h-4 w-full max-w-md rounded-full bg-gray-200 dark:bg-gray-700"></div>
                        <div className="h-4 w-full max-w-sm rounded-full bg-gray-200 dark:bg-gray-700"></div>
                      </div>

                      <div className="mb-6 grid grid-cols-2 gap-4">
                        <div className="rounded-xl bg-gray-100 p-4 dark:bg-gray-700/50">
                          <div className="mb-3 h-4 w-24 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                          <div className="h-24 rounded-lg bg-gray-200 dark:bg-gray-600"></div>
                        </div>
                        <div className="rounded-xl bg-gray-100 p-4 dark:bg-gray-700/50">
                          <div className="mb-3 h-4 w-32 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                          <div className="h-24 rounded-lg bg-gray-200 dark:bg-gray-600"></div>
                        </div>
                      </div>

                      <div className="bg-primary-50 dark:bg-primary-900/20 rounded-xl p-4">
                        <div className="mb-3 flex items-center">
                          <div className="bg-primary-200 dark:bg-primary-700 mr-3 h-5 w-5 rounded-full"></div>
                          <div className="bg-primary-200 dark:bg-primary-700 h-4 w-40 rounded-full"></div>
                        </div>
                        <div className="bg-primary-100 dark:bg-primary-800 mb-2 h-4 w-full rounded-full"></div>
                        <div className="bg-primary-100 dark:bg-primary-800 h-4 w-3/4 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Decorative elements */}
              <motion.div
                className="absolute -right-12 -bottom-6 z-10 h-20 w-20 rounded-lg bg-gradient-to-br from-purple-400 to-purple-600"
                animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.05, 0.95, 1] }}
                transition={{ duration: 6, repeat: Infinity }}
              />
              <motion.div
                className="from-primary-400 to-primary-600 absolute -top-4 -left-8 z-10 h-16 w-16 rounded-full bg-gradient-to-br"
                animate={{ y: [0, -10, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default AppShowcaseSection
