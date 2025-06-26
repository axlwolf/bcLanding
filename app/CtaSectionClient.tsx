'use client'

import { useState } from 'react'
import Link from '@/components/Link' // Assuming this is the custom Link
import { useEmailSubscription } from '@/lib/useEmailSubscription'
import { CtaSection as CtaSectionType } from './allset/landing-content/types' // Adjust path as needed

interface CtaSectionClientProps {
  cta: CtaSectionType | undefined;
}

export function CtaSectionClient({ cta }: CtaSectionClientProps) {
  const [email, setEmail] = useState('')
  const { subscribe, status, message } = useEmailSubscription()

  if (!cta) return null;

  return (
    <div className="bg-primary-50 rounded-2xl px-4 py-16 sm:px-6 lg:px-8 dark:bg-gray-800/50">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="mb-4 text-3xl font-bold dark:text-white">{cta.title}</h2>
        <p className="mb-8 text-lg text-gray-600 dark:text-slate-800">{cta.description}</p>
        {cta.collectEmail ? (
          <form
            className="flex flex-col items-center justify-center gap-4"
            onSubmit={async (e) => {
              e.preventDefault()
              await subscribe(email)
              // Consider resetting email field based on status update from useEmailSubscription hook
              // For example, if status becomes 'success', then setEmail('')
            }}
          >
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:justify-center">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="focus:border-primary-500 focus:ring-primary-200 focus:ring-opacity-50 rounded-md border border-gray-300 px-4 py-2 text-base focus:ring dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                disabled={status === 'loading'}
              />
              <button
                type="submit"
                className="bg-primary-500 hover:bg-primary-600 rounded-md px-8 py-2 text-base font-medium text-white disabled:opacity-60"
                disabled={status === 'loading'}
              >
                {status === 'loading' ? 'Submitting...' : cta.button.text}
              </button>
            </div>
            <div className="mt-2 flex h-6 w-full items-center justify-center">
              {message && (
                <span className="text-primary-600 dark:text-primary-400 text-sm">{message}</span>
              )}
            </div>
          </form>
        ) : (
          <Link
            href={cta.button.link}
            className="bg-primary-500 hover:bg-primary-600 inline-flex items-center justify-center rounded-md border border-transparent px-8 py-4 text-base font-medium text-white"
          >
            {cta.button.text}
          </Link>
        )}
      </div>
    </div>
  )
}
