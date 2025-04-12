import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getLikedSongs } from '@/lib/spotify';

export async function GET() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('spotify_token')?.value;
  if (!accessToken) {
    return NextResponse.json(
      { error: 'No accessToken found, please try to login again.' },
      { status: 401 }
    );
  }

  const result = await getLikedSongs(accessToken, 1, 0);
  if (!result.ok) {
    return NextResponse.json({ error: 'Failed to get total of liked songs.' }, { status: 500 });
  }
  const resultData = await result.json();
  if (!resultData.total) {
    return NextResponse.json(
      { error: 'No liked songs found. Please like some songs and try again.' },
      { status: 400 }
    );
  }
  return NextResponse.json({ total: resultData.total }, { status: 200 });
}
