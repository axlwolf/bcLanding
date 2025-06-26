'use client'
import headerNavLinks from '@/data/headerNavLinks'
import Logo from '@/data/logo2.png'

import Link from './Link'
import MobileNav from './MobileNav'
import ThemeSwitch from './ThemeSwitch'
import SearchButton from './SearchButton'
import Image from 'next/image'
// import dataLandingContent from '@/data/landingContent.json' // Removed
import { LandingContent, ProductSaaSLandingContent, YouTubeLandingContent } from 'app/allset/landing-content/types' // Ensure all necessary types are imported

// const landingContent = dataLandingContent as LandingContent // Removed

interface HeaderProps {
  siteMetadata: {
    headerTitle: string
    logoUrl?: string
    siteLogo: string
    stickyNav: boolean
  }
  landingContent: LandingContent | null // Added prop to receive landing content
}

const Header = ({ siteMetadata, landingContent }: HeaderProps) => {
  let headerClass =
    'flex items-center w-full bg-slate-100 dark:bg-slate-900 dark:text-slate-200 justify-between py-10 mx-auto max-w-3xl px-4 sm:px-6 xl:max-w-10/12 xl:px-0'
  if (siteMetadata.stickyNav) {
    headerClass += ' sticky top-0 z-50'
  }

  // Filter navLinks based on the passed landingContent
  const navLinks = headerNavLinks.filter((link) => {
    if (!landingContent) { // If no content, show all links or a default set
      return true; // Or apply some default filtering logic
    }
    if (landingContent.pageType === 'product' || landingContent.pageType === 'saas') {
      const content = landingContent as ProductSaaSLandingContent;
      return !(
        (!content.pricing && link.title === 'Pricing') ||
        (!content.features && link.title === 'Features') ||
        (!content.contact && link.title === 'Contact')
      );
    }
    if (landingContent.pageType === 'youtube') {
      const content = landingContent as YouTubeLandingContent;
      // Assuming YouTube type might also have a contact section defined in its type
      return !(!content.contact && link.title === 'Contact');
    }
    return true; // Default: don't filter if pageType is unknown or doesn't match
  });

  const logoSrc =
    siteMetadata.logoUrl ||
    siteMetadata.siteLogo ||
    (Logo && Logo.src) ||
    '/static/images/logo2.png'

  return (
    <header className={headerClass}>
      <Link href="/" aria-label={siteMetadata.headerTitle}>
        <div className="flex items-center justify-between">
          <div className="mr-3">
            {typeof logoSrc === 'string' && logoSrc.startsWith('http') ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoSrc} alt="logo" width={64} height={64} style={{ borderRadius: 4 }} />
            ) : (
              <Image src={logoSrc} alt="logo" width={64} height={64} />
            )}
          </div>
          {typeof siteMetadata.headerTitle === 'string' ? (
            <div className="hidden h-6 text-2xl font-semibold sm:block">
              {siteMetadata.headerTitle}
            </div>
          ) : (
            siteMetadata.headerTitle
          )}
        </div>
      </Link>
      <div className="flex items-center space-x-4 leading-5 sm:-mr-6 sm:space-x-6">
        <div className="no-scrollbar hidden max-w-52 items-center gap-x-4 overflow-x-auto sm:flex md:max-w-72 lg:max-w-fit">
          {navLinks
            .filter((link) => link.href !== '/')
            .map((link) => (
              <Link
                key={link.title}
                href={link.href}
                className="hover:text-primary-500 dark:hover:text-primary-400 m-1 font-medium text-slate-800 dark:text-gray-100"
              >
                {link.title}
              </Link>
            ))}
        </div>
        <SearchButton />
        <ThemeSwitch />
        <MobileNav />
      </div>
    </header>
  )
}

export default Header
