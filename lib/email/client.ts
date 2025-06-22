'use client'

import { emailTemplates } from './config'
import type { EmailTemplateData, EmailOptions } from '@/types/email'

export { emailTemplates }

type TemplateKey = keyof typeof emailTemplates

type SendEmailParams = Omit<EmailOptions, 'template'> & {
  template: TemplateKey
}

export async function sendEmail({
  to,
  subject,
  template,
  data = {},
}: SendEmailParams): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch('/api/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to,
        subject,
        template,
        data,
      }),
    })

    const result = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: result.error || 'Failed to send email',
      }
    }

    return { success: true }
  } catch (error) {
    console.error('Error sending email:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send email',
    }
  }
}

export default sendEmail
