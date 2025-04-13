'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { TrendingUp } from 'lucide-react';
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from 'recharts';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import Link from 'next/link';

interface AudioFeature {
  danceability: number;
}

interface userData {
  email: string;
  auth_id: string;
  refresh_token: string;
}

export default function Playground() {
  const [tracks, setTracks] = useState<any[]>([]);
  const [artists, setArtists] = useState<any[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const fetchToken = async () => {
      // 1. Check for a valid session
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();
      if (sessionError || !sessionData.session) {
        router.replace('/login');
        return;
      }

      // 2. Retrieve and parse the token from localStorage
      const tokenString = localStorage.getItem(
        'sb-saobywbkuqinwaenpzvl-auth-token'
      );

      if (!tokenString) {
        setError("Token didn't exist in localstorage");
        setLoading(false);
        return;
      }
      const parsedToken = JSON.parse(tokenString);

      // Ensure we have a user email or id
      if (!parsedToken.user.email && !parsedToken.user.id) return;

      // 3. Query the users table for an existing user with the given email
      let { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', parsedToken.user.email)
        .maybeSingle();

      if (error) throw new Error('Database error. Check db logs for details.');

      // 4. If user doesn't exist, insert a new record
      if (!user) {
        const userData = {
          email: parsedToken.user.email,
          auth_id: parsedToken.user.id,
          refresh_token: parsedToken.provider_refresh, // Spotify refresh token
        };

        const { data: newUser, error: newUserError } = await supabase
          .from('users')
          .insert(userData)
          .select()
          .maybeSingle();

        if (newUserError) throw new Error('Db error: ' + newUserError.message);
        user = newUser;
      }

      // 5. If the user's record is missing a refresh token, update it
      if (!user.refresh_token) {
        const { data: updatedUser, error: updateError } = await supabase
          .from('users')
          .update({ refresh_token: parsedToken.provider_refresh })
          .eq('email', parsedToken.user.email)
          .maybeSingle();
        if (updateError)
          throw new Error(
            'Error updating user refresh token: ' + updateError.message
          );
        user = updatedUser;
      }

      // 6. Function to refresh the Spotify token using your API endpoint
      const refreshSpotifyToken = async () => {
        try {
          const res = await fetch('/api/spotify-refresh', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              refresh_token: parsedToken.provider_refresh,
            }),
          });
          const refreshData = await res.json();
          if (refreshData.access_token) {
            // Optionally, update localStorage with the new token data here
            return refreshData.access_token;
          } else {
            console.error('Error refreshing Spotify token:', refreshData);
            return parsedToken.provider_token; // Fallback to the old token
          }
        } catch (err) {
          console.error('Error calling Spotify refresh endpoint:', err);
          return parsedToken.provider_token;
        }
      };

      // 7. Refresh the Spotify access token and update state
      const newSpotifyToken = await refreshSpotifyToken();
      setToken(newSpotifyToken);
      setLoading(false);
    };

    fetchToken();
  }, [router]);

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        const [artistsRes, tracksRes] = await Promise.all([
          fetch('https://api.spotify.com/v1/me/top/artists?limit=50', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch('https://api.spotify.com/v1/me/top/tracks?limit=50', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!artistsRes.ok || !tracksRes.ok)
          throw new Error('Spotify API error');

        const [artistData, tracksData] = await Promise.all([
          artistsRes.json(),
          tracksRes.json(),
        ]);

        setArtists(artistData.items || []);
        setTracks(tracksData.items || []);
      } catch (err) {
        console.error('Err:', err);
        setError('Data err');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  useEffect(() => {
    const trackDanceable = async () => {
      if (tracks.length === 0 || !token) return;

      const trackIds = tracks
        .slice(0, 2)
        .map((track) => track.id)
        .join(',');

      const response = await fetch(
        `https://api.spotify.com/v1/audio-features?ids=${trackIds}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        console.error('Spotify API error', response.statusText);
        return;
      }

      const data = await response.json();

      const danceabilities = data.audio_features.map(
        (feature: AudioFeature) => feature.danceability
      );

      const sum = danceabilities.reduce(
        (acc: number, val: number) => acc + val,
        0
      );
      const averageDanceability = (sum / danceabilities.length) * 100;

      console.log('Average Danceability (%):', averageDanceability);
    };

    trackDanceable();
  }, [tracks, token]);

  const getFavouriteGenres = (artists: any[]) => {
    const allGenres: string[] = artists.flatMap((artist) => artist.genres);

    const genreCounts: Record<string, number> = allGenres.reduce(
      (acc, genre) => {
        acc[genre] = (acc[genre] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const sortedGenres = Object.entries(genreCounts)
      .sort(([, countA], [, countB]) => countB - countA)
      .slice(0, 6);

    const total = sortedGenres.reduce((sum, [, count]) => sum + count, 0); // Obliczamy sumę

    return sortedGenres.map(([genre, count]) => ({
      genre,
      count: count, // Oryginalna wartość
      percent: ((count / total) * 100).toFixed(1), // Obliczamy procenty
    }));
  };

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <p className='text-2xl font-bold'>Ładowanie danych...</p>
      </div>
    );
  }

  return (
    <div className='container mx-auto p-6'>
      <h1 className='text-3xl font-bold text-center mb-6'>
        Your Spotify Stats
      </h1>
      {error && <div className='text-red-500 text-center'>{error}</div>}

      <div className='grid grid-cols-4 grid-rows-1 gap-3 max-w-max'></div>

      <div>
        Get awesome AI recomendation.{' '}
        <Link href={'/recomendation'}>Click here</Link>
      </div>
      <div className='grid grid-cols-3 grid-rows-1 gap-6 max-w-max'>
        {/* Top Genres */}
        <Card className='shadow-lg max-h-[350px] max-w-[500px]'>
          <CardHeader className='text-center'>
            <CardTitle>Top 6 Genres</CardTitle>
            <CardDescription>
              Most listened genres in the last 6 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                count: { label: 'Genres', color: 'hsl(139 65% 20%)' },
              }}
              className='mx-auto aspect-2/1 max-h-[180px]'>
              <RadarChart
                width={200}
                height={200}
                data={getFavouriteGenres(artists)}>
                <ChartTooltip cursor={true} content={<ChartTooltipContent />} />
                <PolarAngleAxis dataKey='genre' />
                <PolarGrid />
                <Radar
                  dataKey='percent'
                  fill='hsl(139 65% 20%)'
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className='text-center'>
            <span className='text-green-500 font-semibold'>
              Trending up by 5.2% this month
            </span>
            <TrendingUp className='inline-block ml-2 h-4 w-4' />
          </CardFooter>
        </Card>

        {/* Top artists */}
        <Card className='shadow-lg max-h-[350px] max-w-[500px]'>
          <CardHeader className='text-center'>
            <CardTitle>Top Artists</CardTitle>
            <CardDescription>Your most listened artists</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className='space-y-2'>
              {artists.slice(0, 5).map((artist, idx) => (
                <li key={idx} className='flex items-center gap-2'>
                  <Avatar>
                    <AvatarImage
                      src={artist.images?.[0]?.url || '/placeholder.jpg'} // Jeśli brak obrazu, użyj placeholdera
                      alt={artist.name}
                    />
                    <AvatarFallback>{artist.name?.[0] || '?'}</AvatarFallback>
                  </Avatar>
                  <span className='font-medium text-md'>
                    {artist.name || 'Unknown Artist'}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className='shadow-lg max-h-[350px] max-w-[500px]'>
          <CardHeader className='text-center'>
            <CardTitle>Top Songs</CardTitle>
            <CardDescription>Your most listened Songs</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className='space-y-2'>
              {tracks.slice(0, 5).map((track, idx) => (
                <li key={idx} className='flex items-center gap-2'>
                  <Avatar>
                    <AvatarImage
                      src={track.album?.images?.[0]?.url || '/placeholder.jpg'}
                      alt={track.name}
                    />
                    <AvatarFallback>{track.name?.[0] || '?'}</AvatarFallback>
                  </Avatar>
                  <span className='font-medium text-md'>
                    {track.name || 'Unknown Track'}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
