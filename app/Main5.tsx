// Main5.tsx - Refactored to be a Server Component

import React from 'react'
// Assuming sub-components are designed to take props and handle their own client logic if needed.
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

// Helper function to fetch landing content (should be identical to the one in Main.tsx, Main2.tsx etc.)
async function getLandingContentData(slug: string): Promise<ProductSaaSLandingContent | null> {
  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    // Ensure API route is correct if your project structure is different
    const res = await fetch(`${appUrl}/api/allset/landing-content?slug=${slug}`, {
      cache: 'no-store', // Or 'force-cache' with revalidation if content doesn't change often
    })
    if (!res.ok) {
      console.error(`Failed to fetch landing content (Main5) for slug ${slug}: ${res.status} ${res.statusText}`)
      const errorBody = await res.text();
      console.error(`Error body: ${errorBody}`);
      return null
    }
    const data = await res.json()
    // Basic validation, you might want more thorough checks
    if (typeof data !== 'object' || data === null) {
      console.error(`Fetched data is not an object for slug ${slug}. Received:`, data);
      return null;
    }
    if (data.pageType !== 'product' && data.pageType !== 'saas') {
        console.warn(`Fetched content for Main5 (slug ${slug}) is of pageType '${data.pageType}', expecting 'product' or 'saas'. Some sections might not render as expected.`)
    }
    return data as ProductSaaSLandingContent
  } catch (error) {
    console.error(`Error fetching landing content (Main5) for slug ${slug}:`, error)
    return null
  }
}

export default async function Main5() {
  // Fetch data for this specific page type or a default slug
  // For consistency with previous refactors, using 'main-landing'.
  // This could be parameterized if Main5 is meant for a different content slug.
  const landingContent = await getLandingContentData('main-landing')

  if (!landingContent) {
    return (
      <div className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-4 py-10 text-center sm:px-6 xl:max-w-5xl xl:px-0">
        <p className="text-lg text-red-500">Failed to load content for page. Please try again later.</p>
      </div>
    )
  }

  // Destructure with optional chaining and nullish coalescing for safety,
  // though child components should also handle potentially missing sections.
  const {
    hero,
    mainFeatures,
    features,
    cta,
    pricing,
    contact,
    faqs,
    testimonials,
    stats
  } = landingContent;

  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-b from-gray-50 to-white text-gray-900 dark:from-gray-900 dark:to-gray-800 dark:text-gray-100">
      {/*
        Pass props to each section.
        The HeroSection in Main5 takes mainFeatures.items as a prop too.
        Ensure the components in '@/components/Main5' are adapted for these props.
        And if they use hooks, they must be client components.
      */}
      {hero && mainFeatures?.items && <HeroSection hero={hero} mainFeatures={mainFeatures.items} />}
      {stats?.items && <StatsSection stats={stats.items} />}
      {mainFeatures && <MainFeaturesSection mainFeatures={mainFeatures} />}
      <AppShowcaseSection /> {/* Assuming AppShowcaseSection is static or fetches its own data if needed */}
      {features && <FeaturesSection features={features} />}
      {testimonials && <TestimonialsSection testimonials={testimonials} />}
      {pricing && <PricingSection pricing={pricing} />}
      {cta && <CtaSection cta={cta} />}
      {faqs && <FaqSection faqs={faqs} />}
      {contact && <ContactSection contact={contact} />}
    </div>
  )
}
