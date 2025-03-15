import { NextRequest, NextResponse } from 'next/server';

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID!;
const REDIRECT_URI = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI!;
const SCOPES = 'user-read-email user-top-read user-library-read';

export async function GET() {
  const state = crypto.randomUUID(); // Unikalny state

  // Ustawienie ciasteczka
  const response = NextResponse.redirect(
    `https://accounts.spotify.com/authorize?${new URLSearchParams({
      client_id: CLIENT_ID,
      response_type: 'code',
      redirect_uri: REDIRECT_URI,
      scope: SCOPES,
      state: state,
      show_dialog: 'true',
    })}`
  );

  response.cookies.set('spotify_auth_state', state, {
    httpOnly: false, // Sprawdź, czy zadziała bez httpOnly
    maxAge: 60 * 5,
    path: '/',
    sameSite: 'lax', // Może pomóc z problemami z przekazywaniem cookies
  });

  return response;
}
