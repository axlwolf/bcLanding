'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import siteMetadata from '@/data/siteMetadata'

function UnsubscribeContent() {
  const searchParams = useSearchParams()
  const [email, setEmail] = useState<string>('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState<string>('')

  useEffect(() => {
    const emailParam = searchParams?.get('email')
    if (emailParam) {
      setEmail(emailParam)
      // Verify the email exists in our database
      checkEmail(emailParam)
    }
  }, [searchParams])

  const checkEmail = async (email: string) => {
    try {
      const response = await fetch(`/api/unsubscribe?email=${encodeURIComponent(email)}`)
      const data = await response.json()

      if (!response.ok) {
        setStatus('error')
        setMessage(data.error || 'Failed to verify email')
      }
    } catch (error) {
      setStatus('error')
      setMessage('An error occurred while verifying your email')
    }
  }

  const handleUnsubscribe = async () => {
    if (!email) {
      setStatus('error')
      setMessage('Please enter your email address')
      return
    }

    setStatus('loading')
    setMessage('')

    try {
      const response = await fetch('/api/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus('success')
        setMessage(data.message || 'You have been successfully unsubscribed')
      } else {
        setStatus('error')
        setMessage(data.error || 'Failed to unsubscribe')
      }
    } catch (error) {
      setStatus('error')
      setMessage('An error occurred while processing your request')
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 xl:max-w-5xl xl:px-0">
      <div className="flex flex-col items-center justify-center py-12">
        <h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10 md:text-5xl md:leading-14 dark:text-gray-100">
          Unsubscribe
        </h1>
        <div className="mt-8 w-full max-w-md">
          <div className="rounded-md bg-white p-6 shadow-lg dark:bg-gray-800">
            {status === 'success' ? (
              <div className="text-center">
                <p className="mb-4 text-green-600 dark:text-green-400">{message}</p>
                <p className="mb-4 text-gray-600 dark:text-gray-300">
                  We're sorry to see you go. If you change your mind, you can always subscribe
                  again.
                </p>
                <Link
                  href="/"
                  className="bg-primary-500 hover:bg-primary-600 focus:ring-primary-500 inline-flex items-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm focus:ring-2 focus:ring-offset-2 focus:outline-none"
                >
                  Return to Home
                </Link>
              </div>
            ) : (
              <>
                <p className="mb-4 text-gray-600 dark:text-gray-300">
                  Please confirm that you want to unsubscribe from {siteMetadata.title} newsletters
                  and updates.
                </p>
                <div className="mb-4">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Email address
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="focus:border-primary-500 focus:ring-primary-500 mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:border-gray-600 dark:bg-gray-700"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                {status === 'error' && (
                  <p className="mb-4 text-sm text-red-600 dark:text-red-400">{message}</p>
                )}
                <button
                  type="button"
                  className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none"
                  onClick={handleUnsubscribe}
                  disabled={status === 'loading'}
                >
                  {status === 'loading' ? 'Processing...' : 'Unsubscribe'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function UnsubscribePage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-48 items-center justify-center">
          <div className="border-t-primary-500 h-8 w-8 animate-spin rounded-full border-4 border-slate-300"></div>
        </div>
      }
    >
      <UnsubscribeContent />
    </Suspense>
  )
}
