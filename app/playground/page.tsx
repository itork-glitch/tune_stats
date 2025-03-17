import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function PlaygroundPage() {
  // Await cookies() so we get an object with .get and .getAll.
  const supaCookies = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookieOptions: {
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      },
      cookies: supaCookies,
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  const { email, user_metadata } = session.user;

  return (
    <div className='p-4'>
      <h1 className='text-2xl font-bold'>Playground Session Details</h1>
      <div className='mt-4 space-y-2'>
        <p>
          <strong>Email:</strong> {email}
        </p>
        <p>
          <strong>Name:</strong>
        </p>
        <p>
          <strong>Full Name:</strong> {user_metadata?.full_name || 'N/A'}
        </p>
      </div>
    </div>
  );
}
