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
      const { data: sessionData, error: sessionErr } =
        await supabase.auth.getSession();
      if (sessionErr || !sessionData.session) {
        return router.push('/login');
      }

      const storageKey = 'sb-saobywbkuqinwaenpzvl-auth-token';
      const tokenString = localStorage.getItem(storageKey);
      if (!tokenString) {
        return router.push('/login');
      }
      const parsedToken = JSON.parse(tokenString) as Record<string, any>;

      console.log(parsedToken.user.email);

      if (!parsedToken.provider_token) {
        const email = parsedToken.user.email;
        const { data: users, error } = await supabase
          .from('users')
          .select('*')
          .eq('email', email);
        if (error || !users || users.length === 0) {
          console.error('Nie znaleziono użytkownika w bazie', error);
          return router.push('/login');
        }

        const user: userData = users[0];
        const refreshToken = user.refresh_token;

        const tokenRes = await fetch('/api/refresh-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        });

        if (!tokenRes.ok) {
          const errorData = await tokenRes.json();
          throw new Error(`Bad request: ${errorData.error || 'Unknown error'}`);
        }

        const data = await tokenRes.json();

        parsedToken.provider_token = data.access_token;
        localStorage.setItem(storageKey, JSON.stringify(parsedToken));
        setToken(data.access_token);
      } else {
        setToken(parsedToken.provider_token);
      }
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
