import { NextRequest, NextResponse } from 'next/server'
import db from '@/lib/db'
import { sendSubscriptionEmail } from '@/lib/email/subscriptionEmail'

export async function POST(req: NextRequest) {
  const { email } = await req.json()
  if (!email || typeof email !== 'string' || !email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) {
    return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
  }

  try {
    await db.insertEmail(email)

    const sendResult = await sendSubscriptionEmail(email)
    if (!sendResult.success) {
      return NextResponse.json(
        { error: sendResult.error || 'Failed to send email' },
        { status: 500 }
      )
    }
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (err: unknown) {
    console.error('Error subscribing email:', err)
    if (isUniqueConstraintError(err)) {
      return NextResponse.json({ error: 'Email already subscribed' }, { status: 409 })
    }
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}

function isUniqueConstraintError(err: unknown): boolean {
  // SQLite: code === 'SQLITE_CONSTRAINT_UNIQUE'
  // Postgres/Supabase: code === '23505'
  if (
    err &&
    typeof err === 'object' &&
    'code' in err &&
    typeof (err as { code?: unknown }).code === 'string'
  ) {
    const code = (err as { code: string }).code
    if (code === 'SQLITE_CONSTRAINT_UNIQUE' || code === '23505') {
      return true
    }
  }
  // Optionally, check error message for robustness
  if (
    err &&
    typeof err === 'object' &&
    'message' in err &&
    typeof (err as { message?: unknown }).message === 'string'
  ) {
    const msg = (err as { message: string }).message
    if (msg.includes('unique constraint') || msg.includes('duplicate key value')) {
      return true
    }
  }
  return false
}
