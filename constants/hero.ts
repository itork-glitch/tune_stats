interface songCardsInterface {
  title: string;
  artist: string;
  albumArt: string;
  duration: number;
  position: [number, number, boolean]; // [top, left/right offset, isLeft]
}

export const songsCards: songCardsInterface[] = [
  {
    title: "A lot",
    artist: "21 Savage",
    albumArt: "/album_1.png",
    duration: 268,
    position: [5, 25, true], // Top: 5% od góry, Left: 25%
  },
  {
    albumArt: "/album_2.png",
    title: "Out West",
    artist: "Jackboys, Travis Scott",
    duration: 157,
    position: [25, 35, true], // Top: 25%, Left: 35%
  },
  {
    albumArt: "/album_3.png",
    title: "GDP",
    artist: "Central Cee, 21 Savage",
    duration: 154,
    position: [50, 50, true], // Top: 50%, Left: 50%
  },
  {
    albumArt: "/album_4.png",
    title: "Mood",
    artist: "24kGoldn",
    duration: 200,
    position: [20, 75, false], // Top: 20%, Right: 75%
  },
  {
    albumArt: "/album_5.png",
    title: "Blinding Lights",
    artist: "The Weeknd",
    duration: 250,
    position: [40, 80, false], // Top: 40%, Right: 80%
  },
];
