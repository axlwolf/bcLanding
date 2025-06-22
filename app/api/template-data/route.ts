// API route to save a Template Data Instance
import { NextRequest, NextResponse } from 'next/server'
import {
  getAllTemplateData,
  getTemplateDataByTemplate,
  insertTemplateData,
} from '@/lib/templateData'

export async function POST(req: NextRequest) {
  try {
    const { template, data } = await req.json()
    if (!template || typeof data !== 'object') {
      return new NextResponse('Invalid payload', { status: 400 })
    }
    await insertTemplateData({ template, data: JSON.stringify(data) })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('API /api/template-data POST error:', error)
    return NextResponse.json({ ok: false, error: 'Failed to save template data' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const template = searchParams.get('template')
    console.log('[API/template-data] GET param template:', template)
    let data
    if (template) {
      data = await getTemplateDataByTemplate(template)
      console.log('[API/template-data] DB result for template', template, ':', data)
    } else {
      data = await getAllTemplateData()
      console.log('[API/template-data] DB result for all templates:', data)
    }
    return NextResponse.json(data)
  } catch (error) {
    console.error('API /api/template-data GET error:', error)
    return NextResponse.json([], { status: 500 })
  }
}
