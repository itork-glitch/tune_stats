import { supabase } from '@/lib/supabase';

export const refreshSpotifyToken = async (userId: string) => {
  const { data: userData } = await supabase
    .from('users')
    .select('spotify_refresh_token')
    .eq('id', userId)
    .single();

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(
        `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
      ).toString('base64')}`,
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: userData.spotify_refresh_token,
    }),
  });

  const data = await response.json();

  await supabase
    .from('users')
    .update({ spotify_access_token: data.access_token })
    .eq('id', userId);
};
