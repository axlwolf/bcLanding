/**
 * Utility functions to convert TypeScript types to template structures
 */
import {
  ProductSaaSLandingContent,
  YouTubeLandingContent,
  PageType,
} from '../../app/allset/landing-content/types'

/**
 * Creates a template object for a Product/SaaS landing page
 */
export const createProductTemplate = (): Partial<ProductSaaSLandingContent> => {
  return {
    pageType: 'product',
    seo: {
      title: 'Product Name - Product Description',
      description: 'SEO description for the product landing page',
      keywords: ['keyword1', 'keyword2', 'keyword3'],
    },
    hero: {
      title: 'Main headline that captures attention',
      description: 'Compelling subheading that explains the value proposition',
      image: '/placeholder.jpg',
      imagePrompt: 'Describe the image for the generator here.',
      primaryCta: {
        text: 'Primary call-to-action button text',
        link: '#',
      },
      secondaryCta: {
        text: 'Secondary call-to-action button text',
        link: '#',
      },
    },
    mainFeatures: {
      title: 'Main Features',
      description: 'Main Features description',
      items: [
        {
          id: 1,
          icon: 'FaBolt',
          title: 'Feature 1 title',
          description: 'Feature 1 description',
          image: '/placeholder.jpg',
          imagePrompt: 'Describe the image for the generator here.',
        },
        {
          id: 2,
          icon: 'FaShieldAlt',
          title: 'Feature 2 title',
          description: 'Feature 2 description',
          image: '/placeholder.jpg',
          imagePrompt: 'Describe the image for the generator here.',
        },
      ],
    },
    features: {
      title: 'Features section title',
      description: 'Features section description',
      items: [
        {
          title: 'Feature 1 title',
          description: 'Feature 1 description',
          icon: 'FiUsers',
        },
        {
          title: 'Feature 2 title',
          description: 'Feature 2 description',
          icon: 'FiSmartphone',
        },
      ],
    },
    cta: {
      title: 'Call to action section title',
      description: 'Call to action section description',
      button: {
        text: 'Call to action button text',
        link: '#',
      },
      collectEmail: true,
    },
    faqs: {
      title: 'Frequently Asked Questions',
      description: 'Find answers to common questions about our product/service',
      questions: [
        {
          question: 'Question 1?',
          answer: 'Answer to question 1.',
        },
        {
          question: 'Question 2?',
          answer: 'Answer to question 2.',
        },
      ],
    },
    stats: {
      title: 'Stats section title',
      description: 'Stats section description',
      items: [
        {
          value: '98%',
          label: 'User Satisfaction',
        },
        {
          value: '50+',
          label: 'Items',
        },
        {
          value: '50K+',
          label: 'Active Users',
        },
        {
          value: '5M+',
          label: 'Item',
        },
      ],
    },
    pricing: {
      title: 'Pricing Plans',
      description: 'Choose the plan that fits your needs',
      plans: [
        {
          name: 'Basic',
          price: '$9/month',
          description: 'Perfect for individuals',
          features: [{ text: 'Feature 1' }, { text: 'Feature 2' }, { text: 'Feature 3' }],
          cta: {
            text: 'Get Started',
            link: '#',
          },
          highlighted: false,
        },
        {
          name: 'Pro',
          price: '$29/month',
          description: 'For small teams',
          features: [
            { text: 'Feature 1' },
            { text: 'Feature 2' },
            { text: 'Feature 3' },
            { text: 'Feature 4' },
            { text: 'Feature 5' },
          ],
          cta: {
            text: 'Start Free Trial',
            link: '#',
          },
          highlighted: true,
        },
      ],
    },
    contact: {
      title: 'Contact section title',
      description: 'Contact section description',
      fields: [
        { name: 'name', label: 'Name', type: 'text', required: true },
        { name: 'email', label: 'Email', type: 'email', required: true },
      ],
      submitLabel: 'Submit button text',
      successMessage: 'Success message after form submission',
      contactInfo: {
        title: 'Contact Information',
        phone: { label: 'Phone', number: '', hours: '' },
        email: { label: 'Email', address: '', responseTime: '' },
        location: { label: 'Location', address: ['Address line 1', 'Address line 2'] },
      },
    },
    testimonials: {
      title: 'Testimonials section title',
      description: 'Testimonials section description',
      image: '/placeholder.jpg',
      testimonials: [
        {
          name: 'Client Name',
          title: 'Client Title',
          quote: 'Client testimonial quote.',
          image: '/placeholder.jpg',
          imagePrompt: 'Describe the image for the generator here.',
        },
      ],
    },
  }
}

