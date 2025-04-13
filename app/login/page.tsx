'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { FaSpotify, FaApple } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function LoginPage() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [showPasswordInput, setShowPasswordInput] = useState<boolean>(false);
  const router = useRouter();

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSpotifyLogin = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'spotify',
      options: {
        scopes:
          'user-top-read user-read-recently-played playlist-read-private playlist-read-collaborative',
      },
    });

    if (error) {
      console.error('Błąd logowania przez Spotify:', error);
    }
  };

  const handleGoogleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    if (error) {
      console.error('Błąd logowania przez Google:', error);
    }
  };

  const handleAppleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'apple',
    });
    if (error) {
      console.error('Błąd logowania przez Apple:', error);
    }
  };

  const handleEmailLogin = async () => {
    setEmailError(null);

    if (!email || !isValidEmail(email)) {
      setEmailError('Podaj poprawny adres email.');
      return;
    }

    try {
      const res = await fetch('/api/check-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const result = await res.json();

      if (!res.ok) {
        console.error('Błąd podczas sprawdzania użytkownika:', result.error);
        setEmailError('Wystąpił błąd podczas sprawdzania użytkownika.');
        return;
      }

      if (result.provider !== 'email') {
        switch (result.provider) {
          case 'spotify':
            handleSpotifyLogin();
            break;
          case 'google':
            handleGoogleLogin();
            break;
          case 'apple':
            handleAppleLogin();
            break;
          default:
            break;
        }
      }

      if (!result.exists) {
        // Użytkownik nie istnieje, przekierowujemy do rejestracji.
        router.push('/signup');
        return;
      }

      // Użytkownik istnieje – wyświetlamy pole na hasło.
      setShowPasswordInput(true);
    } catch (err) {
      console.error('Nieoczekiwany błąd:', err);
      setEmailError('Wystąpił nieoczekiwany błąd.');
    }
  };

  const handlePasswordLogin = async () => {
    setPasswordError(null);

    if (!password) {
      setPasswordError('Podaj hasło.');
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Błąd logowania:', error.message);
        setPasswordError('Błędne hasło lub problem z logowaniem.');
        return;
      }

      console.log('Zalogowano użytkownika:', data);
      router.push('/dashboard');
    } catch (err) {
      console.error('Nieoczekiwany błąd:', err);
      setPasswordError('Wystąpił nieoczekiwany błąd.');
    }
  };

  return (
    <div className='h-screen flex flex-col'>
      <nav className='py-2 px-4'>
        <h1 className='text-3xl text-white font-sans flex items-center gap-2'>
          <Image src='/tune_stats_logo.png' alt='' height={40} width={40} />
          <span className='font-bold'>TuneStats</span>
        </h1>
      </nav>

      <section className='flex-grow flex flex-col items-center justify-center'>
        <div className='w-[30vw] flex flex-col justify-center items-center gap-4'>
          <span className='font-semibold text-3xl pb-2'>Welcome back</span>

          {(emailError || passwordError) && (
            <div className='w-[60%] text-sm text-red-500 text-left -mb-2 pl-4'>
              Invalid email or password.
            </div>
          )}
          <Input
            type='email'
            placeholder='Email'
            className={`rounded-full w-[60%] ${emailError ? 'border border-red-500' : ''}`}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (emailError) setEmailError(null);
            }}
          />
          {showPasswordInput && (
            <>
              <Input
                type='password'
                placeholder='Password'
                className={`rounded-full w-[60%] ${passwordError ? 'border border-red-500' : ''}`}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (passwordError) setPasswordError(null);
                }}
              />
            </>
          )}
          {showPasswordInput ? (
            <Button
              className='rounded-full w-[60%]'
              onClick={handlePasswordLogin}>
              Log in
            </Button>
          ) : (
            <Button className='rounded-full w-[60%]' onClick={handleEmailLogin}>
              Continue
            </Button>
          )}

          <div>
            Don't have an account?{' '}
            <Link href={'/signup'} className='text-sky-500 hover:underline'>
              Sign up
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
              onClick={handleGoogleLogin}>
              <FcGoogle className='text-2xl' />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className='bg-black text-white py-2 px-6 rounded-lg font-semibold transition-colors flex gap-2 justify-center row-start-2'
              onClick={handleAppleLogin}>
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
              href={'/docs/privicy'}
              className='text-sm underline hover:text-white'>
              Privacy Policy
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
