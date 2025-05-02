// types/spotify.ts

export interface Artist {
  id: string;
  name: string;
  genres: string[];
  images: { url: string }[];
  external_urls?: { spotify: string };
  // add any other fields you need
}

export interface SpotifyTrack {
  id: string;
  name: string;
  album: {
    name: string;
    images: { url: string }[];
  };
  artists: { name: string }[];
  external_urls: {
    spotify: string;
  };
}

export interface TracksArray {
  id: string | null;
  name: string | null;
  album: {
    name: string | null;
    images: { url: string }[] | null;
  };
  artists: string[];
  url: string | null;
  image: string;
}

export interface PlaylistTrackItem {
  added_at: string;
  added_by: {
    external_urls: {
      spotify: string;
    };
    href: string;
    id: string;
    type: string;
    uri: string;
  };
  is_local: boolean;
  track: SpotifyTrack | null;
}

// For our `useTopItems` hook, we’ll alias Spotify’s `Track` to match:
export type Track = SpotifyTrack;
