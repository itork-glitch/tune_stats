// app/login/page.tsx
'use client';

import { useState } from 'react';
import { signInWithSpotify } from '@/utils/auth';

export default function LoginPage() {
  const [error, setError] = useState<string>('');

  const handleSignIn = async () => {
    try {
      await signInWithSpotify();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className='min-h-screen flex flex-col items-center justify-center'>
      <h1 className='text-3xl mb-4'>Login</h1>
      <button
        onClick={handleSignIn}
        className='px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600'>
        Sign in with Spotify
      </button>
      {error && <p className='mt-4 text-red-500'>{error}</p>}
    </div>
  );
}
