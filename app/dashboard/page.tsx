'use client';
import { useState } from 'react';

export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [playlistUrl, setPlaylistUrl] = useState('');

  const handleCreate = async () => {
    setLoading(true);
    const res = await fetch('/api/create-playlist', { method: 'POST', credentials: 'include' });
    const data = await res.json();
    setPlaylistUrl(data.playlistUrl);
    setLoading(false);
  };

  return (
    <main className="p-6 text-center">
      <h1 className="text-2xl font-bold mb-4">Your Liked Songs</h1>
      <button
        onClick={handleCreate}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? 'Creating Playlist...' : 'Create Playlist from Liked Songs'}
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
