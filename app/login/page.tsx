'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

const spotifyID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
const spotifyRedirect = 'http://localhost:3000/spotify-callback';
const spotifyScopes = 'user-read-recently-played user-read-email';

export default function LoginPage() {
  const router = useRouter();

  const handleSpotifyLogin = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'spotify',
      options: {
        scopes: 'user-top-read',
        redirectTo: `${location.origin}/callback`,
      },
    });

    if (error) console.error(error);
  };

  return (
    <div className='p-4'>
      <h1 className='text-2xl font-bold'>Login</h1>
      <button
        onClick={handleSpotifyLogin}
        className='bg-green-500 text-white px-4 py-2 rounded mt-4'>
        Login with Spotify
      </button>
    </div>
  );
}
