'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';
import { ChevronRight } from 'lucide-react';

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
  const [createdPlaylistCover, setCreatedPlaylistCover] = useState<string>('');
  const [base64Image, setBase64Image] = useState('');

  let baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  if (baseUrl.endsWith('/')) {
    baseUrl = baseUrl.slice(0, -1);
  }

  // biome-ignore lint: any is ok here
  const handleImageUpload = (e: any) => {
    const file = e.target.files[0];
    if (!file) {
      toast('No file selected, please try again.');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        const base64Size = (reader.result.length * 3) / 4 - (reader.result.endsWith('==') ? 2 : 1);
        if (base64Size > 256 * 1024) {
          toast('Image size exceeds limit, please choose a smaller image and try again.');
          return;
        }
        const base64Image = reader.result
          .replace('data:image/jpeg;base64,', '')
          .replace('data:image/png;base64,', '');
        setBase64Image(base64Image);
      } else {
        toast('Failed to read file, please try again.');
      }
    };
    reader.readAsDataURL(file);
  };

  const getTotalLikedSongs = async (): Promise<number> => {
    const res = await fetch(`${baseUrl}/api/likes`, { method: 'GET', credentials: 'include' });
    if (!res.ok) {
      console.error('Failed to fetch total liked songs:', res.statusText);
      throw new Error('Failed to fetch total liked songs.');
    }
    const data = await res.json();
    setTotalLikedSongs(data.total);
    return data.total;
  };

  const getLikedSongs = async (): Promise<string[]> => {
    const res = await fetch(`${baseUrl}/api/likes/songs`, {
      method: 'GET',
      credentials: 'include'
    });
    if (!res.ok) {
      console.error('Failed to fetch liked songs:', res.statusText);
      throw new Error('Failed to fetch liked songs.');
    }
    const data = await res.json();
    setLikedSongs(data.songs);
    return data.songs;
  };

  const getPlaylistCover = async (playlistId: string): Promise<void> => {
    const res = await fetch(`${baseUrl}/api/playlist/cover?id=${playlistId}`, {
      method: 'GET',
      credentials: 'include'
    });
    if (!res.ok) {
      console.error('Failed to fetch playlist cover:', res.statusText);
      throw new Error('Failed to fetch playlist cover.');
    }
    const data = await res.json();
    setCreatedPlaylistCover(data.url);
  };

  const setPlaylistCover = async (playlistId: string): Promise<void> => {
    const res = await fetch(`${baseUrl}/api/playlist/cover`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ playlistId, image: base64Image })
    });
    if (!res.ok) {
      console.error('Failed to set playlist cover:', res.statusText);
      toast('Failed to set playlist cover.');
      return;
    }
    toast('Cover image uploaded successfully! 🎨');
  };

  const createPlaylist = async (): Promise<string> => {
    const res = await fetch(`${baseUrl}/api/playlist/create`, {
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
    const res = await fetch(`${baseUrl}/api/playlist/add`, {
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
      if (base64Image.length > 0) {
        await setPlaylistCover(playlistId);
      }
      await getPlaylistCover(playlistId);
      toast('Playlist created successfully! 🎉');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      toast(`An error occurred: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

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

        <div className="flex flex-col items-center justify-center z-10">
          {!loading && !createdPlaylistCover && (
            <h1 className="text-6xl text-white font-bold mb-4">Export your liked songs</h1>
          )}
          {loading && (
            <h1 className="text-6xl text-white font-bold mb-4">Exporting your liked songs</h1>
          )}
          {!loading && createdPlaylistCover && (
            <h1 className="text-6xl text-white font-bold mb-4">Exported your liked songs</h1>
          )}

          {!loading && createdPlaylistCover && (
            <h4 className="text-lg text-white -mt-2">Successfully exported your likes!</h4>
          )}

          {/* Loading spinner */}
          {loading && (
            <div className="flex items-center justify-center">
              <Spinner size={100} />
            </div>
          )}

          {!loading && !createdPlaylistCover && (
            <>
              <button
                onClick={handleCreate}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                disabled={loading}
              >
                Create Playlist from Liked Songs
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
                        Customize your export settings here. Set your playlist name, choose its
                        privacy, and upload a cover image.
                        <br />
                        (Changes are saved automatically)
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
                          accept="image/jpg,image/jpeg"
                          onChange={handleImageUpload}
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
            </>
          )}

          {createdPlaylistCover?.length > 0 && (
            <div className="mt-8">
              <div className="hover:scale-110 transition-transform duration-300">
                <Link href={playlistUrl} target="_blank">
                  <Image src={createdPlaylistCover} alt="Playlist Cover" width={300} height={300} />
                </Link>
              </div>
              <div className="mt-6 flex flex-col items-center hover:scale-105 transition-transform duration-300">
                <Link href={playlistUrl} target="_blank" className="text-lg font-bold text-white">
                  View Playlist <ChevronRight className="inline" />
                </Link>
              </div>
            </div>
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
