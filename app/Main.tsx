// Remove 'use client' if Home becomes a Server Component primarily
// 'use client' // Keep if significant client-side logic remains in Home, or move interactive parts to sub-components

import Link from '@/components/Link'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import { formatDate } from 'pliny/utils/formatDate'
import Image from 'next/image'
import landingDemoImage from '../public/static/images/landing-demo.jpeg'
// import dataLandingContent from '@/data/landingContent.json' // Removed
import { sortPosts, allCoreContent } from 'pliny/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'
import { HiCheckCircle } from 'react-icons/hi2'
import { iconMap, getIconComponent } from '@/lib/utils/iconMap'
import { useEmailSubscription } from '@/lib/useEmailSubscription'
import { useState, useRef, useEffect } from 'react' // Keep for client components
import {
  ProductSaaSLandingContent,
  CtaSection as CtaSectionType,
  ContactSection as ContactSectionType,
} from './allset/landing-content/types' // Ensure types are correctly imported

// const landingContent = dataLandingContent as ProductSaaSLandingContent // Removed

import { ContactFormData, useContactSubmission } from '@/lib/useContactSubmission'

// Helper function to fetch landing content
// This should be defined in a way that it can be called from a Server Component.
// For simplicity here, it's a local async function. In a real app, this might be in a 'lib' or 'services' folder.
async function getLandingContentData(slug: string): Promise<ProductSaaSLandingContent | null> {
  try {
    // Assuming your app is served from the root, API routes are absolute paths.
    // If running locally, ensure NEXT_PUBLIC_APP_URL is set or adjust path.
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const res = await fetch(`${appUrl}/api/allset/landing-content?slug=${slug}`, {
      cache: 'no-store', // Or configure revalidation as needed
    })
    if (!res.ok) {
      console.error(
        `Failed to fetch landing content for slug ${slug}: ${res.status} ${res.statusText}`
      )
      return null
    }
    const data = await res.json()
    // Add validation here if necessary to ensure data matches ProductSaaSLandingContent
    if (data.pageType !== 'product' && data.pageType !== 'saas') {
      console.warn(
        `Fetched content for slug ${slug} is not of type product/saas. PageType: ${data.pageType}`
      )
      // Decide how to handle this - return null, or a default, or throw error
      // For now, returning as is, but type casting below might be an issue.
    }
    return data as ProductSaaSLandingContent
  } catch (error) {
    console.error(`Error fetching landing content for slug ${slug}:`, error)
    return null
  }
}

