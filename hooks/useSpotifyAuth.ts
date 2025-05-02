// hooks/useSpotifyAuth.ts

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

const STORAGE_KEY = 'spotify_auth_token';
const SB_AUTH_KEY = 'sb-saobywbkuqinwaenpzvl-auth-token';

interface RawAuth {
  user: { email: string; id: string };
  provider_refresh_token: string;
}

interface ParsedToken {
  provider_token: string;
  refresh_token?: string;
  expires_in?: number;
  expires_at?: number;
}

export function useSpotifyAuth() {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const parseStorage = useCallback(
    (key: string): ParsedToken | RawAuth | null => {
      try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : null;
      } catch {
        return null;
      }
    },
    []
  );

  useEffect(() => {
    let mounted = true;

    // 1) wait for Supabase auth to be ready
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;

      if (!session) {
        // truly not logged in
        router.push('/login');
        return;
      }

      // 2) now check for spotify tokens in localStorage
      const parsed = parseStorage(STORAGE_KEY) as ParsedToken | null;
      const rawAuth = parseStorage(SB_AUTH_KEY) as RawAuth | null;

      if (!parsed || !rawAuth) {
        router.push('/login');
        return;
      }

      // 3) if we have a Spotify provider_token, use it immediately
      if ('provider_token' in parsed && parsed.provider_token) {
        setToken(parsed.provider_token);
        setLoading(false);
        return;
      }

      // 4) otherwise, refresh via your API
      (async () => {
        try {
          const { user } = rawAuth;
          const { data: userRec, error: selErr } = await supabase
            .from('users')
            .select('refresh_token')
            .eq('email', user.email)
            .single();

          if (selErr || !userRec?.refresh_token)
            throw new Error('No refresh token in DB');

          const resp = await fetch('/api/refresh-token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              refreshToken: userRec.refresh_token,
              email: user.email,
              authID: user.id,
            }),
          });
          if (!resp.ok) throw new Error('Refresh endpoint failed');

          const { access_token, refresh_token, expires_in } = await resp.json();
          const newObj: ParsedToken = {
            provider_token: access_token,
            refresh_token,
            expires_in,
            expires_at: Math.floor(Date.now() / 1000) + expires_in,
          };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(newObj));
          setToken(access_token);
        } catch (e) {
          console.error(e);
          router.push('/login');
        } finally {
          if (mounted) setLoading(false);
        }
      })();
    });

    return () => {
      mounted = false;
    };
  }, [parseStorage, router]);

  return { token, loading, error };
}
