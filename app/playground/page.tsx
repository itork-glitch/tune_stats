'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function Playground() {
  const [songs, setSongs] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();
      if (sessionError || !sessionData.session) {
        console.error('Session error:', sessionError);
        router.replace('/login');
        return;
      }

      const tokenString = localStorage.getItem(
        'sb-saobywbkuqinwaenpzvl-auth-token'
      );

      if (!tokenString) return;

      const token = JSON.parse(tokenString);

      console.log(token);

      try {
        const response = await fetch(
          'https://api.spotify.com/v1/me/top/tracks',
          {
            headers: {
              Authorization: `Bearer ${token.provider_token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error(
            `Błąd Spotify API: ${response.status + response.statusText}`
          );
        }
        const tracks = await response.json();
        setSongs(tracks.items || []);
      } catch (err) {
        console.error('Err', err);
        setError('Song parsing problem');
      }
    };

    fetchData();
  }, [router]);

  return (
    <div>
      <h1>Top Tracks</h1>
      {error && <div>{error}</div>}
      <ul>
        {songs.map((song, idx) => (
          <li key={idx}>{song.name}</li>
        ))}
      </ul>
    </div>
  );
}
