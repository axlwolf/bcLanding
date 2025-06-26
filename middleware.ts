import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Rutas que siempre deben ser públicas
  const publicPaths = [
    '/static',
    '/images',
    '/api/newsletter',
    '/api/subscribe',
    '/api/email',
    '/_next',
    '/favicon',
    '/robots.txt',
    '/sitemap.xml',
    '/manifest.json',
    '/site.webmanifest',
  ]

  // Verificar si la ruta es pública
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path))
  if (isPublicPath) {
    return NextResponse.next()
  }

  // Proteger solo las rutas de admin
  if (pathname.startsWith('/allset') && pathname !== '/allset/login') {
    const authCookie = request.cookies.get('allset_auth')

    if (!authCookie || authCookie.value !== 'true') {
      const url = new URL('/allset/login', request.url)
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
