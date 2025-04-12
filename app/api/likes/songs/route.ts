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

  // TODO: think about if we should get this from the client or fetch again here
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

  const limit = 50;
  const likedSongs: string[] = [];
  const total = resultData.total;

  let fetched = 0;
  while (fetched < total) {
    console.info('Fetching liked songs', fetched, 'of', total);
    const likedRes = await getLikedSongs(accessToken, limit, fetched);
    if (!likedRes.ok) {
      return NextResponse.json({ error: 'Failed to get liked songs' }, { status: 500 });
    }
    const likedData = await likedRes.json();
    // biome-ignore lint: need to add types
    likedSongs.push(...likedData.items.map((item: any) => item.track.uri));
    fetched += likedData.items.length;
  }

  return NextResponse.json({ total, songs: likedSongs }, { status: 200 });
}
