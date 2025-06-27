// Main.tsx - Reverted to Server Component, receives posts as prop

import React from 'react';
import Link from '@/components/Link';
import Tag from '@/components/Tag';
import siteMetadata from '@/data/siteMetadata';
import { formatDate } from 'pliny/utils/formatDate';
import Image from 'next/image';
import landingDemoImage from '../public/static/images/landing-demo.jpeg';
// Removed: import { sortPosts, allCoreContent } from 'pliny/utils/contentlayer';
// Removed: import { allBlogs } from 'contentlayer/generated';
import { HiCheckCircle } from 'react-icons/hi2';
import { getIconComponent } from '@/lib/utils/iconMap';
import {
  ProductSaaSLandingContent,
  HeroSection as HeroSectionType,
  MainFeaturesSection as MainFeaturesSectionType,
  FeaturesSection as FeaturesSectionType,
  PricingSection as PricingSectionType,
  CtaSection as CtaSectionType,
  ContactSection as ContactSectionType,
  Feature as FeatureType,
  // Assuming 'posts' prop will be an array of 'CoreContent<Blog>'
  // You might need to import CoreContent and Blog types if not already available globally
} from './allset/landing-content/types'; // Adjust if CoreContent/Blog types are elsewhere

// Import the Client Components
import { CtaSectionClient } from './CtaSectionClient';
import { ContactSectionClient } from './ContactSectionClient';

// Helper function to fetch landing content (specific to this page's dynamic data)
async function getLandingContentData(slug: string): Promise<ProductSaaSLandingContent | null> {
  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const res = await fetch(`${appUrl}/api/allset/landing-content?slug=${slug}`, {
      cache: 'no-store',
    });
    if (!res.ok) {
      console.error(`Failed to fetch landing content (Main) for slug ${slug}: ${res.status} ${res.statusText}`);
      const errorBody = await res.text();
      console.error(`Error body: ${errorBody}`);
      return null;
    }
    const data = await res.json();
    if (typeof data !== 'object' || data === null) {
      console.error(`Fetched data is not an object for slug ${slug} (Main). Received:`, data);
      return null;
    }
    if (data.pageType !== 'product' && data.pageType !== 'saas') {
        console.warn(`Fetched content for Main (slug ${slug}) is of pageType '${data.pageType}'. This template might expect 'product' or 'saas'.`);
    }
    return data as ProductSaaSLandingContent;
  } catch (error) {
    console.error(`Error fetching landing content (Main) for slug ${slug}:`, error);
    return null;
  }
}

// --- Presentational Sub-Components (Server Components or usable in Server Components) ---
// These should NOT have 'use client' unless they use client hooks.

const FeatureIcon = ({ icon }: { icon: string | undefined }) => {
  // This component does not use client hooks.
  if (!icon) return null;
  const IconComponent = getIconComponent(icon);
  if (!IconComponent) {
    return null;
  }
  return <IconComponent className="text-primary-500 h-6 w-6" />;
};

const HeroSection = ({ hero }: { hero: HeroSectionType | undefined }) => {
  // This component does not use client hooks.
  if (!hero) return null;
  const defaultHeroImage = '/static/images/landing-demo.jpeg';
  return (
    <div className="flex flex-col-reverse items-center justify-between py-16 md:py-24 lg:flex-row">
      <div className="space-y-6 lg:w-1/2">
        <h1 className="text-4xl font-extrabold tracking-tight md:text-6xl">
          {hero.title?.split(' ')[0] && <span className="text-primary-500">{hero.title.split(' ')[0]}</span>}{' '}
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
              src={hero.image || defaultHeroImage}
              alt={hero.title || "AI Landing Page Generator Demo"}
              width={1024}
              height={576}
              className="h-auto w-full"
              priority
            />
          </div>
          <div className="bg-primary-500/10 absolute -right-4 -bottom-4 h-24 w-24 rounded-full blur-2xl" />
          <div className="bg-primary-500/10 absolute -top-4 -left-4 h-24 w-24 rounded-full blur-2xl" />
        </div>
      </div>
    </div>
  );
};

const MainFeaturesSection = ({ mainFeatures }: { mainFeatures: MainFeaturesSectionType | undefined }) => {
  // This component does not use client hooks.
  if (!mainFeatures?.items || mainFeatures.items.length === 0) return null;
  return (
    <div className="py-16">
      <h2 className="mb-12 text-center text-3xl font-bold">{mainFeatures.title || "Main Features"}</h2>
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
  );
};

const FeaturesGridSection = ({ features }: { features: FeaturesSectionType | undefined }) => {
  // This component does not use client hooks.
  if (!features?.items || features.items.length === 0) return null;
  return (
    <div className="py-16">
      <h2 className="mb-12 text-center text-3xl font-bold">{features.title || "Everything You Need to Launch Fast"}</h2>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {features.items.map((feature: FeatureType) => (
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
  );
};

const PricingSection = ({ pricing }: { pricing: PricingSectionType | undefined }) => {
  // This component does not use client hooks.
  if (!pricing?.plans || pricing.plans.length === 0) return null;
  return (
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
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center">
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
  );
};

const MAX_DISPLAY_BLOG = 3;

// BlogPostsSection receives 'posts' from its parent (Home component)
// It does not use client hooks directly.
const BlogPostsSection = ({ posts }: { posts: any[] | undefined }) => {
  if (!posts || posts.length === 0) return <div className="py-16 text-center">No posts found.</div>;
  return (
    <div className="py-16">
      <h2 className="mb-12 text-center text-3xl font-bold">Latest Updates</h2>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {posts.slice(0, MAX_DISPLAY_BLOG).map((post) => {
          const { slug, date, title, summary, tags } = post;
          return (
            <article
              key={slug}
              className="flex flex-col overflow-hidden rounded-lg border border-gray-200 transition-shadow hover:shadow-lg dark:border-gray-700"
            >
              <div className="flex-1 p-6">
                <div className="mb-3 flex flex-wrap gap-2">
                  {tags.map((tag: string) => (
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
          );
        })}
      </div>
      {posts.length > MAX_DISPLAY_BLOG && (
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
  );
};

// --- Main Page Component (Server Component) ---
// It accepts 'posts' as a prop from app/page.tsx
interface HomeProps {
  posts: any[]; // Define a more specific type if available for CoreContent<Blog>
}

export default async function Home({ posts }: HomeProps) {
  // Landing content is fetched here
  const landingContent = await getLandingContentData('main-landing');

  if (!landingContent) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 text-center sm:px-6 xl:max-w-5xl xl:px-0">
        <p className="text-lg text-red-500">Failed to load landing page content. Please try again later.</p>
      </div>
    );
  }

  const { hero, mainFeatures, features, cta, pricing, contact } = landingContent;

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 xl:max-w-10/12 xl:px-0">
      <HeroSection hero={hero} />
      <MainFeaturesSection mainFeatures={mainFeatures} />
      <FeaturesGridSection features={features} />
      <PricingSection pricing={pricing} />
      {cta && <CtaSectionClient cta={cta} />}
      <BlogPostsSection posts={posts} /> {/* Use posts prop */}
      {contact && <ContactSectionClient contact={contact} />}
    </div>
  );
}
