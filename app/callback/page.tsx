'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function Callback() {
  const router = useRouter();
  const [message, setMessage] = useState('Łączenie ze Spotify...');

  useEffect(() => {
    const handleAuth = async () => {
      // Pobieramy kod autoryzacyjny z query string
      const code = new URL(window.location.href).searchParams.get('code');
      if (!code) {
        router.replace('/login');
        return;
      }

      // Wymiana kodu na sesję
      setMessage('Wymiana kodu na sesję...');
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) {
        console.error('Błąd wymiany kodu na sesję:', error);
        router.replace('/login');
        return;
      }

      // Aktualizacja danych użytkownika w bazie
      setMessage('Zapisywanie danych użytkownika...');
      const { error: dbError } = await supabase.from('users').upsert({
        id: data.session?.user.id,
        spotify_access_token: data.session?.provider_token,
        spotify_refresh_token: data.session?.provider_refresh_token,
      });
      if (dbError) {
        console.error('Błąd zapisu w bazie:', dbError);
      }

      // Tworzenie ciasteczka z tokenem Bearer dla Spotify
      const spotifyToken = data.session?.provider_token;
      if (spotifyToken) {
        document.cookie = `spotify_bearer=${spotifyToken}; path=/; secure; samesite=strict;`;
      } else {
        console.warn('Brak tokena Spotify');
      }

      // Przekierowanie na /playground
      setMessage('Przekierowywanie...');
      router.replace('/playground');
    };

    handleAuth();
  }, [router]);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}>
      <h2>{message}</h2>
    </div>
  );
}
