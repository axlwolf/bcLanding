import React from 'react'
import { motion } from 'framer-motion'
import { fadeIn, staggerContainer } from './AnimationVariants'
import { useContactSubmission } from '@/lib/useContactSubmission'
import { ContactSection as ContactSectionType } from '../../app/allset/landing-content/types'

interface ContactSectionProps {
  contact: ContactSectionType
}

const ContactSection = ({ contact }: ContactSectionProps) => {
  const {
    form,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    validate,
    status,
    message,
    formRef,
    containerHeight,
  } = useContactSubmission(contact.fields)

  // Check if we should show contact info section
  const hasContactInfo =
    contact.contactInfo &&
    ((contact.contactInfo.phone && contact.contactInfo.phone.number) ||
      (contact.contactInfo.email && contact.contactInfo.email.address) ||
      (contact.contactInfo.location &&
        contact.contactInfo.location.address &&
        contact.contactInfo.location.address.length > 0))

  return (
    <section
      id="contact"
      className="relative flex flex-col items-center justify-center bg-white py-20 dark:bg-slate-900"
      style={containerHeight ? { minHeight: containerHeight } : {}}
    >
      <motion.h2
        variants={fadeIn('up', 'tween', 0.1, 0.6)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        className="mb-4 text-center text-3xl font-bold text-slate-900 dark:text-white"
      >
        {contact.title}
      </motion.h2>
      <motion.p
        variants={fadeIn('up', 'tween', 0.2, 0.6)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        className="mb-8 text-center text-lg text-slate-600 dark:text-slate-300"
      >
        {contact.description}
      </motion.p>

      <div className="flex w-full max-w-6xl flex-col gap-8 md:flex-row">
        {/* Contact Info - Left Side */}
        {hasContactInfo && (
          <motion.div
            variants={fadeIn('right', 'tween', 0.25, 0.6)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            className="flex w-full flex-col gap-6 md:w-1/3"
          >
            {contact.contactInfo?.title && (
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                {contact.contactInfo.title}
              </h3>
            )}

            {contact.contactInfo?.phone?.number && (
              <div className="flex items-start gap-4 rounded-xl bg-slate-50 p-5 dark:bg-slate-800/50">
                <div className="bg-primary-100 dark:bg-primary-900/30 rounded-full p-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-primary-600 dark:text-primary-400 h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-medium text-slate-900 dark:text-white">
                    {contact.contactInfo.phone.label}
                  </h4>
                  <p className="mt-1 text-slate-600 dark:text-slate-300">
                    {contact.contactInfo.phone.number}
                  </p>
                  {contact.contactInfo.phone.hours && (
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      {contact.contactInfo.phone.hours}
                    </p>
                  )}
                </div>
              </div>
            )}

            {contact.contactInfo?.email?.address && (
              <div className="flex items-start gap-4 rounded-xl bg-slate-50 p-5 dark:bg-slate-800/50">
                <div className="bg-primary-100 dark:bg-primary-900/30 rounded-full p-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-primary-600 dark:text-primary-400 h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-medium text-slate-900 dark:text-white">
                    {contact.contactInfo.email.label}
                  </h4>
                  <p className="mt-1 text-slate-600 dark:text-slate-300">
                    {contact.contactInfo.email.address}
                  </p>
                  {contact.contactInfo.email.responseTime && (
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      Response time: {contact.contactInfo.email.responseTime}
                    </p>
                  )}
                </div>
              </div>
            )}

            {contact.contactInfo?.location?.address &&
              contact.contactInfo.location.address.length > 0 && (
                <div className="flex items-start gap-4 rounded-xl bg-slate-50 p-5 dark:bg-slate-800/50">
                  <div className="bg-primary-100 dark:bg-primary-900/30 rounded-full p-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-primary-600 dark:text-primary-400 h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-slate-900 dark:text-white">
                      {contact.contactInfo.location.label}
                    </h4>
                    <div className="mt-1">
                      {contact.contactInfo.location.address.map((line, index) => (
                        <p key={index} className="text-slate-600 dark:text-slate-300">
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              )}
          </motion.div>
        )}

        {/* Contact Form - Right Side */}
        <motion.div
          variants={fadeIn('left', 'tween', 0.3, 0.6)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          className={`w-full ${hasContactInfo ? 'md:w-2/3' : 'mx-auto md:max-w-2xl'} rounded-xl bg-slate-100/90 p-8 shadow-xl dark:bg-slate-800/90`}
          style={{ position: 'relative', minHeight: containerHeight }}
        >
          <form
            ref={formRef}
            className={`w-full space-y-6 transition-opacity duration-300 ${status === 'success' ? 'pointer-events-none absolute opacity-0' : 'relative opacity-100'}`}
            onSubmit={handleSubmit}
          >
            {contact.fields.map((field) => (
              <div key={field.name} className="flex flex-col gap-2">
                <label
                  htmlFor={field.name}
                  className="font-medium text-slate-900 dark:text-slate-200"
                >
                  {field.label}
                  {field.required && <span className="text-primary-500 ml-1">*</span>}
                </label>
                {field.type === 'textarea' ? (
                  <textarea
                    id={field.name}
                    name={field.name}
                    value={form[field.name]}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required={field.required}
                    rows={5}
                    className="focus:border-primary-500 focus:ring-primary-300 focus:ring-opacity-50 rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 transition focus:ring dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  />
                ) : (
                  <input
                    id={field.name}
                    name={field.name}
                    type={field.type}
                    value={form[field.name]}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required={field.required}
                    className="focus:border-primary-500 focus:ring-primary-300 focus:ring-opacity-50 rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 transition focus:ring dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  />
                )}
                {touched[field.name] && !form[field.name]?.trim() && field.required && (
                  <span className="text-sm text-red-500">This field is required.</span>
                )}
              </div>
            ))}
            {status === 'error' && (
              <div className="text-center font-medium text-red-500">{message}</div>
            )}
            <button
              type="submit"
              className="bg-primary-500 hover:bg-primary-600 mt-2 w-full rounded-lg py-3 font-semibold text-white shadow-md transition disabled:opacity-60"
              disabled={status === 'loading' || !validate()}
            >
              {status === 'loading' ? 'Sending...' : contact.submitLabel}
            </button>
          </form>
          <div
            className={`absolute top-0 left-0 w-full text-center transition-opacity duration-300 ${status === 'success' ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
            style={{ minHeight: containerHeight }}
          >
            <p className="text-primary-500 mt-8 text-2xl font-semibold">
              {contact.successMessage || message}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default ContactSection
