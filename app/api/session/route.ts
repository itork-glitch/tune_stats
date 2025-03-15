import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(req: NextRequest) {
  const accessToken = req.cookies.get('sb-access-token')?.value;

  if (!accessToken) {
    return NextResponse.json({ session: null }, { status: 401 });
  }

  return NextResponse.json({ session: { accessToken } });
}
