'use client'

import { useRef } from 'react' // Keep useRef if useContactSubmission uses it internally for formRef
import { ContactSection as ContactSectionType } from './allset/landing-content/types' // Adjust path as needed
import { useContactSubmission } from '@/lib/useContactSubmission'

interface ContactSectionClientProps {
  contact: ContactSectionType | undefined;
}

export function ContactSectionClient({ contact }: ContactSectionClientProps) {
  if (!contact) return null;

  const {
    form,
    // touched, // Not used in the original JSX, can be omitted if not needed
    handleChange,
    handleBlur,
    handleSubmit,
    validate,
    status,
    message,
    formRef, // formRef from the hook
    containerHeight,
  } = useContactSubmission(contact.fields)

  return (
    <div
      className="relative flex flex-col items-center justify-center py-16"
      style={containerHeight ? { minHeight: containerHeight } : {}}
    >
      <h2 className="mb-4 text-center text-3xl font-bold">{contact.title}</h2>
      <p className="mb-8 text-center text-lg text-gray-600 dark:text-gray-400">
        {contact.description}
      </p>
      <div
        style={{ position: 'relative', width: '100%', maxWidth: 560, minHeight: containerHeight }}
      >
        <form
          ref={formRef} // Use the ref from the hook
          className={`mx-auto w-full space-y-6 transition-opacity duration-300 ${status === 'success' ? 'pointer-events-none absolute opacity-0' : 'relative opacity-100'}`}
          onSubmit={handleSubmit}
        >
          {contact.fields.map((field) => (
            <div key={field.name}>
              <label className="mb-2 block font-medium" htmlFor={field.name}>
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
                  className="focus:border-primary-500 focus:ring-primary-200 focus:ring-opacity-50 w-full rounded-md border border-gray-300 px-4 py-2 focus:ring dark:border-gray-700 dark:bg-gray-900"
                  rows={5}
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
                  className="focus:border-primary-500 focus:ring-primary-200 focus:ring-opacity-50 w-full rounded-md border border-gray-300 px-4 py-2 focus:ring dark:border-gray-700 dark:bg-gray-900"
                />
              )}
            </div>
          ))}
          {status === 'error' && <div className="text-center text-red-500">{message}</div>}
          <button
            type="submit"
            className="bg-primary-500 hover:bg-primary-600 w-full rounded-md px-8 py-3 text-base font-medium text-white disabled:opacity-60"
            disabled={status === 'loading' || !validate()}
          >
            {status === 'loading' ? 'Sending...' : contact.submitLabel}
          </button>
        </form>
        <div
          className={`absolute top-0 left-0 w-full text-center transition-opacity duration-300 ${status === 'success' ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
          style={{ minHeight: containerHeight }}
        >
          <p className="text-primary-600 dark:text-primary-400 mt-2 text-lg">
            {message || contact.successMessage}
          </p>
        </div>
      </div>
    </div>
  )
}
