import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

export async function GET(request: Request) {
  // Create a cookie store using Next.js cookies
  const cookieStore = await cookies();

  // Initialize the Supabase server client with proper cookie handling
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        },
      },
    }
  );

  // Begin the OAuth flow with Spotify; note the redirectTo option
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'spotify',
    options: {
      redirectTo: process.env.REDIRECT_URL, // Make sure this is defined in your .env file
    },
  });

  if (error || !data.url) {
    console.error('Error during sign-in:', error);
    return NextResponse.json(
      { error: error?.message || 'Błąd podczas logowania' },
      { status: 500 }
    );
  }

  // Redirect the user to the URL provided by Supabase (Spotify OAuth page)
  return NextResponse.redirect(data.url);
}
