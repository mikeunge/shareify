import { type NextRequest, NextResponse } from 'next/server';
import { getSpotifyProfile, createPlaylist } from '@/lib/spotify';
import { cookies } from 'next/headers';
import { z } from 'zod';

const PlaylistSchema = z.object({
  playlistTitle: z.string().default('Liked Songs Playlist'),
  isPublic: z.boolean().default(true)
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { playlistTitle, isPublic } = body;
  const parseResult = PlaylistSchema.safeParse({ playlistTitle, isPublic });
  if (!parseResult.success) {
    console.error('Validation error:', parseResult.error.errors);
    return NextResponse.json(
      { error: 'Invalid input', details: parseResult.error.errors },
      { status: 400 }
    );
  }

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

  const playlistRes = await createPlaylist(user.id, accessToken, playlistTitle, isPublic);
  if (!playlistRes.ok) {
    return NextResponse.json({ error: 'Failed to create playlist' }, { status: 500 });
  }
  const playlist = await playlistRes.json();

  return NextResponse.json(
    {
      playlistUrl: playlist.external_urls.spotify,
      playlistId: playlist.id
    },
    { status: 200 }
  );
}
