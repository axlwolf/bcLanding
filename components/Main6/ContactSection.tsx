'use client'

import React, { useState } from 'react'
import { YouTubeLandingContent } from 'app/allset/landing-content/types'
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa'

interface ContactSectionProps {
  contact: YouTubeLandingContent['contact']
}

const ContactSection: React.FC<ContactSectionProps> = ({ contact }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  if (!contact) return null

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
      setFormData({ name: '', email: '', message: '' })
    }, 1500)
  }

  return (
    <section className="bg-gray-900 py-16" id="contact">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-2 text-center text-3xl font-bold">{contact.title}</h2>
          <p className="mx-auto mb-12 max-w-2xl text-center text-gray-400">{contact.description}</p>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Contact Form */}
            <div className="rounded-xl bg-gray-800 p-8 lg:col-span-2">
              {isSubmitted ? (
                <div className="flex h-full flex-col items-center justify-center py-12">
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <h3 className="mb-4 text-2xl font-bold">{contact.successMessage}</h3>
                  <p className="mb-6 text-center text-gray-400">
                    We'll get back to you as soon as possible.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="rounded-lg bg-gray-700 px-6 py-3 transition-colors hover:bg-gray-600"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                    {contact.fields.map((field, index) => (
                      <div key={index} className="flex flex-col">
                        <label htmlFor={field.name} className="mb-2 text-gray-300">
                          {field.label} {field.required && <span className="text-red-500">*</span>}
                        </label>
                        <input
                          type={field.type}
                          id={field.name}
                          name={field.name}
                          value={formData[field.name as keyof typeof formData] || ''}
                          onChange={handleChange}
                          required={field.required}
                          className="rounded-lg border border-gray-600 bg-gray-700 px-4 py-3 text-white focus:ring-2 focus:ring-red-500 focus:outline-none"
                          placeholder={field.label}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="mb-6">
                    <label htmlFor="message" className="mb-2 text-gray-300">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-3 text-white focus:ring-2 focus:ring-red-500 focus:outline-none"
                      placeholder="Your message"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`flex w-full items-center justify-center rounded-lg bg-red-600 px-6 py-3 font-bold text-white transition-colors hover:bg-red-700 ${isSubmitting ? 'cursor-not-allowed opacity-70' : ''}`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="mr-3 -ml-1 h-5 w-5 animate-spin text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      contact.submitLabel
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Contact Info */}
            <div className="rounded-xl bg-gray-800 p-8">
              <h3 className="mb-6 text-xl font-bold">{contact?.contactInfo?.title}</h3>

              {contact?.contactInfo?.email && (
                <div className="mb-6 flex items-start">
                  <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-red-600/20">
                    <FaEnvelope className="h-4 w-4 text-red-500" />
                  </div>
                  <div>
                    <h4 className="mb-1 font-medium text-gray-300">
                      {contact.contactInfo.email.label}
                    </h4>
                    <a
                      href={`mailto:${contact.contactInfo.email.address}`}
                      className="text-red-500 transition-colors hover:text-red-400"
                    >
                      {contact.contactInfo.email.address}
                    </a>
                    {contact.contactInfo.email.responseTime && (
                      <p className="mt-1 text-sm text-gray-500">
                        Response time: {contact.contactInfo.email.responseTime}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {contact?.contactInfo?.phone && (
                <div className="mb-6 flex items-start">
                  <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-red-600/20">
                    <FaPhone className="h-4 w-4 text-red-500" />
                  </div>
                  <div>
                    <h4 className="mb-1 font-medium text-gray-300">
                      {contact.contactInfo.phone.label}
                    </h4>
                    <a
                      href={`tel:${contact.contactInfo.phone.number}`}
                      className="text-red-500 transition-colors hover:text-red-400"
                    >
                      {contact.contactInfo.phone.number}
                    </a>
                    {contact.contactInfo.phone.hours && (
                      <p className="mt-1 text-sm text-gray-500">
                        Hours: {contact.contactInfo.phone.hours}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {contact?.contactInfo?.location && (
                <div className="flex items-start">
                  <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-red-600/20">
                    <FaMapMarkerAlt className="h-4 w-4 text-red-500" />
                  </div>
                  <div>
                    <h4 className="mb-1 font-medium text-gray-300">
                      {contact.contactInfo.location.label}
                    </h4>
                    {contact.contactInfo.location.address.map((line, index) => (
                      <p key={index} className="text-gray-400">
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ContactSection
