import { getAllCTAConfig } from '@/lib/ctaConfig'
import { getAllTemplateData } from '@/lib/templateData'
import { sendEmail } from '@/lib/email/sendEmail'
import type { EmailTemplateDataInstance } from '@/lib/models/emailTemplateData'
import type { EmailTemplateData } from '@/types/email'
import type { EmailTemplate } from './config'

/**
 * Handles sending the appropriate email (newsletter, ebook, or welcome) to a new subscriber,
 * based on the current CTA configuration.
 */
export async function sendSubscriptionEmail(
  email: string
): Promise<{ success: boolean; error?: string }> {
  // Fetch the singleton CTA config
  const ctaConfigs = await getAllCTAConfig()
  if (!ctaConfigs || ctaConfigs.length === 0) {
    return { success: false, error: 'CTA configuration not found' }
  }
  const ctaConfig = ctaConfigs[0]

  // Fetch the template data instance for this config
  const allTemplateData = await getAllTemplateData()
  const templateDataInstance: EmailTemplateDataInstance | undefined = allTemplateData.find(
    (t) => t.id === ctaConfig.template_data_id
  )
  if (!templateDataInstance) {
    return { success: false, error: 'Email template data not found' }
  }

  // Prepare template data for sending
  let templateData: EmailTemplateData = {} as EmailTemplateData
  try {
    templateData = JSON.parse(templateDataInstance.data || '{}') as EmailTemplateData
  } catch {
    templateData = {} as EmailTemplateData
  }

  // Process download URL for secure delivery
  if (templateData.downloadUrl) {
    const secureDownloadUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/download-once?file=${encodeURIComponent(templateData.downloadUrl.replace('/uploads/', ''))}&user=${encodeURIComponent(email)}`

    // Update the appropriate URL based on template type
    if (ctaConfig.cta_type === 'ebook-delivery') {
      templateData.downloadUrl = secureDownloadUrl
    } else if (ctaConfig.cta_type === 'downloadable-item') {
      // For downloadable items, we might have a fileInfo object to update
      templateData.downloadUrl = secureDownloadUrl

      // Ensure fileInfo has required fields
      if (!templateData.fileInfo) {
        templateData.fileInfo = {
          format: 'ZIP',
          size: 'Unknown',
          instructions: 'Extract the downloaded ZIP file to access your content.',
        }
      }

      // Set default itemType if not provided
      if (!templateData.itemType) {
        templateData.itemType = 'downloadable content'
      }
    }
  }

  // The name should be obtained from the email
  templateData.name = email.split('@')[0]

  // Send the email using the correct template
  const subject =
    templateData.subject ||
    (ctaConfig.cta_type === 'newsletter'
      ? 'Welcome to our Newsletter!'
      : ctaConfig.cta_type === 'ebook-delivery'
        ? 'Your Ebook is Here!'
        : ctaConfig.cta_type === 'downloadable-item'
          ? `Your ${templateData.itemName || 'Download'} is Ready!`
          : 'Welcome!')

  return await sendEmail({
    to: email,
    subject,
    template: ctaConfig.cta_type as EmailTemplate,
    data: templateData,
  })
}
