import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

interface RequestData {
  refreshToken: string;
  email: string;
  authID: string;
}

export async function POST(request: Request) {
  const { refreshToken, email, authID } = (await request.json()) as RequestData;

  if (!refreshToken || !email || !authID) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

  const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID!;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET!;
  const authHeader = Buffer.from(`${clientId}:${clientSecret}`).toString(
    'base64'
  );

  const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${authHeader}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  });

  if (!tokenRes.ok) {
    const errorData = await tokenRes.json();
    console.error('Spotify token error:', errorData);
    return NextResponse.json(
      { error: 'Failed to refresh token' },
      { status: tokenRes.status }
    );
  }

  const {
    access_token,
    refresh_token: newRefresh = refreshToken,
    expires_in,
  } = (await tokenRes.json()) as {
    access_token: string;
    refresh_token?: string;
    expires_in: number;
  };

  const { error: dbErr } = await supabase.from('users').upsert(
    {
      email,
      auth_id: authID,
      refresh_token: newRefresh,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'email' }
  );

  if (dbErr) {
    console.error('DB upsert error:', dbErr);
    return NextResponse.json({ error: 'DB upsert failed' }, { status: 500 });
  }

  return NextResponse.json({ access_token, expires_in });
}