/**
 * Creates a template object for a YouTube landing page
 */
export const createYouTubeTemplate = (): Partial<YouTubeLandingContent> => {
  return {
    pageType: 'youtube',
    seo: {
      title: 'Channel Name - YouTube Channel',
      description: 'Description of the YouTube channel for SEO purposes',
      keywords: ['keyword1', 'keyword2', 'keyword3'],
    },
    channelInfo: {
      name: 'Channel Name',
      description: 'Detailed description of what the channel is about',
      subscriberCount: '100K',
      profileImage: '/placeholder.jpg',
      bannerImage: '/placeholder.jpg',
      joinDate: 'January 2020',
      totalViews: '5M+',
      links: [
        {
          platform: 'Twitter',
          url: 'https://twitter.com/channelname',
          icon: 'FaTwitter',
        },
        {
          platform: 'Instagram',
          url: 'https://instagram.com/channelname',
          icon: 'FaInstagram',
        },
      ],
    },
    featuredVideos: [
      {
        id: 'video1',
        title: 'Featured Video 1 Title',
        description: 'Description of featured video 1',
        thumbnail: '/placeholder.jpg',
        viewCount: '500K',
        duration: '10:30',
        publishedAt: '3 months ago',
        url: 'https://youtube.com/watch?v=video1',
      },
      {
        id: 'video2',
        title: 'Featured Video 2 Title',
        description: 'Description of featured video 2',
        thumbnail: '/placeholder.jpg',
        viewCount: '350K',
        duration: '15:45',
        publishedAt: '5 months ago',
        url: 'https://youtube.com/watch?v=video2',
      },
    ],
    playlists: [
      {
        id: 'playlist1',
        title: 'Playlist 1 Title',
        description: 'Description of playlist 1',
        videoCount: 15,
        thumbnail: '/placeholder.jpg',
        lastUpdated: '2 weeks ago',
      },
    ],
    cta: {
      subscribeText: 'Subscribe to Channel',
      subscribeLink: 'https://youtube.com/channel/channelid?sub_confirmation=1',
      joinText: 'Become a Member',
      joinLink: 'https://youtube.com/channel/channelid/join',
      socialLinks: [
        {
          platform: 'Patreon',
          url: 'https://patreon.com/channelname',
          icon: 'FaPatreon',
        },
      ],
    },
    about: {
      title: 'About the Channel',
      content: 'Detailed information about the channel, its mission, and the content creator',
      stats: [
        {
          label: 'Videos',
          value: '250+',
        },
        {
          label: 'Joined',
          value: 'January 2020',
        },
      ],
    },
    contact: {
      title: 'Contact section title',
      description: 'Contact section description',
      fields: [
        { name: 'name', label: 'Name', type: 'text', required: true },
        { name: 'email', label: 'Email', type: 'email', required: true },
      ],
      submitLabel: 'Submit button text',
      successMessage: 'Success message after form submission',
      contactInfo: {
        title: 'Contact Information',
        phone: { label: 'Phone', number: '', hours: '' },
        email: { label: 'Email', address: '', responseTime: '' },
        location: { label: 'Location', address: ['Address line 1', 'Address line 2'] },
      },
    },
  }
}

/**
 * Creates a template object for a given page type
 */
export const createTemplateForPageType = (pageType: PageType) => {
  switch (pageType) {
    case 'youtube':
      return createYouTubeTemplate()
    case 'product':
    default:
      return createProductTemplate()
  }
}

/**
 * Converts a template object to a formatted JSON string with image prompt comments
 */
export const templateToString = (template: object): string => {
  // Add image prompt comments to the stringified JSON
  const jsonString = JSON.stringify(template, null, 2)

  // Add a comment about image prompts
  return jsonString.replace(
    /"imagePrompt": "([^"]*)"/g,
    '"imagePrompt": "$1" // This will be used to generate an AI image'
  )
}

/**
 * Gets a template string for a given page type
 */
export const getTemplateStringForPageType = (pageType: PageType): string => {
  const template = createTemplateForPageType(pageType)
  return templateToString(template)
}
