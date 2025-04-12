import { type NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const accessToken = req.headers.get('authorization')?.split(' ')[1];

  const res = await fetch('https://api.spotify.com/v1/me/tracks?limit=50', {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  const data = await res.json();
  return NextResponse.json(data);
}
