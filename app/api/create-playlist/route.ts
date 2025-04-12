import { type NextRequest, NextResponse } from 'next/server';
import {
  getSpotifyProfile,
  createPlaylist,
  addTracksToPlaylist,
  getLikedSongs
} from '@/lib/spotify';
import { cookies } from 'next/headers';

export async function POST(_req: NextRequest) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('spotify_token')?.value;
  if (!accessToken) {
    return NextResponse.json(
      { error: 'No accessToken found, please try to login again.' },
      { status: 401 }
    );
  }

  const userRes = await getSpotifyProfile(accessToken);
  if (!userRes.ok) {
    return NextResponse.json({ error: 'Failed to get user profile' }, { status: 500 });
  }

  const user = await userRes.json();
  if (!user.id) {
    return NextResponse.json({ error: 'No user ID found' }, { status: 500 });
  }

  // Get the total number of liked songs
  const initialLikedRes = await getLikedSongs(accessToken, 1, 0);
  if (!initialLikedRes.ok) {
    return NextResponse.json({ error: 'Failed to get total of liked songs.' }, { status: 500 });
  }

  const initialLikedData = await initialLikedRes.json();
  if (!initialLikedData.total) {
    return NextResponse.json(
      { error: 'No liked songs found. Please like some songs and try again.' },
      { status: 400 }
    );
  }

  const limit = 50;
  const likedSongs: string[] = [];
  const total = initialLikedData.total;

  let fetched = 0;
  while (fetched < total) {
    console.info('Fetching liked songs', fetched, 'of', total);
    const likedRes = await getLikedSongs(accessToken, limit, fetched);
    if (!likedRes.ok) {
      return NextResponse.json({ error: 'Failed to get liked songs' }, { status: 500 });
    }
    const likedData = await likedRes.json();
    likedSongs.push(...likedData.items.map((item: any) => item.track.uri));
    fetched += likedData.items.length;
  }

  const playlistRes = await createPlaylist(user.id, accessToken);
  if (!playlistRes.ok) {
    return NextResponse.json({ error: 'Failed to create playlist' }, { status: 500 });
  }
  const playlist = await playlistRes.json();
  const result = await addTracksToPlaylist(playlist.id, likedSongs, accessToken);
  if (!result.ok) {
    console.error(
      'Failed to add tracks to playlist',
      result.text(),
      result.status,
      result.statusText
    );
    return NextResponse.json({ error: 'Failed to add tracks to playlist' }, { status: 500 });
  }

  return NextResponse.json({
    playlistUrl: playlist.external_urls.spotify,
    added: result
  });
}
