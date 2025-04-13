import { type NextRequest, NextResponse } from 'next/server';
import { getPlaylistCover } from '@/lib/spotify';
import { cookies } from 'next/headers';
import { z } from 'zod';

const searchParamSchema = z.object({
  playlistId: z.string().min(1, 'Playlist ID is required')
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const playlistId = searchParams.get('id');
  const parseResult = searchParamSchema.safeParse({ playlistId });
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

  const playlistRes = await getPlaylistCover(accessToken, parseResult.data.playlistId);
  if (!playlistRes.ok) {
    return NextResponse.json({ error: 'Failed to fetch playlist cover' }, { status: 500 });
  }
  const playlist = await playlistRes.json();
  if (!playlist[0]?.url) {
    return NextResponse.json({ error: 'No playlist cover found' }, { status: 500 });
  }
  return NextResponse.json({ url: playlist[0].url }, { status: 200 });
}