// ContactSection remains a Client Component due to hooks
const ContactSectionClient = ({ contact }: { contact: ContactSectionType }) => {
  'use client' // Explicitly mark as client component
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
          ref={formRef}
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

const MAX_DISPLAY = 3

// FeatureIcon can be a server or client component, it's simple enough
const FeatureIcon = ({ icon }) => {
  const IconComponent = getIconComponent(icon)
  if (!IconComponent) {
    console.warn(`Icon ${icon} not found in iconMap`)
    return null
  }
  return <IconComponent className="text-primary-500 h-6 w-6" />
}

// HeroSection is presentational, can be a server component
const HeroSection = ({ hero }) => (
  <div className="flex flex-col-reverse items-center justify-between py-16 md:py-24 lg:flex-row">
    <div className="space-y-6 lg:w-1/2">
      <h1 className="text-4xl font-extrabold tracking-tight md:text-6xl">
        {hero.title?.split(' ')[0] && (
          <span className="text-primary-500">{hero.title.split(' ')[0]}</span>
        )}{' '}
        <span className="text-slate-900 dark:text-white">
          {hero.title?.split(' ').slice(1).join(' ')}
        </span>
      </h1>
      <p className="text-lg text-gray-600 md:text-xl dark:text-gray-400">{hero.description}</p>
      <div className="flex flex-col gap-4 sm:flex-row">
        <Link
          href={hero.primaryCta.link}
          className="bg-primary-500 hover:bg-primary-600 inline-flex items-center justify-center rounded-md border border-transparent px-6 py-3 text-base font-medium text-white md:px-8 md:py-4 md:text-lg"
        >
          {hero.primaryCta.text}
        </Link>
        <Link
          href={hero.secondaryCta.link}
          className="text-primary-600 bg-primary-100 hover:bg-primary-200 dark:text-primary-300 inline-flex items-center justify-center rounded-md border border-transparent px-6 py-3 text-base font-medium md:px-8 md:py-4 md:text-lg dark:bg-gray-800 dark:hover:bg-gray-700"
        >
          {hero.secondaryCta.text}
        </Link>
      </div>
    </div>
    <div className="mb-10 lg:mb-0 lg:w-1/2">
      <div className="relative">
        <div className="w-full overflow-hidden rounded-lg shadow-xl">
          <Image
            src={hero.image || landingDemoImage} // Fallback to demo image
            alt={hero.title || 'AI Landing Page Generator Demo'}
            width={1024}
            height={576}
            className="h-auto w-full"
          />
        </div>
        <div className="bg-primary-500/10 absolute -right-4 -bottom-4 h-24 w-24 rounded-full blur-2xl" />
        <div className="bg-primary-500/10 absolute -top-4 -left-4 h-24 w-24 rounded-full blur-2xl" />
      </div>
    </div>
  </div>
)

// MainFeaturesSection is presentational
const MainFeaturesSection = ({ mainFeatures }) => (
  <div className="py-16">
    <h2 className="mb-12 text-center text-3xl font-bold">
      {mainFeatures.title || 'Main Features'}
    </h2>
    <div className="grid gap-8 md:grid-cols-3">
      {mainFeatures.items.map((feature) => (
        <div
          key={feature.id}
          className="rounded-lg border border-gray-200 p-6 transition-shadow hover:shadow-lg dark:border-gray-700"
        >
          <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
          <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
        </div>
      ))}
    </div>
  </div>
)

// FeaturesGridSection is presentational
const FeaturesGridSection = ({ features }) => (
  <div className="py-16">
    <h2 className="mb-12 text-center text-3xl font-bold">
      {features.title || 'Everything You Need to Launch Fast'}
    </h2>
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {features.items.map((feature) => (
        <div
          key={feature.title}
          className="rounded-lg border border-gray-200 p-6 transition-shadow hover:shadow-lg dark:border-gray-700"
        >
          <FeatureIcon icon={feature.icon} />
          <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
          <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
        </div>
      ))}
    </div>
  </div>
)

// PricingSection is presentational
const PricingSection = ({ pricing }) => (
  <div className="py-16">
    <div className="text-center">
      <h2 className="text-3xl font-bold">{pricing.title}</h2>
      <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">{pricing.description}</p>
    </div>
    <div className="mt-12 grid gap-8 lg:grid-cols-3">
      {pricing.plans.map((plan) => (
        <div
          key={plan.name}
          className={`rounded-lg border ${plan.highlighted ? 'border-primary-500 shadow-lg' : 'border-gray-200 dark:border-gray-700'} p-8`}
        >
          <h3 className="text-2xl font-bold">{plan.name}</h3>
          <p className="mt-4 text-gray-600 dark:text-gray-400">{plan.description}</p>
          <div className="mt-4 text-4xl font-bold">{plan.price}</div>
          <ul className="mt-8 space-y-4">
            {plan.features.map((feature) => (
              <li key={feature.text} className="flex items-center">
                <HiCheckCircle className="text-primary-500 h-5 w-5" />
                <span className="ml-3">{feature.text}</span>
              </li>
            ))}
          </ul>
          <Link
            href={plan.cta.link}
            className={`mt-8 block w-full rounded-lg px-6 py-3 text-center font-medium ${plan.highlighted ? 'bg-primary-500 hover:bg-primary-600 text-white' : 'bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700'}`}
          >
            {plan.cta.text}
          </Link>
        </div>
      ))}
    </div>
  </div>
)

// CtaSection needs to be a Client Component because of useEmailSubscription hook
const CtaSectionClient = ({ cta }: { cta: CtaSectionType }) => {
  'use client' // Explicitly mark as client component
  const [email, setEmail] = useState('')
  const { subscribe, status, message } = useEmailSubscription()

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
              // Removed: if (status === 'success') setEmail('') // This can cause issues if status updates slower
            }}
          >
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:justify-center">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="focus:border-primary-500 focus:ring-primary-200 focus:ring-opacity-50 rounded-md border border-gray-300 px-4 py-2 text-base focus:ring"
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

