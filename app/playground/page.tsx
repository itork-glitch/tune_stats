'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { TrendingUp } from 'lucide-react';
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from 'recharts';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function Playground() {
  const [songs, setSongs] = useState<any[]>([]);
  const [artists, setArtists] = useState<any[]>([]);
  const [topSongs, setTopSongs] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();
      if (sessionError || !sessionData.session) {
        router.replace('/login');
        return;
      }

      const tokenString = localStorage.getItem(
        'sb-saobywbkuqinwaenpzvl-auth-token'
      );
      if (!tokenString) return;
      let token = JSON.parse(tokenString);

      try {
        const response = await fetch(
          'https://api.spotify.com/v1/me/top/artists?limit=50',
          {
            headers: { Authorization: `Bearer ${token.provider_token}` },
          }
        );
        if (!response.ok) throw new Error('Spotify API error');
        const artists = await response.json();
        setArtists(artists.items || []);
      } catch (err) {
        setError('Problem z pobraniem artystów.');
      }
    };
    fetchData();
  }, [router]);

  const getFavouriteGenres = (artists: any[]) => {
    const allGenres: string[] = artists.flatMap((artist) => artist.genres);

    const genreCounts: Record<string, number> = allGenres.reduce(
      (acc, genre) => {
        acc[genre] = (acc[genre] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return Object.entries(genreCounts)
      .sort(([, countA], [, countB]) => countB - countA)
      .slice(0, 6)
      .map(([genre, count]) => ({ genre, count }));
  };

  return (
    <div className='container mx-auto p-6'>
      <h1 className='text-3xl font-bold text-center mb-6'>
        Your Spotify Stats
      </h1>
      {error && <div className='text-red-500 text-center'>{error}</div>}

      <div className='grid md:grid-cols-2 gap-6 max-w-max'>
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
                count: { label: 'Genres', color: 'hsl(var(--chart-1))' },
              }}
              className='mx-auto aspect-2/1 max-h-[180px]'>
              <RadarChart
                width={200}
                height={200}
                data={getFavouriteGenres(artists)}>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent />}
                />
                <PolarAngleAxis dataKey='genre' />
                <PolarGrid />
                <Radar dataKey='count' fill='#4F46E5' fillOpacity={0.6} />
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
                      src={artist.images[0]?.url}
                      alt={artist.name}
                    />
                    <AvatarFallback>{artist.name[0]}</AvatarFallback>
                  </Avatar>
                  <span className='font-medium text-md'>{artist.name}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
