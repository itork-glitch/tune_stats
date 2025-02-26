import { motion } from 'framer-motion';
export default function MiniSpotifyCard({
  albumArt,
  title,
  artist,
}: {
  albumArt: string;
  title: string;
  artist: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className='bg-gradient-to-br from-purple-500 to-blue-500 bg-opacity-10 backdrop-blur-md rounded-lg p-4 flex items-center space-x-4 shadow-lg'>
      <img
        src={albumArt}
        alt={`${title} album cover`}
        className='w-16 h-16 object-cover rounded-md'
      />
      <div className='flex-1 text-white'>
        <h3 className='font-semibold'>{title}</h3>
        <p className='text-sm text-gray-300'>{artist}</p>
      </div>
      {/* Optional: playback controls, e.g. a play/pause button */}
      <button className='text-white hover:text-green-400 transition-colors'>
        ▶
      </button>
    </motion.div>
  );
}
