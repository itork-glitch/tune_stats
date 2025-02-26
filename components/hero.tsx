import MiniSpotifyCard from './miniSpotifyCard';

export default function Hero() {
  return (
    <section className='relative flex flex-col items-center justify-center min-h-screen px-4 bg-black'>
      {/* Hero Text */}
      <div className='text-center mb-10'>
        <h1 className='text-4xl md:text-6xl font-bold text-white mb-4'>
          Your AI-Driven Spotify Companion
        </h1>
        <p className='text-lg md:text-xl text-gray-300 max-w-xl mx-auto'>
          Get personalized song suggestions and real-time streaming stats.
        </p>
        <div className='mt-6'>
          <button className='bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-full font-semibold transition-colors'>
            Connect with Spotify
          </button>
        </div>
      </div>

      {/* Mini Spotify Players */}
      <div className='relative grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-5xl'>
        <MiniSpotifyCard
          albumArt='/path/to/album-art1.jpg'
          title='Song Title 1'
          artist='Artist Name'
        />
        <MiniSpotifyCard
          albumArt='/path/to/album-art2.jpg'
          title='Song Title 2'
          artist='Artist Name'
        />
        <MiniSpotifyCard
          albumArt='/path/to/album-art3.jpg'
          title='Song Title 3'
          artist='Artist Name'
        />
        {/* Add more cards as needed */}
      </div>
    </section>
  );
}
