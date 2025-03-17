// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Create the Supabase client using the URL, key, and options.
  // In middleware, we pass the cookies from the request.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookieOptions: {
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      },
      cookies: request.cookies,
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // For any route under /protected, if no session exists, redirect to /login.
  if (request.nextUrl.pathname.startsWith('/protected') && !session) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: ['/protected/:path*'],
};
