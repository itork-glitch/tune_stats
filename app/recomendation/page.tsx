'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import Image from 'next/image';
import { Session } from '@supabase/supabase-js';
import {
  PlaylistTrackItem,
  SpotifyTrack,
  TracksArray,
} from '@/types/recomendations';

export default function Page() {
  const [token, setToken] = useState<string | null>(null);
  const [userID, setUserID] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [selectedPlaylists, setSelectedPlaylists] = useState<string[]>([]);
  const [topSongs, setTopSongs] = useState<any[]>([]);
  const [Session, setSession] = useState<Session | null>(null);
  const [tracks, setTracks] = useState<TracksArray[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchToken = async () => {
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();

      if (sessionError || !sessionData.session) {
        router.replace('/login');
        return;
      }

      const { data: authListener } = supabase.auth.onAuthStateChange(
        (_event, session) => setSession(session)
      );

      const tokenString = localStorage.getItem(
        'sb-saobywbkuqinwaenpzvl-auth-token'
      );
      if (!tokenString) {
        setError('Token not found in local storage');
        setLoading(false);
        return;
      }
      const parsedToken = JSON.parse(tokenString);
      setToken(parsedToken.provider_token);
      setUserID(parsedToken.user.user_metadata.provider_id);
    };
    fetchToken();
  }, [router]);

  // Pobranie playlist ze Spotify
  useEffect(() => {
    if (!token || !userID) return;

    const fetchPlaylists = async () => {
      try {
        const res = await fetch(
          `https://api.spotify.com/v1/users/${userID}/playlists`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) throw new Error('Spotify API error');
        const data = await res.json();
        setPlaylists(data.items || []);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchTopSongs = async () => {
      try {
        const res = await fetch(
          'https://api.spotify.com/v1/me/top/tracks?limit=20',
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) throw new Error('Spotify API error');
        const data = await res.json();
        setTopSongs(data.items || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchPlaylists();
    fetchTopSongs().then(() => setLoading(false));
  }, [token, userID]);

  function pickRandomTracks(tracks: SpotifyTrack[]): SpotifyTrack[] {
    const total = tracks.length;
    let numberToPick: number;

    if (total < 20) {
      numberToPick = total;
    } else if (total <= 50) {
      numberToPick = 15;
    } else {
      numberToPick = 20;
    }
   
    const shuffled = [...tracks];

    // Fisher–Yates shuffle
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled.slice(0, numberToPick);
  }

  const fetchTracks = async () => {
    let newTracks: TracksArray[] = [];

    const pushTracks = (songs: SpotifyTrack[]) => {
      songs.forEach((track) => {
        newTracks.push({
          id: track.id,
          name: track.name,
          album: {
            name: track.album.name,
            images: track.album.images,
          },
          artists: track.artists.map((artist) => artist.name),
          url: track.external_urls?.spotify,
          image: track.album.images[0]?.url || '',
        });
      });
    };

    pushTracks(topSongs);

    for (const playlist of selectedPlaylists) {
      try {
        const res = await fetch(
          `https://api.spotify.com/v1/playlists/${playlist}/tracks`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error('Spotify API error');

        const songs = await res.json();

        const allTracks: SpotifyTrack[] = songs.items
          .map((item: PlaylistTrackItem) => item.track)
          .filter(Boolean);

        const pickedTracks = pickRandomTracks(allTracks);

        pickedTracks.forEach((track: SpotifyTrack) => {
          newTracks.push({
            id: track.id,
            name: track.name,
            album: {
              name: track.album.name,
              images: track.album.images,
            },
            artists: track.artists.map((artist) => artist.name),
            url: track.external_urls?.spotify,
            image: track.album.images[0]?.url || '',
          });
        });
      } catch (error) {
        console.error(`Error fetching tracks for playlist ${playlist}:`, error);
      }
    }

    const uniqueTracks = newTracks.filter((track, index, self) => {
      return index === self.findIndex((t) => t.id === track.id);
    });

    setTracks(uniqueTracks);
  };

  // Kliknięcie w kafelek playlisty
  const handlePlaylistClick = (playlistId: string) => {
    setSelectedPlaylists((prev) =>
      prev.includes(playlistId)
        ? prev.filter((id) => id !== playlistId)
        : [...prev, playlistId]
    );
  };

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-neutral-900 text-white'>
        <p>Loading your playlists...</p>
      </div>
    );
  }

  return (
    <div className='bg-neutral-900 min-h-screen text-white flex flex-col items-center'>
      <header className='w-full flex items-center justify-between px-4 py-2 bg-neutral-900 border-b border-neutral-800'>
        <div className='text-xl font-bold'>TuneStats</div>
        <div className='text-sm opacity-75'>
          {Session?.user?.email || 'Logged in as Guest'}/
        </div>
      </header>

      {/* Główna sekcja */}
      <main className='flex-grow flex flex-col items-center justify-center px-4'>
        {/* Nagłówek w stylu ChatGPT */}
        <h1 className='text-2xl md:text-3xl font-semibold mb-4'>
          Choose your playlists
        </h1>
        <p className='text-sm text-neutral-400 mb-8'>
          Pick your favorites from the carousel below
        </p>

        {/* Karuzela (ScrollArea) */}
        <ScrollArea className='relative w-full max-w-3xl overflow-hidden rounded-lg border border-neutral-800'>
          <div className='flex space-x-4 p-4'>
            {playlists.map((playlist) => {
              const isSelected = selectedPlaylists.includes(playlist.id);

              return (
                <figure
                  key={playlist.id}
                  className={`
                    relative shrink-0 transition-transform cursor-pointer
                    hover:scale-105 active:scale-100
                    ${isSelected ? 'scale-105' : ''}
                  `}
                  onClick={() => handlePlaylistClick(playlist.id)}>
                  <div className='overflow-hidden rounded-md'>
                    <img
                      src={playlist.images[0]?.url || '/placeholder.png'}
                      alt={`Cover of ${playlist.name}`}
                      width={200}
                      height={200}
                      className='object-cover w-[200px] h-[200px] select-none'
                      draggable={false}
                      onDragStart={(e) => e.preventDefault()}
                    />
                  </div>
                  {/* Checkbox – czysto wizualny */}
                  <div className='absolute top-2 right-2'>
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => {}}
                      className='pointer-events-none'
                    />
                  </div>
                  <figcaption className='pt-2 text-xs text-center text-neutral-300'>
                    {playlist.name}
                  </figcaption>
                </figure>
              );
            })}
          </div>
          <ScrollBar orientation='horizontal' />
        </ScrollArea>

        {/* Lista wybranych playlist (opcjonalnie) */}
        {selectedPlaylists.length > 0 && (
          <div className='mt-8 text-center'>
            <h2 className='text-lg font-semibold mb-2'>Selected playlists:</h2>
            <ul className='space-y-1 text-sm text-neutral-200'>
              {selectedPlaylists.map((id) => (
                <li key={id}>{id}</li>
              ))}
            </ul>
          </div>
        )}
        <button onClick={() => fetchTracks()}>load this shit</button>
      </main>

      {/* Stopka na wzór ChatGPT */}
      <footer className='w-full py-4 flex items-center justify-center border-t border-neutral-800 bg-neutral-900'>
        <p className='text-xs text-neutral-500'>
          ChatGPT UI can make mistakes. Check important info.
        </p>
      </footer>
    </div>
  );
}
