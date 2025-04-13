export const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID!;
export const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET!;
export const SPOTIFY_REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI!;

export enum SCOPE {
  UserLibraryRead = 'user-library-read',
  UserImageUpload = 'ugc-image-upload',
  PlaylistModifyPrivate = 'playlist-modify-private',
  PlaylistModifyPublic = 'playlist-modify-public'
}

export const getLikedSongs = async (
  accessToken: string,
  limit: number,
  offset: number
): Promise<Response> => {
  return fetch(`https://api.spotify.com/v1/me/tracks?limit=${limit}&offset=${offset}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
};

export const getSpotifyProfile = async (accessToken: string): Promise<Response> => {
  return fetch('https://api.spotify.com/v1/me', {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
};

export const getPlaylistCover = async (
  accesToken: string,
  playlistId: string
): Promise<Response> => {
  return fetch(`https://api.spotify.com/v1/playlists/${playlistId}/images`, {
    headers: {
      Authorization: `Bearer ${accesToken}`
    }
  });
};

export const setPlaylistCover = async (
  accessToken: string,
  playlistId: string,
  image: string
): Promise<Response> => {
  const res = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/images`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'image/jpeg'
    },
    body: image
  });
  return res;
};

export const createPlaylist = async (
  userId: string,
  accessToken: string,
  playlistName = 'Liked Songs Playlist',
  isPublic = true
): Promise<Response> => {
  return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: playlistName,
      description: 'Created with love by Shareify <3',
      public: isPublic
    })
  });
};

export const addTracksToPlaylist = async (
  playlistId: string,
  uris: string[],
  accessToken: string
): Promise<Response> => {
  return fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      uris
    })
  });
};

export const getSpotifyAuthToken = async (code: string): Promise<Response> => {
  return fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: SPOTIFY_REDIRECT_URI!
    })
  });
};
