interface songCardsInterface {
  title: string;
  artist: string;
  albumArt: string;
  duration: number;
  position: [number, number, boolean]; // [top, left/right offset, isLeft]
}

export const songsCards: songCardsInterface[] = [
  // Karty po lewej stronie
  {
    title: "A lot",
    artist: "21 Savage",
    albumArt: "/album_1.png",
    duration: 268,
    position: [10, 10, true], // 10% od góry, 10% od lewej
  },
  {
    albumArt: "/album_2.png",
    title: "Out West",
    artist: "Jackboys, Travis Scott",
    duration: 157,
    position: [30, 10, true], // 30% od góry, 10% od lewej
  },
  {
    albumArt: "/album_3.png",
    title: "GDP",
    artist: "Central Cee, 21 Savage",
    duration: 154,
    position: [50, 10, true], // 50% od góry, 10% od lewej
  },

  // Karty po prawej stronie
  {
    albumArt: "/album_4.png",
    title: "Mood",
    artist: "24kGoldn",
    duration: 200,
    position: [10, 10, false], // 10% od góry, 10% od prawej
  },
  {
    albumArt: "/album_5.png",
    title: "Blinding Lights",
    artist: "The Weeknd",
    duration: 250,
    position: [30, 10, false], // 30% od góry, 10% od prawej
  },
];
