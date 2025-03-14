import { createServerClient } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';

export const updateSession = async (request: NextRequest) => {
  try {
    // Utwórz domyślną odpowiedź
    let response = NextResponse.next();

    // Tworzymy klienta Supabase, przekazując funkcje odczytu ciasteczek z request
    // oraz zapis ciasteczek w response
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            // Tylko ustaw ciasteczka w response, bo request.cookies jest tylko do odczytu
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    // Odśwież sesję (metoda ta, jeśli to konieczne, zaktualizuje ciasteczka przez setAll)
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    // Przykładowa logika ochrony tras:
    if (request.nextUrl.pathname.startsWith('/protected') && error) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    if (request.nextUrl.pathname === '/' && !error) {
      return NextResponse.redirect(new URL('/protected', request.url));
    }

    return response;
  } catch (e) {
    // W przypadku błędu zwróć domyślną odpowiedź
    return NextResponse.next();
  }
};
