interface songCardsInterface {
  title: string;
  artist: string;
  albumArt: string;
  duration: number;
  position: [number, number, boolean]; // [top, left/right offset, isLeft]
}

export const songsCards: songCardsInterface[] = [
  // 3 karty po lewej stronie
  {
    title: 'A lot',
    artist: '21 Savage',
    albumArt: '/album_1.png',
    duration: 268,
    position: [0, -15, true], // Top: 10% od góry, Left: 10%
  },
  {
    albumArt: '/album_2.png',
    title: 'Out West',
    artist: 'Jackboys, Travis Scott',
    duration: 157,
    position: [50, 5, true], // Top: 30%, Left: 20%
  },
  {
    albumArt: '/album_3.png',
    title: 'GDP',
    artist: 'Central Cee, 21 Savage',
    duration: 154,
    position: [-5, 25, true], // Top: 50%, Left: 30%
  },

  // 2 karty po prawej stronie
  {
    albumArt: '/album_4.png',
    title: 'Mood',
    artist: '24kGoldn',
    duration: 200,
    position: [1, -15, false], // Top: 10%, Right: 10%
  },
  {
    albumArt: '/album_5.png',
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    duration: 250,
    position: [43, 10, false], // Top: 30%, Right: 20%
  },
];