// BlogPostsSection is presentational
const BlogPostsSection = ({ posts }) => (
  <div className="py-16">
    <h2 className="mb-12 text-center text-3xl font-bold">Latest Updates</h2>
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {!posts.length && 'No posts found.'}
      {posts.slice(0, MAX_DISPLAY).map((post) => {
        const { slug, date, title, summary, tags } = post
        return (
          <article
            key={slug}
            className="flex flex-col overflow-hidden rounded-lg border border-gray-200 transition-shadow hover:shadow-lg dark:border-gray-700"
          >
            <div className="flex-1 p-6">
              <div className="mb-3 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Tag key={tag} text={tag} />
                ))}
              </div>
              <h2 className="mb-2 text-xl font-bold">
                <Link
                  href={`/blog/${slug}`}
                  className="hover:text-primary-500 dark:hover:text-primary-400 text-slate-800 dark:text-gray-100"
                >
                  {title}
                </Link>
              </h2>
              <p className="mb-4 text-gray-600 dark:text-gray-400">{summary}</p>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                <time dateTime={date}>{formatDate(date, siteMetadata.locale)}</time>
              </div>
            </div>
          </article>
        )
      })}
    </div>
    {posts.length > MAX_DISPLAY && (
      <div className="mt-8 flex justify-center">
        <Link
          href="/blog"
          className="hover:border-primary-500 dark:hover:border-primary-500 inline-flex items-center rounded-md border border-gray-200 px-6 py-3 dark:border-gray-700"
        >
          All Posts &rarr;
        </Link>
      </div>
    )}
  </div>
)

// Home component becomes an async Server Component
export default async function Home() {
  const sortedPosts = sortPosts(allBlogs) // This is fine for server component
  const posts = allCoreContent(sortedPosts) // This is fine

  // Fetch landing content data. Defaulting to 'main-landing' slug.
  // This slug might need to be dynamic based on the route or other factors in a multi-page setup.
  const landingContent = await getLandingContentData('main-landing')

  if (!landingContent) {
    // Handle case where content couldn't be fetched
    // You might want to render a fallback UI or throw an error
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 text-center sm:px-6 xl:max-w-5xl xl:px-0">
        <p className="text-lg text-red-500">
          Failed to load landing page content. Please try again later.
        </p>
      </div>
    )
  }

  // Destructure content safely, providing fallbacks if a section might be optional
  const { hero, mainFeatures, features, cta, pricing, contact } = landingContent

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 xl:max-w-10/12 xl:px-0">
      {hero && <HeroSection hero={hero} />}
      {mainFeatures && <MainFeaturesSection mainFeatures={mainFeatures} />}
      {features && <FeaturesGridSection features={features} />}
      {pricing && <PricingSection pricing={pricing} />}
      {cta && <CtaSectionClient cta={cta} />} {/* Use the client component wrapper */}
      <BlogPostsSection posts={posts} />{' '}
      {/* Blog posts are from Contentlayer, not dynamic content */}
      {contact && <ContactSectionClient contact={contact} />}{' '}
      {/* Use the client component wrapper */}
    </div>
  )
}
