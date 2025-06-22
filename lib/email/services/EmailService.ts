import nodemailer, { Transporter } from 'nodemailer'
import { renderTemplate } from '../../utils/templateRenderer'
import { emailConfig, EmailTemplate } from '../config'
import type { EmailTemplateData, EmailAttachment } from '@/types/email'

export interface EmailData {
  subject: string
  template: EmailTemplate
  data: EmailTemplateData
  attachments?: EmailAttachment[]
}

export class EmailService {
  private transporter: Transporter
  private static instance: EmailService

  private constructor() {
    this.transporter = nodemailer.createTransport({
      host: emailConfig.host,
      port: emailConfig.port,
      secure: emailConfig.secure,
      auth: emailConfig.auth,
    })
  }

  public static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService()
    }
    return EmailService.instance
  }

  public async sendEmail(
    to: string,
    { subject, template, data = {}, attachments }: EmailData
  ): Promise<{ success: boolean; error?: string }> {
    try {
      console.log(`Sending email to: ${to}`)
      console.log(`Using template: ${template}`)

      // Add recipient email to template data
      const templateData = {
        ...data,
        to,
        subject,
      }

      console.log('Rendering template with data:', JSON.stringify(templateData, null, 2))

      const html = await renderTemplate(template, templateData)

      console.log('Email content generated, sending...')

      const mailOptions: nodemailer.SendMailOptions = {
        from: emailConfig.from,
        to,
        subject,
        html,
        attachments: attachments?.map((attachment) => ({
          filename: attachment.filename,
          path: attachment.path,
          contentType: attachment.contentType,
        })),
      }

      const info = await this.transporter.sendMail(mailOptions)
      console.log('Email sent:', info.messageId)
      return { success: true }
    } catch (error) {
      console.error('Error sending email:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send email',
      }
    }
  }
}
