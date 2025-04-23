'use client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPolicy() {
  const router = useRouter();
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <Button
        variant="outline"
        onClick={() => router.back()}
        className="absolute top-4 left-4 flex items-center gap-2 cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>
      <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
      <p className="mb-4">
        Your privacy is important to us. This app does not collect, store, or track any of your
        personal data.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Spotify Login</h2>
      <p className="mb-4">
        We use Spotify's OAuth login solely to access your liked songs and create a playlist on your
        behalf. Your access token is used securely on the server and is never stored or shared.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">No Data Collection</h2>
      <p className="mb-4">
        We do not collect, analyze, or store any personal data, listening history, or user behavior.
        There is no tracking, analytics, cookies, or external scripts involved.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Playlist Creation</h2>
      <p className="mb-4">
        Once logged in, the app reads your liked tracks and creates a new public playlist under your
        Spotify account. You can optionally rename the playlist or upload a cover image. This data
        is sent directly to Spotify.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Hosting</h2>
      <p className="mb-4">
        This app is hosted on Vercel. No user-specific data is logged or stored on our servers.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Questions</h2>
      <p className="mb-4">
        If you have any questions or concerns about this privacy policy, feel free to reach out to
        <a href="mailto:mikeunge@protonmail.com"> mikeunge@protonmail.com</a>.
      </p>
    </div>
  );
}
