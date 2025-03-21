// middleware.ts
import { createMiddlewareClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Jeśli użytkownik nie jest zalogowany i próbuje dostać się do chronionej strony
  if (!session && !req.nextUrl.pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Jeśli jest zalogowany ale brakuje danych Spotify
  if (session && req.nextUrl.pathname !== '/callback') {
    const { data: userData } = await supabase
      .from('users')
      .select('spotify_access_token')
      .eq('id', session.user.id)
      .single();

    if (!userData?.spotify_access_token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  return res;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|login|callback).*)'],
};
