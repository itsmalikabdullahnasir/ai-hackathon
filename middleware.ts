import { NextResponse } from 'next/server'

export function middleware() {
  // This app uses the Supabase browser client, which stores its session in
  // localStorage. Middleware cannot read that session, so route guards live in
  // client components that can ask Supabase for the current session.
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/courses/:path*',
    '/progress/:path*',
    '/instructor/:path*',
    '/ai-tutor/:path*',
    '/settings/:path*',
    '/login',
    '/onboarding',
  ],
}
