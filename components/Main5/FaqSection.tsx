'use client'

import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FiCheckCircle } from 'react-icons/fi'
import { containerVariants, itemVariants, fadeInUpVariants } from './AnimationVariants'
import { FaqsSection } from 'app/allset/landing-content/types'
import { FaPlus } from 'react-icons/fa'

interface FaqSectionProps {
  faqs: FaqsSection
}

interface FAQProps {
  question: string
  answer: string
}

const FAQ: React.FC<FAQProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border-b border-gray-200 py-5 dark:border-gray-700">
      <button
        className="group flex w-full items-center justify-between text-left focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="group-hover:text-primary-500 text-lg font-medium text-gray-900 transition-colors dark:text-white">
          {question}
        </h3>
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="ml-2 flex-shrink-0"
        >
          <FaPlus
            className={`h-4 w-4 ${isOpen ? 'text-primary-500' : 'text-gray-500'} group-hover:text-primary-500 transition-colors`}
          />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="mt-4 text-base text-gray-600 dark:text-gray-400">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const FaqSection: React.FC<FaqSectionProps> = ({ faqs }) => {
  return (
    <section className="bg-white py-24 dark:bg-gray-800" id="faq">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
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
            <FiCheckCircle className="mr-2 h-4 w-4" />
            {faqs.title}
          </motion.div>

          <motion.h2 variants={itemVariants} className="mb-4 text-3xl font-bold md:text-4xl">
            {faqs.title}
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="mx-auto max-w-3xl text-xl text-gray-600 dark:text-gray-400"
          >
            {faqs.description}
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={containerVariants}
          className="space-y-4 rounded-2xl border border-gray-100 bg-gray-50 p-6 shadow-lg md:p-8 dark:border-gray-700 dark:bg-gray-900"
        >
          {faqs.questions.map((faq, index) => (
            <motion.div key={index} variants={fadeInUpVariants} custom={index}>
              <FAQ question={faq.question} answer={faq.answer} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default FaqSection
