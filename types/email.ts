export interface EbookDeliveryEmailVars {
  name: string
  ebookTitle: string
  ebookDescription?: string
  ebookCover?: string
  downloadUrl: string
  expiryNotice?: string
  additionalContent?: string
  siteName: string
  showUnsubscribe?: boolean
  unsubscribeUrl?: string
}

export interface FileInfo {
  format: string
  size: string
  instructions?: string
}

export interface EmailTemplateData {
  [key: string]: string | number | boolean | FileInfo | undefined | null
  name?: string
  welcomeMessage?: string
  ctaUrl?: string
  ctaText?: string
  featuredImage?: string
  content?: string
  showUnsubscribe?: boolean
  ebookTitle?: string
  ebookDescription?: string
  ebookCover?: string
  downloadUrl?: string
  expiryNotice?: string
  additionalContent?: string
  siteName?: string
  currentYear?: number
  unsubscribeUrl?: string
  subject?: string
  title?: string
  // Downloadable item specific fields
  itemName?: string
  itemType?: string
  itemDescription?: string
  itemPreview?: string
  fileInfo?: FileInfo
}

export interface EmailRecord {
  id: string
  email: string
  createdAt: string
  updatedAt?: string
  isSubscribed?: boolean
}

export interface EmailAttachment {
  filename: string
  path: string
  contentType?: string
}

export interface EmailOptions {
  to: string
  subject: string
  template: string
  data: EmailTemplateData
  attachments?: EmailAttachment[]
}
