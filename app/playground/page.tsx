/* import React from 'react';
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
 */

// pages/protected.tsx
import type { GetServerSidePropsContext, NextPage } from 'next';
import { createServerClient } from '@supabase/ssr';

interface ProtectedPageProps {
  session: any;
}

const ProtectedPage: NextPage<ProtectedPageProps> = ({ session }) => {
  return (
    <div>
      <h1>Protected Content</h1>
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </div>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  // Create a Supabase client that reads session info from cookies
  const supabase = createServerClient(ctx.req, ctx.res);
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Redirect to login if there's no session
  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  return { props: { session } };
};

export default ProtectedPage;
