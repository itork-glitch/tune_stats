'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

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
    if (error) {
      console.error('Błąd logowania przez Spotify:', error);
      // Możesz wyświetlić komunikat użytkownikowi
    }
  };

  return (
    <div>
      <h1>Logowanie</h1>
      <button onClick={handleSpotifyLogin}>Połącz konto Spotify</button>
    </div>
  );
}
