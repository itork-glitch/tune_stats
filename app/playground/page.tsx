'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';
import { TrendingUp } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
const chartData = [
  { month: 'January', desktop: 186 },
  { month: 'February', desktop: 305 },
  { month: 'March', desktop: 237 },
  { month: 'April', desktop: 73 },
  { month: 'May', desktop: 209 },
  { month: 'June', desktop: 214 },
];

const chartConfig = {
  desktop: {
    label: 'Desktop',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

const Playground = () => {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [songs, setSongs] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [playTime, setPlayTime] = useState<number>(0);

  useEffect(() => {
    async function fetchSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
      } else {
        setSession(session);
        setLoading(false);
      }
    }
    fetchSession();
  }, [router]);

  // Fetch Spotify listening history if token is available (from localStorage or user metadata)
  useEffect(() => {
    const token = localStorage.getItem('spotifyAccessToken');
    if (!token) return;

    async function fetchSongs() {
      try {
        const response = await fetch(
          'https://api.spotify.com/v1/me/player/recently-played?limit=50',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          const errData = await response.json();
          setError(errData.message || 'Failed to fetch songs');
          return;
        }
        const songData = await response.json();
        setSongs(songData.items);
      } catch (err: any) {
        setError(err.message);
      }
    }
    fetchSongs();
  }, [session]);

  if (loading) return <div>Loading...</div>;

  console.log('songs', songs);

  const totalPlaytime = songs.reduce((acc: number, song: any) => {
    return acc + song.track.duration_ms / (60 * 1000);
  }, 0);

  return (
    <div className='p-4'>
      <h1 className='text-2xl font-bold'>Playground Session Details</h1>
      <div className='mt-4 space-y-2'>
        <p>
          <strong>Email:</strong> {session!.user.email}
        </p>
        <p>
          <strong>Name:</strong>{' '}
          {session!.user.user_metadata?.full_name || 'N/A'}
        </p>
        {error && (
          <p className='text-red-500'>
            <strong>Error:</strong> {error}
          </p>
        )}
        {songs && songs.length > 0 && (
          <div>
            <h2 className='text-xl font-semibold mt-4'>
              Recently Played Songs
            </h2>
            {songs.map((song: any) => (
              <p key={song.played_at}>{song.track.name}</p>
            ))}
          </div>
        )}

        <div>lenght: {totalPlaytime}</div>

        <Card>
          <CardHeader>
            <CardTitle>Area Chart</CardTitle>
            <CardDescription>
              Showing total visitors for the last 6 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <AreaChart
                accessibilityLayer
                data={chartData}
                margin={{
                  left: 12,
                  right: 12,
                }}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey='month'
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator='line' />}
                />
                <Area
                  dataKey='desktop'
                  type='natural'
                  fill='var(--color-desktop)'
                  fillOpacity={0.4}
                  stroke='var(--color-desktop)'
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
          <CardFooter>
            <div className='flex w-full items-start gap-2 text-sm'>
              <div className='grid gap-2'>
                <div className='flex items-center gap-2 font-medium leading-none'>
                  Trending up by 5.2% this month{' '}
                  <TrendingUp className='h-4 w-4' />
                </div>
                <div className='flex items-center gap-2 leading-none text-muted-foreground'>
                  January - June 2024
                </div>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Playground;
