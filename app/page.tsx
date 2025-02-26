import Hero from '@/components/hero';
import { hasEnvVars } from '@/utils/supabase/check-env-vars';
import { Navbar } from '@/components/navbar';

export default async function Home() {
  return (
    <>
      <Navbar />
      <Hero />
    </>
  );
}
