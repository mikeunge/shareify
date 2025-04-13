import { NextResponse } from 'next/server';
import { SPOTIFY_CLIENT_ID, SPOTIFY_REDIRECT_URI, SCOPE } from '@/lib/spotify';

export async function GET() {
  const scopes = [
    SCOPE.UserLibraryRead,
    SCOPE.UserImageUpload,
    SCOPE.PlaylistModifyPrivate,
    SCOPE.PlaylistModifyPublic
  ].join(' ');

  const url = new URL('https://accounts.spotify.com/authorize');
  url.searchParams.append('client_id', SPOTIFY_CLIENT_ID!);
  url.searchParams.append('response_type', 'code');
  url.searchParams.append('redirect_uri', SPOTIFY_REDIRECT_URI!);
  url.searchParams.append('scope', scopes);

  return NextResponse.json({ url: url.toString() });
}
