'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';

const Playground = () => {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [songs, setSongs] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

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
          'https://api.spotify.com/v1/me/player/recently-played',
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
      </div>
    </div>
  );
};

export default Playground;
