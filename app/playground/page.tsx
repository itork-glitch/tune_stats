'use client';

import React from 'react';
import Link from 'next/link';
import { RadarChart, PolarAngleAxis, PolarGrid, Radar } from 'recharts';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { useSpotifyAuth } from '@/hooks/useSpotifyAuth';
import { useTopItems } from '@/hooks/useTopItems';
import { StatsCard } from '@/components/StatsCard';
import { Artist, Track } from '@/types/spotify';

export default function Playground() {
  const { token, loading: authLoading, error: authError } = useSpotifyAuth();
  const {
    items: artists,
    loading: artistsLoading,
    error: artistsError,
  } = useTopItems<Artist>(
    'https://api.spotify.com/v1/me/top/artists?limit=50',
    token
  );
  const { items: tracks, loading: tracksLoading } = useTopItems<Track>(
    'https://api.spotify.com/v1/me/top/tracks?limit=50',
    token
  );

  const loading = authLoading || artistsLoading || tracksLoading;
  const error = authError || artistsError?.message;

  if (loading) return <p>Loading...</p>;
  if (error) return <p className='text-red-500'>{error}</p>;

  const genreData = React.useMemo(() => {
    const all = artists.flatMap((a) => a.genres);
    const counts = all.reduce<Record<string, number>>((acc, g) => {
      acc[g] = (acc[g] || 0) + 1;
      return acc;
    }, {});
    const sorted = Object.entries(counts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 6);
    const total = sorted.reduce((sum, [, c]) => sum + c, 0);
    return sorted.map(([genre, count]) => ({
      genre,
      count,
      percent: ((count / total) * 100).toFixed(1),
    }));
  }, [artists]);

  return (
    <div className='container mx-auto p-6'>
      <h1 className='text-3xl font-bold text-center mb-6'>
        Your Spotify Stats
      </h1>
      <div className='grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
        <StatsCard
          title='Top 6 Genres'
          description='Most listened genres in the last 6 months'
          footerText='Trending up by 5.2% this month'>
          <ChartContainer
            config={{ count: { label: 'Genres' } }}
            className='mx-auto aspect-2/1 max-h-[180px]'>
            <RadarChart width={200} height={200} data={genreData}>
              <ChartTooltip cursor content={<ChartTooltipContent />} />
              <PolarAngleAxis dataKey='genre' />
              <PolarGrid />
              <Radar dataKey='percent' fillOpacity={0.6} />
            </RadarChart>
          </ChartContainer>
        </StatsCard>

        <StatsCard title='Top Artists' description='Your most listened artists'>
          <ul className='space-y-2'>
            {artists.slice(0, 5).map((artist) => (
              <li key={artist.id} className='flex items-center gap-2'>
                <Avatar>
                  <AvatarImage
                    src={artist.images?.[0]?.url}
                    alt={artist.name}
                  />
                  <AvatarFallback>{artist.name[0]}</AvatarFallback>
                </Avatar>
                <span className='font-medium'>{artist.name}</span>
              </li>
            ))}
          </ul>
        </StatsCard>

        <StatsCard title='Top Songs' description='Your most listened songs'>
          <ul className='space-y-2'>
            {tracks.slice(0, 5).map((track) => (
              <li key={track.id} className='flex items-center gap-2'>
                <Avatar>
                  <AvatarImage
                    src={track.album.images[0].url}
                    alt={track.name}
                  />
                  <AvatarFallback>{track.name[0]}</AvatarFallback>
                </Avatar>
                <span className='font-medium'>{track.name}</span>
              </li>
            ))}
          </ul>
        </StatsCard>
      </div>

      <div className='mt-6 text-center'>
        <Link href='/recommendation'>Get AI recommendations</Link>
      </div>
    </div>
  );
}
