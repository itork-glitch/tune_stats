import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');

  const storedState = (await cookies()).get('spotify_auth_state')?.value;

  console.log('State z URL:', state);
  console.log('State z cookies:', storedState);

  if (!state || state !== storedState) {
    return NextResponse.json(
      {
        error: 'Błędny state lub brak state',
        received: state,
        expected: storedState,
      },
      { status: 400 }
    );
  }

  // 🔥 Wymiana kodu na token dostępu
  const client_id = process.env.SPOTIFY_CLIENT_ID;
  const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
  const redirect_uri = process.env.SPOTIFY_REDIRECT_URI; // np. https://www.tunestats.eu/api/auth/callback

  const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${client_id}:${client_secret}`).toString('base64')}`,
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code: code as string,
      redirect_uri: redirect_uri as string,
    }),
  });

  const tokenData = await tokenResponse.json();

  if (!tokenResponse.ok) {
    console.error('Błąd przy wymianie kodu na token:', tokenData);
    return NextResponse.json(
      { error: 'Nie udało się uzyskać tokena' },
      { status: 500 }
    );
  }

  console.log('Tokeny:', tokenData);

  // 🔥 Tworzenie sesji - zapisujemy token w ciasteczku
  const cookieStore = await cookies();
  cookieStore.set('spotify_access_token', tokenData.access_token, {
    httpOnly: true,
    secure: true,
    maxAge: tokenData.expires_in, // Czas życia tokena
    path: '/',
    sameSite: 'lax',
  });

  cookieStore.set('spotify_refresh_token', tokenData.refresh_token, {
    httpOnly: true,
    secure: true,
    maxAge: 60 * 60 * 24 * 30, // Miesiąc
    path: '/',
    sameSite: 'lax',
  });

  return NextResponse.redirect('/');
}
