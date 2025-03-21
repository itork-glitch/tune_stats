import { supabase } from '@/lib/supabase';

export const refreshSpotifyToken = async (userId: string) => {
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('spotify_refresh_token')
    .eq('id', userId)
    .single();
  if (userError) {
    console.error('Błąd pobierania refresh tokena:', userError);
    return;
  }

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      // Używamy danych z env, żeby klient secret był widoczny tylko po stronie serwera
      Authorization: `Basic ${Buffer.from(
        `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
      ).toString('base64')}`,
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: userData.spotify_refresh_token,
    }),
  });

  if (!response.ok) {
    const errData = await response.json();
    console.error('Błąd odświeżania tokena:', errData);
    return;
  }

  const data = await response.json();
  const newAccessToken = data.access_token;

  const { error: updateError } = await supabase
    .from('users')
    .update({ spotify_access_token: newAccessToken })
    .eq('id', userId);
  if (updateError) {
    console.error('Błąd aktualizacji tokena w bazie:', updateError);
  }
  return newAccessToken;
};
