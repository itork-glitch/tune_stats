'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

const spotifyID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
const spotifyRedirect = process.env.DEV_URL + '/spotify-callback';
const spotifyScopes = 'user-read-recently-played user-read-email';

export default function LoginPage() {
  const router = useRouter();

  const handleSpotifyLogin = () => {
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${spotifyID}&redirect_uri=${encodeURIComponent(spotifyRedirect)}&scope=${encodeURIComponent(spotifyScopes)}&response_type=token`;
    window.location.href = authUrl;
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
