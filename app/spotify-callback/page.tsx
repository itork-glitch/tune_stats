'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function SpotifyCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    async function handleSpotifyCallback() {
      const hash = window.location.hash;
      const params = new URLSearchParams(hash.substring(1));
      const accessToken = params.get('access_token');
      if (!accessToken) {
        router.push('/login');
        return;
      }

      localStorage.setItem('spotifyAccessToken', accessToken);

      const spotifyResponce = await fetch('https://api.spotify.com/v1/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const spotifyProfile = await spotifyResponce.json();
      const { email, id, display_name } = spotifyProfile;
      if (!email) {
        router.push('/login');
        return;
      }

      const password = id;

      let { data: session, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        const { data: signUpData, error: signUpError } =
          await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                spotifyAccessToken: accessToken,
                spotifyDisplayName: display_name,
              },
            },
          });
        if (signUpError) {
          console.error('Error signing up:', signUpError.message);
          router.push('/login');
          return;
        }
      }

      router.push('/playground');
    }

    handleSpotifyCallback();
  }, [router]);

  return <div>Processing Spotify authentication...</div>;
}
