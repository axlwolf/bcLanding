interface EmailConfig {
  host: string
  port: number
  secure: boolean
  auth: {
    user: string
    pass: string
  }
  from: string
}

export const emailConfig: EmailConfig = {
  host: process.env.EMAIL_HOST || 'smtp.zoho.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER || '',
    pass: process.env.EMAIL_PASSWORD || '',
  },
  from: `"${process.env.EMAIL_FROM_NAME || 'Your Brand'}" <${process.env.EMAIL_FROM_EMAIL || 'noreply@yourdomain.com'}>`,
}

export const emailTemplates = {
  welcome: 'welcome',
  newsletter: 'newsletter',
  'ebook-delivery': 'ebook-delivery',
  'downloadable-item': 'downloadable-item',
} as const

export type EmailTemplate = keyof typeof emailTemplates
