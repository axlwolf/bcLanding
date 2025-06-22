// API route to manage CTA Config
import { NextRequest, NextResponse } from 'next/server'
import {
  getAllCTAConfig,
  getCTAConfigById,
  getCTAConfigByType,
  insertCTAConfig,
  updateCTAConfig,
  deleteCTAConfig,
} from '@/lib/ctaConfig'

export async function GET(req: NextRequest) {
  try {
    // Always return the first (singleton) config
    const configs = await getAllCTAConfig()
    if (configs && configs.length > 0) {
      return NextResponse.json(configs[0])
    } else {
      return NextResponse.json(null)
    }
  } catch (error) {
    console.error('API /api/cta-config GET error:', error)
    return NextResponse.json(null, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { cta_type, template_data_id, newsletter_frequency } = body
    if (!cta_type || !template_data_id) {
      return new NextResponse('Invalid payload', { status: 400 })
    }
    // Check for any existing config
    const configs = await getAllCTAConfig()
    if (configs && configs.length > 0 && configs[0].id) {
      await updateCTAConfig(configs[0].id, { cta_type, template_data_id, newsletter_frequency })
      return NextResponse.json({ ok: true, id: configs[0].id, updated: true })
    } else {
      const id = await insertCTAConfig({ cta_type, template_data_id, newsletter_frequency })
      return NextResponse.json({ ok: true, id, created: true })
    }
  } catch (error) {
    console.error('API /api/cta-config POST error:', error)
    return NextResponse.json({ ok: false, error: 'Failed to save CTA config' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, ...updates } = body
    if (!id) {
      return new NextResponse('Missing id', { status: 400 })
    }
    await updateCTAConfig(id, updates)
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('API /api/cta-config PATCH error:', error)
    return NextResponse.json({ ok: false, error: 'Failed to update CTA config' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) {
      return new NextResponse('Missing id', { status: 400 })
    }
    await deleteCTAConfig(Number(id))
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('API /api/cta-config DELETE error:', error)
    return NextResponse.json({ ok: false, error: 'Failed to delete CTA config' }, { status: 500 })
  }
}
