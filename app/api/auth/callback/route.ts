import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');

  const storedState = req.cookies.get('spotify_auth_state')?.value;

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

  // Jeśli state się zgadza, kontynuuj logowanie
  return NextResponse.json({
    message: 'State poprawny, kontynuuję logowanie...',
  });
}
