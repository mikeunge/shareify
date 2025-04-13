'use client';
import { useState } from 'react';
import { toast } from 'sonner';

import { Toaster } from '@/components/ui/sonner';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog';

import Spinner from '@/components/spinner';
import Footer from '@/components/footer';

export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [playlistUrl, setPlaylistUrl] = useState('');
  const [totalLikedSongs, setTotalLikedSongs] = useState(0);
  const [likedSongs, setLikedSongs] = useState([]);
  const [privatePlaylist, setPrivatePlaylist] = useState(true);
  const [playlistName, setPlaylistName] = useState('');
  const [playlistCover, setPlaylistCover] = useState<File | null>(null);

  const getTotalLikedSongs = async (): Promise<number> => {
    const res = await fetch('/api/likes', { method: 'GET', credentials: 'include' });
    if (!res.ok) {
      console.error('Failed to fetch total liked songs:', res.statusText);
      throw new Error('Failed to fetch total liked songs.');
    }
    const data = await res.json();
    setTotalLikedSongs(data.total);
    return data.total;
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
      },
      body: JSON.stringify({
        playlistTitle: playlistName || 'Liked Songs Playlist',
        isPublic: !privatePlaylist
      })
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
    return data.added;
  };

  const handleCreate = async () => {
    try {
      setLoading(true);
      const likedSongs = await getTotalLikedSongs();
      const likedSongsEmoji =
        likedSongs > 500 ? (likedSongs > 1000 ? (likedSongs > 5000 ? '💀' : '🤯') : '🫡') : '👍';
      toast(`You have ${likedSongs} liked songs ${likedSongsEmoji}`);
      const songs = await getLikedSongs();
      toast(
        `Fetched all the songs! Starting to add them to ${playlistName || 'Liked Songs Playlist'} 🚀`
      );
      const playlistId = await createPlaylist();
      await addTracksToPlaylist(playlistId, songs);
      toast('Playlist created successfully! 🎉');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      toast(`An error occurred: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  /**
   * What's next?
   * - Show the playlist URL and maybe the image of the playlist to click
   * - Add image upload for playlist cover
   * - Check if playlist already exists and ask if the user wants to overwrite it
   */

  return (
    <main className="min-h-screen bg-secondary">
      <div className="min-h-screen relative flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/background.svg')",
            filter: 'blur(8px)'
          }}
        ></div>

        {/* Loading spinner */}
        {loading && (
          <div className="absolute inset-0 bg-black opacity-30 flex items-center justify-center">
            <div className="mt-80">
              <Spinner size={100} />
            </div>
          </div>
        )}

        <div className="flex flex-col items-center justify-center z-10">
          <h1 className="text-6xl text-white font-bold mb-4">Export your liked songs</h1>
          <button
            onClick={handleCreate}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            disabled={loading}
          >
            {loading ? 'Creating Playlist...' : 'Create Playlist from Liked Songs'}
          </button>

          <div className="mt-4">
            <Dialog>
              <DialogTrigger asChild={true}>
                <Button variant="outline">Settings</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Settings</DialogTitle>
                  <DialogDescription>
                    Customize your export settings here. Set your playlist name, choose its privacy,
                    and upload a cover image.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Playlist Title
                    </Label>
                    <Input
                      id="name"
                      value={playlistName}
                      onChange={(e) => setPlaylistName(e.target.value)}
                      placeholder="Liked Songs Playlist"
                      className="col-span-3 bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="picture">Cover Image</Label>
                    <Input
                      id="picture"
                      className="col-span-3 bg-white"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) {
                          toast('No file selected. Please choose a valid image file. 😵‍💫');
                          return;
                        }
                        setPlaylistCover(file);
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-end gap-4">
                    <Label htmlFor="privatePlaylist" className="mr-2">
                      Create public playlist?
                    </Label>
                    <Switch
                      id="privatePlaylist"
                      checked={privatePlaylist}
                      onCheckedChange={setPrivatePlaylist}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild={true}>
                    <Button type="button" variant="default">
                      Close
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* update because this looks not so nice lol */}
          {playlistUrl && (
            <p className="mt-6 text-white">
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
        </div>
        <div className="absolute bottom-0 -mt-24 pb-2">
          <Footer textColor="text-white" />
        </div>
      </div>
      <Toaster />
    </main>
  );
}
