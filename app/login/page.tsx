'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Quicksand } from 'next/font/google';
import Link from 'next/link';
import { FaSpotify, FaApple } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { motion } from 'framer-motion';
import Image from 'next/image';

const quicksand = Quicksand({
  weight: '700',
  subsets: ['latin'],
  display: 'swap',
});

export default function LoginPage() {
  const router = useRouter();

  const handleSpotifyLogin = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'spotify',
      options: {
        scopes: 'user-top-read',
        redirectTo: `${location.origin}/callback`,
      },
    });
    if (error) {
      console.error('Błąd logowania przez Spotify:', error);
      // Możesz wyświetlić komunikat użytkownikowi
    }
  };

  return (
    <div className='h-screen flex flex-col'>
      <nav className='py-2 px-4'>
        <h1 className='text-3xl text-white font-sans flex items-center gap-2'>
          <Image src='/tune_stats_logo.png' alt='' height={40} width={40} />
          <span className='font-bold'>TuneStats</span>{' '}
        </h1>
      </nav>

      <section className='flex-grow flex flex-col items-center justify-center'>
        <div className='w-[30vw] flex flex-col justify-center items-center gap-4'>
          <span className='font-semibold text-3xl pb-2'>Welcome back</span>
          <Input
            type='email'
            placeholder='Email'
            className=' rounded-full w-[60%]'
          />
          <Button className=' rounded-full w-[60%]'>Continue</Button>
          <div>
            Don't have an account?{' '}
            <Link
              href={'/create-account'}
              className='text-sky-500 hover:underline'>
              Sign Up
            </Link>
          </div>
          <Separator className='w-[60%] text-gray-400' />
          <div className='grid grid-cols-2 grid-rows-2 gap-4 w-[60%]'>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className='bg-green-500 hover:bg-green-600 text-black py-2 px-6 rounded-lg font-semibold transition-colors flex gap-2 justify-center col-span-2'
              onClick={handleSpotifyLogin}>
              <FaSpotify className='text-2xl' /> Connect with Spotify
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className='bg-white hover:bg-gray-300 text-black py-2 px-6 rounded-lg font-semibold transition-colors flex gap-2 justify-center row-start-2'
              /* onClick={} */
            >
              <FcGoogle className='text-2xl' />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className='bg-black text-white py-2 px-6 rounded-lg font-semibold transition-colors flex gap-2 justify-center row-start-2'
              /* onClick={} */
            >
              <FaApple className='text-2xl' />
            </motion.button>
          </div>
          <Separator className='w-[60%]' />
          <div className='flex gap-2 justify-center items-center text-gray-200'>
            <Link
              href={'/docs/tos'}
              className='text-sm underline hover:text-white'>
              Terms of Service
            </Link>
            <Separator orientation='vertical' />
            <Link
              href={'docs/privicy'}
              className='text-sm underline hover:text-white'>
              Privacy Policy
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
