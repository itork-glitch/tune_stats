// types/spotify.d.ts
export interface Artist {
  id: string;
  name: string;
  genres: string[];
  images: { url: string }[];
  // …any other fields you use
}

export interface Track {
  id: string;
  name: string;
  album: { images: { url: string }[] };
  // …etc.
}
