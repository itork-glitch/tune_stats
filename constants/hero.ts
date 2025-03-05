interface songCardsInterface {
  title: string;
  artist: string;
  albumArt: string;
  duration: number;
  position: [number, number, boolean];
}

export const songsCards: songCardsInterface[] = [
  {
    title: "A lot",
    artist: "21 Savage",
    albumArt: "/album_1.png",
    duration: 268,
    position: [10, 10, false],
  },
  {
    albumArt: "/album_2.png",
    title: "Out West",
    artist: "Jackboys, Travis Scott",
    duration: 157,
    position: [40, 10, true],
  },
  {
    albumArt: "/album_3.png",
    title: "GDP",
    artist: "Central Cee, 21 Savage",
    duration: 154,
    position: [10, 25, false],
  },
];
