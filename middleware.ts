import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    { cookies: req.cookies }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  /*   // Jeśli użytkownik nie jest zalogowany, przekieruj do /login
  if (!session && !req.nextUrl.pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL('/login', req.url));
  } */

  // Dla stron chronionych (poza /login i /callback), sprawdzamy czy w bazie są dane Spotify
  if (
    session &&
    !req.nextUrl.pathname.startsWith('/login') &&
    req.nextUrl.pathname !== '/callback'
  ) {
    const { data: userData, error } = await supabase
      .from('users')
      .select('spotify_access_token')
      .eq('id', session.user.id)
      .single();
    if (error || !userData?.spotify_access_token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  return res;
}

/* export const config = {
  matcher: [
    '/((?!api|.next/static|.next/image|favicon.ico|login|callback|public/iphone.glb|$).*)',
  ],
}; */
