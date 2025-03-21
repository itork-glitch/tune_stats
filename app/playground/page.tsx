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
        console.error('Błąd sesji:', sessionError);
        router.replace('/login');
        return;
      }
      const userId = sessionData.session.user.id;
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('spotify_access_token')
        .eq('id', userId)
        .single();
      if (userError) {
        console.error('Błąd pobierania danych użytkownika:', userError);
        setError('Błąd pobierania danych użytkownika');
        return;
      }
      try {
        const response = await fetch(
          'https://api.spotify.com/v1/me/top/tracks',
          {
            headers: {
              Authorization: `Bearer ${userData.spotify_access_token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error(`Błąd Spotify API: ${response.status}`);
        }
        const tracks = await response.json();
        setSongs(tracks.items || []);
      } catch (err) {
        console.error('Błąd pobierania utworów:', err);
        setError('Błąd pobierania utworów');
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
