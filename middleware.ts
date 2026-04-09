import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_PATHS = ['/login']
const API_PREFIX = '/api'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Пропускаем API роуты и публичные страницы
  if (pathname.startsWith(API_PREFIX) || PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next()
  }

  const session = request.cookies.get('session')?.value

  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  try {
    const user = JSON.parse(session)
    if (!user?.id || !user?.role) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // Защита admin страницы
    if (pathname.startsWith('/admin') && user.role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // Защита mentor страницы
    if (pathname.startsWith('/mentor') && user.role !== 'mentor' && user.role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // Защита HR страниц
    if (pathname.startsWith('/hr') && user.role !== 'hr' && user.role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return NextResponse.next()
  } catch {
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.png|.*\\.svg|.*\\.jpg).*)'],
}
