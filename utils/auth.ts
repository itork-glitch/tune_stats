// utils/auth.ts
import Cookies from 'js-cookie';
import { supabase } from '@/utils/supabase/client';
import type { Session, AuthChangeEvent } from '@supabase/supabase-js';

/**
 * Initiates the Spotify sign-in process via Supabase OAuth.
 */
export async function signInWithSpotify(): Promise<void> {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'spotify',
    options: {
      redirectTo: window.location.origin, // redirect back to your app after login
      scopes: 'user-read-recently-played user-top-read', // Spotify scopes
    },
  });
  if (error) throw error;
}

// Listen for auth state changes and sync the session's access token to a cookie.
supabase.auth.onAuthStateChange(
  (event: AuthChangeEvent, session: Session | null) => {
    if (session) {
      // Set a secure HTTP‑only cookie with the access token.
      Cookies.set('sb:token', session.access_token, {
        expires: 1, // 1 day
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });
    } else {
      Cookies.remove('sb:token');
    }
  }
);
