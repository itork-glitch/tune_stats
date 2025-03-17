'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';

export default function PlaygroundPage() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [songs, setSongs] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch Supabase session on mount
  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
      } else {
        setSession(session);
        setLoading(false);
      }
    };

    fetchSession();
  }, [router]);

  // Fetch Spotify recently played songs when session is available
  useEffect(() => {
    if (!session) return;

    const fetchSongs = async () => {
      // Retrieve a valid Spotify access token
      const spotifyAccessToken = localStorage.getItem(
        'sb-saobywbkuqinwaenpzvl-auth-token'
      );
      if (!spotifyAccessToken) {
        setError(
          'Spotify access token not found. Please authenticate with Spotify.'
        );
        return;
      }
      try {
        const response = await fetch(
          'https://api.spotify.com/v1/me/player/recently-played',
          {
            headers: {
              Authorization: `Bearer ${spotifyAccessToken}`,
            },
          }
        );
        if (!response.ok) {
          const errorData = await response.json();
          setError(errorData.message || 'Failed to fetch songs');
          return;
        }
        const songData = await response.json();
        setSongs(songData.items);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchSongs();
  }, [session]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const { email, user_metadata } = session!.user;

  return (
    <div className='p-4'>
      <h1 className='text-2xl font-bold'>Playground Session Details</h1>
      <div className='mt-4 space-y-2'>
        <p>
          <strong>Email:</strong> {email}
        </p>
        <p>
          <strong>Name:</strong> {user_metadata?.full_name || 'N/A'}
        </p>
        {error && (
          <p className='text-red-500'>
            <strong>Error:</strong> {error}
          </p>
        )}
        <div>
          <h2 className='text-xl font-semibold mt-4'>Recently Played Songs</h2>
          {songs.length > 0 ? (
            songs.map((song: any) => (
              <p key={song.played_at}>{song.track.name}</p>
            ))
          ) : (
            <p>No songs found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
