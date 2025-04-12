'use client';
import { useState } from 'react';

export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [playlistUrl, setPlaylistUrl] = useState('');
  const [totalLikedSongs, setTotalLikedSongs] = useState(0);
  const [likedSongs, setLikedSongs] = useState([]);

  const getTotalLikedSongs = async (): Promise<void> => {
    const res = await fetch('/api/likes', { method: 'GET', credentials: 'include' });
    if (!res.ok) {
      console.error('Failed to fetch total liked songs:', res.statusText);
      throw new Error('Failed to fetch total liked songs.');
    }
    const data = await res.json();
    setTotalLikedSongs(data.total);
  };

  const getLikedSongs = async (): Promise<string[]> => {
    const res = await fetch('/api/likes/songs', { method: 'GET', credentials: 'include' });
    if (!res.ok) {
      console.error('Failed to fetch liked songs:', res.statusText);
      throw new Error('Failed to fetch liked songs.');
    }
    const data = await res.json();
    setLikedSongs(data.songs);
    return data.songs;
  };

  const createPlaylist = async (): Promise<string> => {
    const res = await fetch('/api/playlist/create', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (!res.ok) {
      console.error('Failed to create playlist:', res.statusText);
      throw new Error('Failed to create playlist.');
    }
    const data = await res.json();
    setPlaylistUrl(data.playlistUrl);
    return data.playlistId;
  };

  const addTracksToPlaylist = async (playlistId: string, songs: string[]): Promise<void> => {
    const res = await fetch('/api/playlist/add', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ playlistId, likedSongs: songs })
    });
    if (!res.ok) {
      console.error('Failed to add tracks to playlist:', res.statusText);
      throw new Error('Failed to add tracks to playlist.');
    }
    const data = await res.json();
    console.info('Tracks added to playlist:', data.added);
    return data.added;
  };

  const handleCreate = async () => {
    try {
      setLoading(true);
      await getTotalLikedSongs();
      const songs = await getLikedSongs();
      const playlistId = await createPlaylist();
      await addTracksToPlaylist(playlistId, songs);
    } catch (error) {
      console.error('Error creating playlist:', error);
      return;
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-6 text-center">
      <h1 className="text-2xl font-bold mb-4">Your Liked Songs</h1>
      {loading && <p className="mb-4">Total songs: {totalLikedSongs}</p>}
      <button
        onClick={handleCreate}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? `Creating Playlist... ` : 'Create Playlist from Liked Songs'}
      </button>
      {playlistUrl && (
        <p className="mt-6">
          ✅ Playlist created:{' '}
          <a
            href={playlistUrl}
            target="_blank"
            className="text-green-600 underline"
            rel="noreferrer"
          >
            Open in Spotify
          </a>
        </p>
      )}
    </main>
  );
}
