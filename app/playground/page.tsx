import React from 'react';
import { createClient } from '@/utils/supabase/server';

export default async function Playground() {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <div>
      <p>Zalogowany użytkownik: {session?.user.user_metadata.email}</p>
    </div>
  );
}
