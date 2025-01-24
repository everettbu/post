import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Check if the user has submitted a date (we'll store this in a cookie)
  const hasSubmittedDate = request.cookies.get('date-submitted')
  
  // If user hasn't submitted a date and tries to access any page except /gate,
  // redirect them to the gate
  if (!hasSubmittedDate && !request.nextUrl.pathname.startsWith('/dategate')) {
    return NextResponse.redirect(new URL('/dategate', request.url))
  }

  // If user has submitted a date and tries to access /gate,
  // redirect them to home
  if (hasSubmittedDate && request.nextUrl.pathname.startsWith('/dategate')) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

// Configure which routes to run middleware on
export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
} 