import { cookies } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';
import { getSpotifyAuthToken } from '@/lib/spotify';

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');
  if (!code) {
    return NextResponse.redirect(`${req.nextUrl.origin}/`);
  }

  const res = await getSpotifyAuthToken(code);
  if (!res.ok) {
    return NextResponse.json({ error: 'Failed to get authentication token' }, { status: 500 });
  }
  const tokenData = await res.json();

  const cookieStore = await cookies();
  cookieStore.set('spotify_token', tokenData.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 3600,
    sameSite: 'lax'
  });

  return NextResponse.redirect(`${req.nextUrl.origin}/dashboard`);
}
