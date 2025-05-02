import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

interface requestData {
  refreshToken: string;
  email: string;
  authID: string;
}

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const { refreshToken, email, authID } = (await req.json()) as requestData;

    if (!refreshToken || !email || !authID) {
      return NextResponse.json(
        { error: 'Missing refreshToken, email or auth_id' },
        { status: 400 }
      );
    }

    const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID!;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET!;

    const authHeader = Buffer.from(clientId + ':' + clientSecret).toString(
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
      } as Record<string, string>),
    });

    if (!tokenRes.ok) {
      const errorData = await tokenRes.json();
      console.error('Spotify token error:', errorData);

      return NextResponse.json(
        { error: 'Failed to refresh access token' },
        { status: tokenRes.status }
      );
    }

    if (!tokenRes.ok) {
      const err = await tokenRes.json();
      console.error('Spotify token refresh failed', err);
      return NextResponse.json(
        { error: 'Failed to refresh token at provider' },
        { status: 502 }
      );
    }

    const {
      access_token: newAccessToken,
      refresh_token: newRefreshToken = refreshToken,
      expires_in,
    } = (await tokenRes.json()) as {
      access_token: string;
      refresh_token?: string;
      expires_in: number;
    };

    const { error: dbError } = await supabase.from('users').upsert(
      {
        email,
        auth_id: authID,
        refresh_token: newRefreshToken,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: 'email', // primary/unique key
      }
    );

    if (dbError) {
      console.error('Supabase upser error', dbError);
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    return NextResponse.json(
      { access_token: newAccessToken, expires_in },
      { status: 200 }
    );
  } catch (err) {
    console.error('Unexpected error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
