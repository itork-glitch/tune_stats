interface SpotifyTrack {
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

interface TracksArray {
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

interface PlaylistTrackItem {
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

export type { SpotifyTrack, TracksArray, PlaylistTrackItem };
