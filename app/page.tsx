'use client';
import { Button } from '@/components/ui/button';

export default function Home() {
  const handleLogin = async () => {
    const res = await fetch('/api/auth/generate');
    const { url } = await res.json();
    window.location.href = url;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-5xl font-bold text-center">Spotify Like Exporter</h1>
      <h4 className="text-xl text-center mt-2">
        Export your (<i>private</i>) Spotify liked songs into a public playlist.
      </h4>
      <div className="mt-6">
        <Button className="px-16 py-4 hover:cursor-pointer" variant="ghost" onClick={handleLogin}>
          Login with Spotify
        </Button>
      </div>
    </div>
  );
}
