import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

// callback/page.tsx
export default function Callback() {
  const router = useRouter();
  useEffect(() => {
    const handleAuth = async () => {
      const { data, error } = await supabase.auth.getSessionFromUrl();

      if (error) {
        router.push('/login');
        return;
      }

      // Zapisz dodatkowe dane Spotify w tabeli users
      const { error: dbError } = await supabase.from('users').upsert({
        id: data.session?.user.id,
        spotify_access_token: data.session?.provider_token,
        spotify_refresh_token: data.session?.provider_refresh_token,
      });

      router.push('/dashboard');
    };

    handleAuth();
  }, []);

  return <div>Loading...</div>;
}
