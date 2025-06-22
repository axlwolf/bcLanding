import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads')

export async function POST(req: NextRequest) {
  const data = await req.formData()
  const file = data.get('file') as File | null
  if (!file) return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })

  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  await fs.mkdir(UPLOADS_DIR, { recursive: true })
  const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, '')}`
  const filePath = path.join(UPLOADS_DIR, filename)
  await fs.writeFile(filePath, buffer)

  // URL accessible from public
  const url = `/uploads/${filename}`
  return NextResponse.json({ url })
}
