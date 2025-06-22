import { NextResponse } from 'next/server'
import { EmailService } from '@/lib/email/services/EmailService'
import { emailTemplates } from '@/lib/email/config'

export async function POST(req: Request) {
  try {
    const { to, subject, template, data } = await req.json()

    // Validate required fields
    if (!to || !subject || !template) {
      return NextResponse.json(
        { error: 'Missing required fields: to, subject, or template' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(to)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    // Validate template
    if (!Object.values(emailTemplates).includes(template)) {
      return NextResponse.json({ error: 'Invalid template' }, { status: 400 })
    }

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
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error sending email:', error)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}
