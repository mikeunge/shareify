import { type NextRequest, NextResponse } from 'next/server';
import { addTracksToPlaylist } from '@/lib/spotify';
import { cookies } from 'next/headers';
import { z } from 'zod';

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('spotify_token')?.value;
  if (!accessToken) {
    return NextResponse.json(
      { error: 'No accessToken found, please try to login again.' },
      { status: 401 }
    );
  }

  const bodySchema = z.object({
    playlistId: z.string(),
    likedSongs: z.array(z.string())
  });

  const body = await req.json();
  const parseResult = bodySchema.safeParse(body);

  if (!parseResult.success) {
    return NextResponse.json(
      { error: 'Invalid likedSongs format. It must be an array of strings.' },
      { status: 400 }
    );
  }

  const { likedSongs, playlistId } = parseResult.data;
  if (likedSongs.length === 0) {
    return NextResponse.json({ error: 'No liked songs provided.' }, { status: 400 });
  }

  const chunkSize = 100;
  let result = new Response();
  for (let i = 0; i < likedSongs.length; i += chunkSize) {
    const chunk = likedSongs.slice(i, i + chunkSize);
    result = await addTracksToPlaylist(playlistId, chunk, accessToken);
    if (!result.ok) {
      return NextResponse.json({ error: 'Failed to add tracks to playlist' }, { status: 500 });
    }
  }

  const data = await result.json();
  return NextResponse.json({
    added: data
  });
}
