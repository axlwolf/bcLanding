'use client'

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
import dataLandingContent from '@/data/landingContent.json'
import { ProductSaaSLandingContent } from './allset/landing-content/types'

const landingContent = dataLandingContent as ProductSaaSLandingContent

const Main5 = () => {
  const { hero, mainFeatures, features, cta, pricing, contact, faqs, testimonials, stats } =
    landingContent
  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-b from-gray-50 to-white text-gray-900 dark:from-gray-900 dark:to-gray-800 dark:text-gray-100">
      <HeroSection hero={hero} mainFeatures={mainFeatures.items} />
      {stats && <StatsSection stats={stats.items} />}
      <MainFeaturesSection mainFeatures={mainFeatures} />
      <AppShowcaseSection />
      <FeaturesSection features={features} />
      {testimonials && <TestimonialsSection testimonials={testimonials} />}
      {pricing && <PricingSection pricing={pricing} />}
      <CtaSection cta={cta} />
      <FaqSection faqs={faqs} />
      {contact && <ContactSection contact={contact} />}
    </div>
  )
}

export default Main5
