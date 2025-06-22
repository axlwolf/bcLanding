'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FaArrowRight } from 'react-icons/fa'
import Link from 'next/link'
import { containerVariants, itemVariants } from './AnimationVariants'
import { CtaSection as CtaSectionType } from 'app/allset/landing-content/types'
import { useEmailSubscription } from '@/lib/useEmailSubscription'

interface CtaSectionProps {
  cta: CtaSectionType
}

const CtaSection: React.FC<CtaSectionProps> = ({ cta }) => {
  const [email, setEmail] = useState('')
  const { subscribe, status, message } = useEmailSubscription()
  return (
    <section id="cta" className="relative overflow-hidden py-24">
      {/* Background gradient */}
      <div className="from-primary-600 absolute inset-0 bg-gradient-to-br to-purple-700"></div>

      {/* Decorative shapes */}
      <div className="absolute top-0 right-0 left-0 h-16 translate-y-[-50%] transform rounded-b-[100%] bg-white dark:bg-gray-900"></div>
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-white/5 blur-xl filter"></div>
        <div className="absolute right-1/3 bottom-1/3 h-80 w-80 rounded-full bg-purple-500/10 blur-xl filter"></div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={containerVariants}
          className="text-center text-white"
        >
          <motion.h2 variants={itemVariants} className="mb-6 text-3xl font-bold md:text-5xl">
            {cta.title}
          </motion.h2>
          <motion.p variants={itemVariants} className="mx-auto mb-10 max-w-3xl text-xl opacity-90">
            {cta.description}
          </motion.p>

          {cta.collectEmail ? (
            <motion.form
              variants={itemVariants}
              className="mx-auto flex max-w-lg flex-col items-center justify-center gap-4"
              onSubmit={async (e) => {
                e.preventDefault()
                await subscribe(email)
                if (status === 'success') setEmail('')
              }}
            >
              <div className="flex w-full flex-col items-center justify-center gap-4 sm:flex-row">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="focus:border-primary-500 focus:ring-primary-200 focus:ring-opacity-50 w-full rounded-xl border border-white/30 bg-white/10 px-4 py-3 text-base text-white placeholder-white/70 backdrop-blur-sm focus:ring sm:w-auto"
                  disabled={status === 'loading'}
                />
                <motion.button
                  type="submit"
                  className="text-primary-600 flex w-full items-center justify-center rounded-xl bg-white px-8 py-3 font-medium shadow-xl transition-all hover:bg-gray-100 sm:w-auto"
                  whileHover={{ scale: 1.05, boxShadow: '0 10px 40px rgba(255, 255, 255, 0.2)' }}
                  whileTap={{ scale: 0.95 }}
                  disabled={status === 'loading'}
                >
                  {status === 'loading' ? 'Submitting...' : cta.button.text}
                </motion.button>
              </div>
              <div className="mt-2 flex h-6 w-full items-center justify-center">
                {message && <span className="text-sm text-white">{message}</span>}
              </div>
            </motion.form>
          ) : (
            <motion.div
              variants={itemVariants}
              className="mx-auto flex max-w-lg flex-col justify-center gap-6 sm:flex-row"
            >
              <Link href={cta.button.link}>
                <motion.button
                  className="text-primary-600 flex flex-1 items-center justify-center space-x-2 rounded-xl bg-white px-8 py-4 font-medium shadow-xl transition-all hover:bg-gray-100"
                  whileHover={{ scale: 1.05, boxShadow: '0 10px 40px rgba(255, 255, 255, 0.2)' }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>{cta.button.text}</span>
                  <FaArrowRight className="ml-2" />
                </motion.button>
              </Link>
            </motion.div>
          )}

          {!cta.collectEmail && (
            <motion.p variants={itemVariants} className="mt-8 text-sm text-white/80">
              No credit card required. Cancel anytime.
            </motion.p>
          )}
        </motion.div>
      </div>

      {/* Bottom decorative shape */}
      <div className="absolute right-0 bottom-0 left-0 h-16 translate-y-[50%] transform rounded-t-[100%] bg-white dark:bg-gray-800"></div>
    </section>
  )
}

export default CtaSection
