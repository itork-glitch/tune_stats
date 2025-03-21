import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function Callback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuth = async () => {
      // Pobieramy kod autoryzacyjny z query string (przy użyciu Authorization Code Flow)
      const code = new URL(window.location.href).searchParams.get('code');
      if (!code) {
        router.replace('/login');
        return;
      }

      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) {
        console.error('Błąd wymiany kodu na sesję:', error);
        router.replace('/login');
        return;
      }

      // Zapisujemy tokeny Spotify w tabeli użytkowników
      const { error: dbError } = await supabase.from('users').upsert({
        id: data.session?.user.id,
        spotify_access_token: data.session?.provider_token,
        spotify_refresh_token: data.session?.provider_refresh_token,
      });
      if (dbError) {
        console.error('Błąd zapisu w bazie:', dbError);
      }

      router.replace('/dashboard');
    };

    handleAuth();
  }, [router]);

  return <div>Loading...</div>;
}
