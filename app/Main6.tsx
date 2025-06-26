// Main6.tsx - Refactored to be a Server Component

import React from 'react'
// Assuming Main6 uses specific sub-components, possibly from '@/components/Main6'
// For this example, I'll assume a generic structure.
// If Main6 has unique sections, those would be imported and used here.
// e.g., import { HeroSection6, FeaturesSection6 } from '@/components/Main6';
import { ProductSaaSLandingContent } from './allset/landing-content/types'

// Helper function to fetch landing content
async function getLandingContentData(slug: string): Promise<ProductSaaSLandingContent | null> {
  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const res = await fetch(`${appUrl}/api/allset/landing-content?slug=${slug}`, {
      cache: 'no-store',
    });
    if (!res.ok) {
      console.error(`Failed to fetch landing content (Main6) for slug ${slug}: ${res.status} ${res.statusText}`)
      const errorBody = await res.text();
      console.error(`Error body: ${errorBody}`);
      return null
    }
    const data = await res.json()
    if (typeof data !== 'object' || data === null) {
      console.error(`Fetched data is not an object for slug ${slug} (Main6). Received:`, data);
      return null;
    }
    // It's good practice to check pageType if Main6 is specifically for 'product' or 'saas'
    if (data.pageType !== 'product' && data.pageType !== 'saas') {
        // This template might be designed for a specific type, so a warning or different handling might be needed.
        console.warn(`Fetched content for Main6 (slug ${slug}) is of pageType '${data.pageType}'. This template might primarily expect 'product' or 'saas'.`)
    }
    return data as ProductSaaSLandingContent
  } catch (error) {
    console.error(`Error fetching landing content (Main6) for slug ${slug}:`, error)
    return null
  }
}

// Placeholder for sections that would be specific to Main6
// These would typically be imported from '@/components/Main6/*'
// And they should be designed to accept parts of landingContent as props.
// If they use client hooks, they must be Client Components.

const HeroSectionGeneric = ({ hero }) => hero ? (
  <div className="p-8 bg-blue-100 dark:bg-blue-900 my-4 rounded-lg">
    <h2 className="text-2xl font-bold">{hero.title} (Hero for Main6)</h2>
    <p>{hero.description}</p>
    {hero.primaryCta && <a href={hero.primaryCta.link} className="text-blue-500 hover:underline">{hero.primaryCta.text}</a>}
  </div>
) : null;

const FeaturesSectionGeneric = ({ features }) => features ? (
  <div className="p-8 bg-green-100 dark:bg-green-900 my-4 rounded-lg">
    <h3 className="text-xl font-semibold">{features.title} (Features for Main6)</h3>
    {features.items && features.items.map((item, index) => (
      <div key={index} className="mt-2">
        <h4 className="font-medium">{item.title}</h4>
        <p className="text-sm">{item.description}</p>
      </div>
    ))}
  </div>
) : null;


export default async function Main6() {
  // Fetch data for this specific page type or a default slug
  // Using 'main-landing' for consistency, but could be a unique slug for Main6 content
  const landingContent = await getLandingContentData('main-landing')

  if (!landingContent) {
    return (
      <div className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-4 py-10 text-center sm:px-6 xl:max-w-5xl xl:px-0">
        <p className="text-lg text-red-500">Failed to load content for Main6 page. Please try again later.</p>
      </div>
    )
  }

  // Destructure sections that Main6 might use
  const {
    hero,
    features,
    cta,
    // Add other sections as potentially used by a Main6 template
  } = landingContent;

  return (
    <div className="min-h-screen bg-purple-50 text-gray-900 dark:bg-purple-900 dark:text-gray-100 p-4">
      <h1 className="text-3xl font-bold text-center py-4">Main6 Template</h1>
      {/* Render the sections specific to Main6, passing the fetched content */}
      {hero && <HeroSectionGeneric hero={hero} />}
      {features && <FeaturesSectionGeneric features={features} />}

      {/* Example of using another piece of data directly */}
      {cta && (
        <div className="p-8 bg-yellow-100 dark:bg-yellow-900 my-4 rounded-lg text-center">
          <h3 className="text-xl font-semibold">{cta.title} (CTA for Main6)</h3>
          <p>{cta.description}</p>
          {cta.button && <a href={cta.button.link} className="text-yellow-600 hover:underline font-bold">{cta.button.text}</a>}
        </div>
      )}
       <div className="p-8 text-center border-t mt-4">
        <p>Content for Main6 template using dynamic data from Supabase.</p>
      </div>
    </div>
  )
}
