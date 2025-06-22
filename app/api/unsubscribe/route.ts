import { NextRequest, NextResponse } from 'next/server'
import db from '@/lib/db'

// Handle GET requests for the unsubscribe page with email parameter
export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const email = url.searchParams.get('email')

  if (!email || typeof email !== 'string' || !email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) {
    return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
  }

  try {
    // Check if the email exists in our database
    const emails = await db.getAllEmails()
    const emailExists = emails.some((e) => e.email.toLowerCase() === email.toLowerCase())

    if (!emailExists) {
      return NextResponse.json({ error: 'Email not found' }, { status: 404 })
    }

    // Return success for GET requests - actual unsubscribe happens in POST
    return NextResponse.json({
      success: true,
      message: 'Email found. Submit a POST request to this endpoint to confirm unsubscribe.',
    })
  } catch (err) {
    console.error('Error checking email:', err)
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}

// Handle POST requests to actually perform the unsubscribe action
export async function POST(req: NextRequest) {
  const { email } = await req.json()

  if (!email || typeof email !== 'string' || !email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) {
    return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
  }

  try {
    // First check if the email exists
    const emails = await db.getAllEmails()
    const emailExists = emails.some((e) => e.email.toLowerCase() === email.toLowerCase())

    if (!emailExists) {
      return NextResponse.json({ error: 'Email not found' }, { status: 404 })
    }

    // Find the email record to get its ID
    const emailRecord = emails.find((e) => e.email.toLowerCase() === email.toLowerCase())
    if (!emailRecord) {
      return NextResponse.json({ error: 'Email record not found' }, { status: 404 })
    }

    // Delete the email from the database
    await db.deleteEmail(emailRecord.id)

    return NextResponse.json({
      success: true,
      message: 'You have been successfully unsubscribed.',
    })
  } catch (err) {
    console.error('Error unsubscribing email:', err)
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}
