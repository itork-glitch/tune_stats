'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
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
    color: '#1bb300',
  },
} satisfies ChartConfig;

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

      try {
        const response = await fetch(
          'https://api.spotify.com/v1/me/player/recently-played?limit=50',
          {
            headers: {
              Authorization: `Bearer ${token.provider_token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error(
            `Spotify API error: ${response.status + response.statusText}`
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
          <li key={idx}>{song.track.name}</li>
        ))}
      </ul>
      <Card>
        <CardHeader>
          <CardTitle>Listening time</CardTitle>
          <CardDescription>Showing your total streamed time</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={chartConfig}
            className='max-h-[20vh] min-h-[20vh] '>
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
  );
}
