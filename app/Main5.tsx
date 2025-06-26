// Removed 'use client' to make it a Server Component

import React from 'react'
import {
  HeroSection,
  StatsSection,
  MainFeaturesSection,
  AppShowcaseSection,
  FeaturesSection,
  TestimonialsSection,
  PricingSection,
  CtaSection,
  FaqSection,
  ContactSection,
} from '@/components/Main5'
import { ProductSaaSLandingContent } from './allset/landing-content/types'

// Helper function to fetch landing content
async function getLandingContentData(slug: string): Promise<ProductSaaSLandingContent | null> {
  try {
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
    // Assuming ProductSaaSLandingContent is the expected type for this page
    // Add validation if necessary, e.g., check data.pageType
    if (
      data.pageType !== 'product' &&
      data.pageType !== 'saas' &&
      data.pageType !== 'main-landing'
    ) {
      // Added 'main-landing' as a possible type if it's generic
      console.warn(
        `Fetched content for slug ${slug} for Main5 is not of expected type. PageType: ${data.pageType}`
      )
      // Potentially return null or a default structure if type mismatch is critical
    }
    return data as ProductSaaSLandingContent
  } catch (error) {
    console.error(`Error fetching landing content for slug ${slug} in Main5:`, error)
    return null
  }
}

const Main5 = async () => {
  // Using 'main-landing' as a default slug, adjust if Main5 corresponds to a different specific slug
  const landingContent = await getLandingContentData('main-landing')

  if (!landingContent) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-50 to-white text-gray-900 dark:from-gray-900 dark:to-gray-800 dark:text-gray-100">
        <p className="text-lg text-red-500">Failed to load page content. Please try again later.</p>
      </div>
    )
  }

  const { hero, mainFeatures, features, cta, pricing, contact, faqs, testimonials, stats } =
    landingContent

  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-b from-gray-50 to-white text-gray-900 dark:from-gray-900 dark:to-gray-800 dark:text-gray-100">
      {hero && mainFeatures && <HeroSection hero={hero} mainFeatures={mainFeatures.items} />}
      {stats && <StatsSection stats={stats.items} />}
      {mainFeatures && <MainFeaturesSection mainFeatures={mainFeatures} />}
      <AppShowcaseSection /> {/* This component doesn't seem to take props from landingContent */}
      {features && <FeaturesSection features={features} />}
      {testimonials && <TestimonialsSection testimonials={testimonials} />}
      {pricing && <PricingSection pricing={pricing} />}
      {cta && <CtaSection cta={cta} />}
      {faqs && <FaqSection faqs={faqs} />}
      {contact && <ContactSection contact={contact} />}
    </div>
  )
}

export default Main5
