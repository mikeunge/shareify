'use client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function TermsOfService() {
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
      <h1 className="text-4xl font-bold mb-6">Terms of Service</h1>

      <p className="mb-4">
        By using this app, you agree to the following terms of service. Please read them carefully.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Use of Service</h2>
      <p className="mb-4">
        This app allows you to export your Spotify liked songs into a public playlist under your
        account. You must be logged in with a valid Spotify account to use this service.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">User Responsibilities</h2>
      <p className="mb-4">
        You are responsible for complying with Spotify’s terms of use and ensuring that your account
        is used in accordance with their guidelines.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">No Guarantees</h2>
      <p className="mb-4">
        While we aim to provide a stable and reliable experience, we make no guarantees about
        uptime, functionality, or future availability of this service.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Limitation of Liability</h2>
      <p className="mb-4">
        We are not liable for any loss of data, account issues, or unexpected behavior caused by
        using this app. Use at your own discretion.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Changes to Terms</h2>
      <p className="mb-4">
        We reserve the right to update these terms at any time. Continued use of the service after
        changes constitutes acceptance of the new terms.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Contact</h2>
      <p className="mb-4">
        If you have any questions or concerns about this privacy policy, feel free to reach out to
        <a href="mailto:mikeunge@protonmail.com"> mikeunge@protonmail.com</a>.
      </p>
    </div>
  );
}
