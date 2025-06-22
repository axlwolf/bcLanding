import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import siteMetadata from '@/data/siteMetadata'

// Store a simple download log in memory (for demo; replace with DB in production)
const DOWNLOAD_LOG_PATH = path.join(process.cwd(), 'data', 'download-log.json')
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads')

async function hasDownloaded(downloadKey: string, userId: string): Promise<boolean> {
  try {
    const logRaw = await fs.readFile(DOWNLOAD_LOG_PATH, 'utf8')
    const log = JSON.parse(logRaw)
    return Boolean(log[downloadKey]?.includes(userId))
  } catch {
    return false
  }
}

async function logDownload(downloadKey: string, userId: string) {
  let log = {}
  try {
    const logRaw = await fs.readFile(DOWNLOAD_LOG_PATH, 'utf8')
    log = JSON.parse(logRaw)
  } catch (e) {
    /* ignore error, fallback to 404 */
  }
  if (!log[downloadKey]) log[downloadKey] = []
  if (!log[downloadKey].includes(userId)) log[downloadKey].push(userId)
  await fs.writeFile(DOWNLOAD_LOG_PATH, JSON.stringify(log, null, 2))
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const file = url.searchParams.get('file') // e.g. '1712345678-myfile.pdf'
  const userId = url.searchParams.get('user') // e.g. user email or id
  console.log('[download-once] Incoming request', {
    url: req.url,
    file,
    userId,
    method: req.method,
    headers: Object.fromEntries(req.headers.entries()),
    time: new Date().toISOString(),
  })

  if (!file || !userId) {
    console.error('[download-once] Missing file or user', { file, userId })
    return NextResponse.json({ error: 'Missing file or user' }, { status: 400 })
  }

  const downloadKey = file // could be more complex (e.g. template+file)
  // if (await hasDownloaded(downloadKey, userId)) {
  //   return NextResponse.json({ error: 'Already downloaded' }, { status: 403 })
  // }

  // Only log and redirect, do not try to access the file system
  try {
    // await logDownload(downloadKey, userId)
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || siteMetadata.siteUrl
    const redirectUrl = `${baseUrl.replace(/\/$/, '')}/uploads/${file}`
    console.log('[download-once] Redirecting to', redirectUrl)
    return NextResponse.redirect(redirectUrl, 302)
  } catch (err) {
    console.error('[download-once] Error during redirect or logging', {
      error: err instanceof Error ? err.message : err,
      file,
      userId,
      downloadKey,
      time: new Date().toISOString(),
    })
    return NextResponse.json(
      {
        error: 'File not found or logging failed',
        details: err instanceof Error ? err.message : err,
      },
      { status: 404 }
    )
  }
}
