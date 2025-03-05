import { MiniSpotifyCard } from "./miniSpotifyCard";
import Image from "next/image";
import { songsCards } from "../constants/hero";

export default function Hero() {
  return (
    <section className="bg-black relative flex flex-col items-center justify-center min-h-screen px-4">
      {/* Tekst powyżej telefonu */}
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
          Your AI-Driven Spotify Companion
        </h1>
        <p className="text-lg md:text-xl text-gray-300 max-w-xl mx-auto">
          Get personalized song suggestions and real-time streaming stats.
        </p>
        <div className="mt-6">
          <button className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-full font-semibold transition-colors">
            Connect with Spotify
          </button>
        </div>
      </div>

      {/* Kontener z telefonem i kartami */}
      <div className="relative w-full max-w-5xl h-[600px]">
        {/* Telefon wyśrodkowany absolutnie */}
        <Image
          src="/phone.png"
          alt="Phone"
          width={250}
          height={500}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          priority
        />

        {songsCards.map((card, index) => (
          <div
            key={index}
            className="absolute"
            style={{
              top: `${card.position[0]}%`,
              [card.position[2] ? "left" : "right"]: `${card.position[1]}%`,
            }}
          >
            <MiniSpotifyCard
              albumArt={card.albumArt}
              title={card.title}
              artist={card.artist}
              duration={card.duration}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
