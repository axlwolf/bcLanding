import { EmailService } from './services/EmailService'
import { emailTemplates as templateNames } from './config'
import type { EmailTemplateData, EmailAttachment } from '@/types/email'

type EmailOptions = {
  to: string
  subject: string
  template: keyof typeof templateNames
  data: EmailTemplateData
  attachments?: EmailAttachment[]
}

export async function sendEmail({
  to,
  subject,
  template,
  data,
  attachments,
}: EmailOptions): Promise<{ success: boolean; error?: string }> {
  try {
    const emailService = EmailService.getInstance()

    // Add common data to all emails
    const emailData = {
      ...data,
      siteName: process.env.NEXT_PUBLIC_SITE_NAME || 'Our Service',
      currentYear: new Date().getFullYear(),
      unsubscribeUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/unsubscribe?email=${encodeURIComponent(to)}`,
    }

    await emailService.sendEmail(to, {
      subject,
      template,
      data: emailData,
      attachments,
    })

    return { success: true }
  } catch (error) {
    console.error('Error in sendEmail utility:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send email',
    }
  }
}

export const emailTemplates = templateNames
