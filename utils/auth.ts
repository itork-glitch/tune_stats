// utils/auth.ts
import Cookies from 'js-cookie';
import { supabase } from '@/lib/supabaseClient';

/**
 * Initiates the Spotify sign-in process via Supabase OAuth.
 */
export async function signInWithSpotify() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'spotify',
    options: {
      redirectTo: window.location.origin, // redirect back to your app after login
    },
  });
  if (error) throw error;
  return data;
}

/**
 * Listen to auth state changes and sync session token to a cookie.
 * This cookie (named "sb:token") will be used by middleware for route protection.
 */
supabase.auth.onAuthStateChange((_event, session) => {
  if (session) {
    // Store access token in cookie (expires in 1 day; adjust as needed)
    Cookies.set('sb:token', session.access_token, {
      expires: 1,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
  } else {
    Cookies.remove('sb:token');
  }
});
