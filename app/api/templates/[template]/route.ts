// API route to serve a template file's content by name
import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

export async function GET(req: NextRequest, context: { params: Promise<{ template: string }> }) {
  const { template } = await context.params
  if (!template) return new NextResponse('Invalid template', { status: 400 })
  const filePath = path.join(process.cwd(), 'templates', 'emails', `${template}.hbs`)
  try {
    const content = await fs.readFile(filePath, 'utf8')
    return new NextResponse(content, { status: 200, headers: { 'Content-Type': 'text/plain' } })
  } catch (e) {
    return new NextResponse('Template not found', { status: 404 })
  }
}
